import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as path from 'node:path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class AstroSsrStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  );
}

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const logGroup = new logs.LogGroup(this, 'ApplicationLogs', {
  retention: logs.RetentionDays.ONE_WEEK,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'AstroService', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      assignPublicIp: true,
      taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      circuitBreaker: { rollback: true },
      minHealthyPercent: 100,
      taskImageOptions: {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '../..')),
  containerPort: 4321,
  logDriver: ecs.LogDrivers.awsLogs({
    streamPrefix: 'astro',
    logGroup,
  }),
},
    });

    service.targetGroup.configureHealthCheck({ path: '/api/health' });
const distribution = new cloudfront.Distribution(this, 'AstroDistribution', {
  defaultBehavior: {
    origin: new origins.LoadBalancerV2Origin(service.loadBalancer, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    }),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
  },
});
new cdk.CfnOutput(this, 'CloudFrontUrl', {
  value: `https://${distribution.distributionDomainName}`,
});
    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `http://${service.loadBalancer.loadBalancerDnsName}`,
    });
  }
}