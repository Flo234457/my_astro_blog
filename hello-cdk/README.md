# BookMarks SSR infrastructure

This CDK app builds the Astro project's root `Dockerfile` and deploys the
standalone Node server to ECS Fargate behind an Application Load Balancer.

## Useful commands

* `npm run build` type-check the CDK app
* `npm run test` run the CDK tests
* `npm run cdk -- synth` synthesize the `StaticSiteStack` template
* `npm run cdk -- diff` compare the stack with the deployed version
* `npm run cdk -- deploy` deploy the stack (AWS credentials and CDK bootstrap required)
