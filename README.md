# BookMarks

BookMarks is an Astro application rendered by a Node.js server. It uses Astro's
standalone Node adapter, so pages and API routes are served at request time.

## Run locally

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

The application is available at `http://localhost:4321`. The `/api/health`
endpoint returns the server health status.

## Build and run the container

```sh
npm run check
npm run build
docker build -t bookmarks .
docker run --rm -p 4321:4321 bookmarks
```

The production image starts the standalone server from `dist/server/entry.mjs`.

## AWS deployment

The CDK application in `hello-cdk/` builds the root Dockerfile and deploys it
as an ECS Fargate service behind an Application Load Balancer. From that
directory, use the CDK CLI to synthesize or deploy the `StaticSiteStack` stack:

```sh
npm run cdk -- synth
npm run cdk -- deploy
```

AWS credentials and a bootstrapped CDK environment are required for deployment.
