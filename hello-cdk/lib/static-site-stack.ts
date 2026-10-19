
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'node:path';

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
const websiteBucket = new s3.Bucket(this, 'AstroStaticBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
  enforceSSL: true,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});

const urlRewriteFunction = new cloudfront.Function(this, 'AstroUrlRewrite', {
  code: cloudfront.FunctionCode.fromInline(`
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } else if (!uri.split('/').pop().includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
  `),
});

const distribution = new cloudfront.Distribution(this, 'AstroStaticDistribution', {
  defaultRootObject: 'index.html',

  defaultBehavior: {
    
functionAssociations: [
  {
    function: urlRewriteFunction,
    eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
  },
],

    origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),

    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
});

new s3deploy.BucketDeployment(this, 'DeployStaticWebsite', {
  sources: [
    s3deploy.Source.asset(path.resolve(__dirname, '../../dist')),
  ],
  destinationBucket: websiteBucket,
  distribution: distribution,
  distributionPaths: ['/*'],
});

new cdk.CfnOutput(this, 'StaticWebsiteUrl', {
  value: `https://${distribution.distributionDomainName}`,
});


  }
}
