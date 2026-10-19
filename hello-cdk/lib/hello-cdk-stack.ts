import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as path from 'node:path';

export class AstroSsrStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
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
      },
    });

    service.targetGroup.configureHealthCheck({ path: '/api/health' });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `http://${service.loadBalancer.loadBalancerDnsName}`,
    });
  }
}