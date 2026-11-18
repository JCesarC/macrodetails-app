import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import type { StageConfig } from './config';

export interface MediaStackProps extends StackProps {
  config: StageConfig;
}

/**
 * Product and delivery images.
 * The bucket is fully private; the only way to read it is through CloudFront
 * (Origin Access Control). Writes happen with pre-signed URLs issued by the API.
 */
export class MediaStack extends Stack {
  readonly bucket: s3.Bucket;
  readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: MediaStackProps) {
    super(scope, id, props);
    const { config } = props;

    this.bucket = new s3.Bucket(this, 'MediaBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      cors:
        config.uploadOrigins.length > 0
          ? [
              {
                allowedMethods: [s3.HttpMethods.PUT],
                allowedOrigins: config.uploadOrigins,
                allowedHeaders: ['content-type', 'cache-control'],
                maxAge: 3000,
              },
            ]
          : undefined,
      lifecycleRules: [
        { abortIncompleteMultipartUploadAfter: Duration.days(1) },
        // Browser uploads land in uploads/ first; anything not promoted is junk.
        { prefix: 'uploads/', expiration: Duration.days(7) },
      ],
      removalPolicy: config.disposable ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      autoDeleteObjects: config.disposable,
    });

    this.distribution = new cloudfront.Distribution(this, 'MediaCdn', {
      comment: `MacroDetails media (${config.stage})`,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
      },
      // North America + Europe edges only: cheapest tier, covers Mexico.
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    new CfnOutput(this, 'MediaBucketName', { value: this.bucket.bucketName });
    new CfnOutput(this, 'MediaBaseUrl', {
      value: `https://${this.distribution.distributionDomainName}`,
    });
  }
}
