# ADR-001: Transition from Static Site to Containerized SSR Runtime

## Status
Accepted (Date: 2026-09-28)

## Context
Our platform requires dynamic API endpoints, including `/api/health` and `/api/feedback`, to support operational health checks and user feedback functionality.

Static hosting on Amazon S3 cannot execute server-side Node.js code. Therefore, the existing static-site architecture cannot independently support these server-side API endpoints.

## Decision
We will configure Astro to use the `@astrojs/node` adapter in standalone mode and package the application as a Docker container.

This will allow the application to run in a Node.js server environment, supporting server-side rendering and dynamic API routes.

## Consequences

### Positive
- Enables live API routes, including `/api/health` and `/api/feedback`.
- Supports dynamic server-side rendering.
- Provides operational health checks to monitor application status.
- Docker packaging provides a consistent runtime environment across development and deployment.

### Negative
- Increases operational complexity compared with static hosting.
- Requires a container-compatible compute runtime to run the application.
- Introduces additional responsibilities for container configuration, deployment, monitoring, and maintenance.