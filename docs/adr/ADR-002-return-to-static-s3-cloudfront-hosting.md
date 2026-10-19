# ADR-002: Return to Static S3 and CloudFront Hosting only on a specific branch

## Status
Superseded on 2026-10-19 by [ADR-001](./ADR-001-transition-to-ssr-and-containers.md).

## Context
The Astro site is deployed as static assets to a private S3 bucket and served through CloudFront. The deployment expects the build to contain `dist/index.html`, which CloudFront serves as the default root object.

The SSR configuration introduced in ADR-001 produced a Node.js server build under `dist/server` and client assets under `dist/client`, rather than a root-level `dist/index.html`. The deployment workflow continued uploading `dist` to S3 as a static website. As a result, requests to the CloudFront domain returned an S3 `AccessDenied` error.

The current site consists of pages that can be generated at build time and does not require a running Node.js server. Its API health endpoint can also be generated as a static response.

## Decision
We will use Astro's static output and continue deploying the generated `dist` directory to the private S3 bucket behind CloudFront.

CloudFront will use its default root object for `/` and a viewer-request CloudFront Function to rewrite extensionless page routes, such as `/about`, `/signin`, and `/signup`, to their generated `index.html` files. Requests for the root, API routes, and paths containing a file extension will not be rewritten.

ADR-001 is superseded because its SSR and container runtime decision does not match the current static hosting and application requirements.

## Consequences

### Positive
- The build produces the `dist/index.html` expected by the S3 and CloudFront deployment.
- Pages can be served without operating a Node.js application server.
- Extensionless page URLs resolve to generated static pages.
- The deployment remains aligned with the existing S3 bucket and CloudFront infrastructure.

### Negative
- Server-rendered pages and request-time API logic are not supported by this hosting model.
- Future server-side features will require reconsidering the hosting architecture.
- CloudFront route rewrites must remain aligned with Astro's generated page paths.
