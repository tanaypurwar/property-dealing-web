# Hosting on AWS CloudFront, domain at GoDaddy

The site is static (`npm run build` → `dist/`). It's served from a private S3 bucket through
CloudFront on **www.propertydealing.in**. The domain stays registered at GoDaddy; only DNS
records change there.

```
visitor ─▶ propertydealing.in ──(GoDaddy forwarding, 301)──▶ https://www.propertydealing.in
                                                                        │ CNAME (GoDaddy DNS)
                                                                        ▼
                                                     CloudFront (HTTPS, cache, clean URLs)
                                                                        │ Origin Access Control
                                                                        ▼
                                                           S3 bucket (private): dist/
```

Files here:

| File | What it is |
| --- | --- |
| `cloudfront.yaml` | CloudFormation template: S3 bucket, CloudFront distribution, URL function, bucket policy |
| `cloudfront-function.js` | The URL function (`/about` → `/about/index.html`), also inlined in the template |
| `../scripts/deploy.mjs` | `npm run deploy`: build, upload with cache headers, clear CloudFront's cache |

You need an AWS account and the AWS CLI v2 signed in (`aws configure` or `aws sso login`).
Steps 1–4 are one-time; step 5 is every release.

---

## 1. Certificate (AWS Certificate Manager, region **us-east-1**)

CloudFront only accepts certificates from **N. Virginia (us-east-1)**, wherever the rest lives.

1. AWS console → switch region to **US East (N. Virginia)** → Certificate Manager → **Request**.
2. Public certificate. Domain names: `www.propertydealing.in` (add `propertydealing.in` too if
   you may serve the bare domain from AWS later). Validation: **DNS**.
3. ACM shows a CNAME record per name (a long `_abc123….propertydealing.in` name and a
   `….acm-validations.aws` value).
4. GoDaddy → My Products → propertydealing.in → **DNS** → Add record:
   - Type **CNAME**
   - Name: the part of ACM's record name **before** `.propertydealing.in` (GoDaddy adds the
     domain itself; pasting the full name creates `….propertydealing.in.propertydealing.in`)
   - Value: ACM's value, as shown
5. Wait until ACM says **Issued** (usually 5–30 minutes). Copy the certificate **ARN**.

CLI alternative:

```sh
aws acm request-certificate --region us-east-1 \
  --domain-name www.propertydealing.in --validation-method DNS
aws acm describe-certificate --region us-east-1 --certificate-arn <ARN>   # shows the CNAME to add
```

## 2. Create the stack (CloudFormation)

Use **Mumbai (ap-south-1)** so the bucket sits close to your visitors. CloudFront itself is global.

Console: CloudFormation (region ap-south-1) → Create stack → Upload `deploy/cloudfront.yaml` →
name it `propertydealing-site` → paste the certificate ARN → create. It takes about 5–10 minutes.

CLI:

```sh
aws cloudformation deploy --region ap-south-1 \
  --stack-name propertydealing-site \
  --template-file deploy/cloudfront.yaml \
  --parameter-overrides CertificateArn=<ARN from step 1>
```

## 3. Note the outputs

```sh
aws cloudformation describe-stacks --region ap-south-1 --stack-name propertydealing-site \
  --query "Stacks[0].Outputs" --output table
```

- **BucketName**: for `S3_BUCKET`
- **DistributionId**: for `CLOUDFRONT_DISTRIBUTION_ID`
- **DistributionDomainName**: like `d1234abcd.cloudfront.net`, used in step 4

## 4. Point the domain (GoDaddy)

1. **www → CloudFront.** GoDaddy DNS: edit the existing `www` CNAME (or add one): Name `www`,
   Value = **DistributionDomainName** from step 3. Remove any `www` A record that conflicts.
2. **Bare domain → www.** GoDaddy → propertydealing.in → **Forwarding** → Add forwarding:
   - Forward to `https://www.propertydealing.in`
   - Type **Permanent (301)**, **Forward only** (no masking)

   GoDaddy DNS can't point the bare domain straight at CloudFront, so forwarding does it. GoDaddy
   manages the `@` A records for this; leave them as GoDaddy sets them.
3. DNS changes usually show within an hour (up to 48 hours). Check:
   - `https://www.propertydealing.in/` loads the site with a padlock
   - `http://propertydealing.in` ends up at `https://www.propertydealing.in/`
   - `https://www.propertydealing.in/about` and `/about/` both load
   - `https://www.propertydealing.in/nope` shows the site's 404 page

> Note: GoDaddy's forwarding of `https://propertydealing.in` (bare domain over HTTPS) depends on
> GoDaddy issuing a certificate for it, which it normally does for forwarded domains. If it ever
> shows a certificate warning, the fix is to move DNS to Route 53 (domain stays at GoDaddy) and
> serve the bare domain from CloudFront too. Ask and we'll add that to the template.

## 5. Deploy (every release)

PowerShell:

```powershell
$env:S3_BUCKET = "<BucketName>"
$env:CLOUDFRONT_DISTRIBUTION_ID = "<DistributionId>"
npm run deploy
```

bash:

```sh
S3_BUCKET=<BucketName> CLOUDFRONT_DISTRIBUTION_ID=<DistributionId> npm run deploy
```

What it does:

1. `npm run build`
2. Uploads `dist/_astro/` (hashed CSS, JS, images) with a one-year cache
3. Uploads everything else (HTML, favicon) with `max-age=0, must-revalidate`, and deletes files
   that are no longer in the build
4. Invalidates `/*` in CloudFront

Useful flags: `npm run deploy -- --dry-run` (shows what would change, changes nothing),
`-- --print` (prints the commands only), `-- --skip-build`.

## Deploy permissions (IAM)

For a dedicated deploy user or role, this is all it needs (replace the placeholders):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::<BucketName>"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::<BucketName>/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<AccountId>:distribution/<DistributionId>"
    }
  ]
}
```

## Cost

At this site's size: S3 storage is a few rupees a month; CloudFront's free tier covers 1 TB of
transfer and 10 million requests a month. The first 1,000 invalidation paths each month are
free (each deploy uses one).

## Before going public

- Agent RERA number: `site.agentRera` in `src/config/site.ts` is still a placeholder.
- Godrej DMIC Greater Noida is published with RERA status "applied for". Advertising an
  unregistered project carries legal risk under RERA s.3 and s.10; confirm with your advisor.
- Enquiries currently arrive as pre-filled WhatsApp messages (`site.enquiryEndpoint` is empty).
