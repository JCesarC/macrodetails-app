export type Stage = 'staging' | 'production';

export interface StageConfig {
  stage: Stage;
  /** Origins allowed to PUT files straight to the bucket with pre-signed URLs. */
  uploadOrigins: string[];
  /** Whether `cdk destroy` may delete the bucket and its objects. */
  disposable: boolean;
}

export const STAGES: Record<Stage, StageConfig> = {
  staging: {
    stage: 'staging',
    uploadOrigins: ['http://localhost:3000', 'https://*.vercel.app'],
    disposable: true,
  },
  production: {
    stage: 'production',
    uploadOrigins: [],
    disposable: false,
  },
};
