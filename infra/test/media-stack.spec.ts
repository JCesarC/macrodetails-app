import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';
import { STAGES } from '../lib/config';
import { MediaStack } from '../lib/media-stack';

function synth(stage: keyof typeof STAGES) {
  const app = new App();
  const stack = new MediaStack(app, 'Test', { config: STAGES[stage] });
  return Template.fromStack(stack);
}

describe('MediaStack', () => {
  const template = synth('staging');

  it('keeps the bucket private and encrypted', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: Match.objectLike({}),
    });
  });

  it('denies non-TLS access to the bucket', () => {
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Deny',
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
          }),
        ]),
      },
    });
  });

  it('serves the bucket only through CloudFront with Origin Access Control', () => {
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({ ViewerProtocolPolicy: 'redirect-to-https' }),
      }),
    });
  });

  it('expires abandoned browser uploads', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      LifecycleConfiguration: {
        Rules: Match.arrayWith([Match.objectLike({ Prefix: 'uploads/', ExpirationInDays: 7 })]),
      },
    });
  });

  it('retains production media on stack deletion', () => {
    const production = synth('production');
    const buckets = production.findResources('AWS::S3::Bucket');
    const policies = Object.values(buckets).map((bucket) => bucket.DeletionPolicy);

    expect(policies).toEqual(['Retain']);
  });
});
