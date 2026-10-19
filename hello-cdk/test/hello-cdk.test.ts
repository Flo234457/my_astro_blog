import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { test } from '@jest/globals';
import { AstroSsrStack } from '../lib/hello-cdk-stack';

test('deploys the Astro server behind an application load balancer', () => {
  const stack = new AstroSsrStack(new cdk.App(), 'TestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ECS::Service', 1);
  template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
  template.resourceCountIs('AWS::S3::Bucket', 0);
  template.hasResourceProperties('AWS::ECS::Service', {
    NetworkConfiguration: {
      AwsvpcConfiguration: Match.objectLike({ AssignPublicIp: 'ENABLED' }),
    },
  });
  template.hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: Match.arrayWith([
      Match.objectLike({
        PortMappings: Match.arrayWith([
          Match.objectLike({ ContainerPort: 4321 }),
        ]),
      }),
    ]),
  });
  template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    HealthCheckPath: '/api/health',
  });
});
