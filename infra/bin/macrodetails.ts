import { App, Tags } from 'aws-cdk-lib';
import { STAGES, type Stage } from '../lib/config';
import { MediaStack } from '../lib/media-stack';

const app = new App();

const stage = (app.node.tryGetContext('stage') ?? 'staging') as Stage;
const config = STAGES[stage];
if (!config)
  throw new Error(`Unknown stage "${stage}". Use one of: ${Object.keys(STAGES).join(', ')}`);

// Account and region come from the active AWS profile (e.g. AWS_PROFILE=jcc-macro).
// Workloads live in us-east-2: the organization SCP keeps us-east-1 for global services only.
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-2',
};

new MediaStack(app, `MacroDetails-${stage}-Media`, { env, config });

Tags.of(app).add('project', 'macrodetails');
Tags.of(app).add('stage', stage);
