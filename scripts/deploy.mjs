// Builds the site and publishes dist/ to the S3 bucket behind CloudFront, then clears
// CloudFront's cache. Needs the AWS CLI v2, signed in with an account that can write to
// the bucket and create invalidations (see deploy/README.md for the IAM policy).
//
//   PowerShell:  $env:S3_BUCKET="…"; $env:CLOUDFRONT_DISTRIBUTION_ID="…"; npm run deploy
//   bash:        S3_BUCKET=… CLOUDFRONT_DISTRIBUTION_ID=… npm run deploy
//   or flags:    npm run deploy -- --bucket=… --distribution=…
//
// Options:
//   --skip-build   upload the existing dist/ without rebuilding
//   --dry-run      ask AWS what would change, without uploading or invalidating
//   --print        only print the commands; doesn't call AWS at all
//
// AWS_PROFILE and AWS_REGION are honoured by the AWS CLI as usual.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];

const bucket = option('bucket') ?? process.env.S3_BUCKET;
const distribution = option('distribution') ?? process.env.CLOUDFRONT_DISTRIBUTION_ID;
const dryRun = flag('dry-run');
const printOnly = flag('print');

if (!bucket || !distribution) {
  console.error(
    'Missing S3_BUCKET or CLOUDFRONT_DISTRIBUTION_ID. Use the BucketName and DistributionId\n' +
      'outputs of the CloudFormation stack (deploy/README.md, step 3).',
  );
  process.exit(1);
}

function run(command, commandArgs, { shell = false } = {}) {
  console.log(`\n> ${command} ${commandArgs.join(' ')}`);
  if (printOnly) return;
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell });
  if (result.error) {
    console.error(`Could not run ${command}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const dry = dryRun ? ['--dryrun'] : [];

// 1. Build. npm is a .cmd on Windows, so it needs a shell there.
if (!flag('skip-build')) run('npm', ['run', 'build'], { shell: process.platform === 'win32' });
if (!printOnly && !existsSync('dist/index.html')) {
  console.error('dist/index.html not found. Run the build first.');
  process.exit(1);
}

// 2. Hashed assets (CSS, JS, optimised images) never change under the same name: cache for a year.
//    No --delete here, so pages still cached in browsers can load the assets they reference.
run('aws', [
  's3', 'sync', 'dist/_astro', `s3://${bucket}/_astro`,
  '--cache-control', 'public,max-age=31536000,immutable',
  ...dry,
]);

// 3. Everything else (HTML, favicon, brochures): always revalidate, so updates show at once.
//    --delete removes pages that no longer exist, e.g. an unpublished project.
run('aws', [
  's3', 'sync', 'dist', `s3://${bucket}`,
  '--exclude', '_astro/*',
  '--delete',
  '--cache-control', 'public,max-age=0,must-revalidate',
  ...dry,
]);

// 4. Clear CloudFront's copies so visitors get the new pages.
if (!dryRun) {
  run('aws', ['cloudfront', 'create-invalidation', '--distribution-id', distribution, '--paths', '/*']);
}

console.log(printOnly ? '\nPrinted only; nothing ran.' : dryRun ? '\nDry run finished; nothing changed.' : '\nDeployed. Changes appear within a few minutes.');
