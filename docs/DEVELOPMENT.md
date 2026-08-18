# Development Guide

**Status:** Proposed until the repository is scaffolded

## 1. Proposed monorepo layout

```text
apps/
  mobile/
    app/                  # Expo Router routes
    src/
      components/
      features/
      hooks/
      services/
      stores/
      theme/
      types/
  api/
    src/
      auth/
      connections/
      downloads/
      media/
      platform-adapters/
      users/
workers/
  media-worker/
packages/
  contracts/              # Shared schemas and generated API types
  config/
  validation/
infrastructure/
docs/
```

This is a layout for a new project. Do not restructure an established codebase
solely to match this proposal once implementation has begun.

## 2. Proposed tools

- TypeScript with strict mode.
- React Native and Expo for mobile.
- Expo Router for navigation.
- Node.js with NestJS or Fastify for the API.
- PostgreSQL, Redis/BullMQ, and S3-compatible storage.
- A workspace package manager selected during scaffolding.
- ESLint, Prettier, type checking, unit tests, and dependency auditing.

Pin the runtime and package-manager versions in the repository. Commit the lockfile.

## 3. Environment configuration

Provide `.env.example` files containing names and safe descriptions only. Never
commit real secrets.

Expected configuration categories:

- Public API origin and mobile deep-link scheme.
- Database and Redis connections.
- Object-storage bucket, region, and endpoint.
- Authentication provider configuration.
- Per-platform OAuth client identifiers and server-side secrets.
- Encryption or key-management identifiers.
- Retention limits, upload limits, and feature flags.
- Logging, tracing, crash reporting, and release environment.

Validate environment variables at application startup and fail closed if required
security configuration is absent.

## 4. Branch and review workflow

- Create focused branches from the primary branch.
- Keep commits small enough to review and revert.
- Require review for changes to authentication, authorization, platform adapters,
  storage, media processing, privacy, or infrastructure.
- Include tests and documentation with behavioral changes.
- Never mix unrelated formatting or refactoring into a security-sensitive change.
- Use ADRs for decisions that materially affect architecture, compliance, cost, or
  future integrations.

## 5. Coding conventions

- Validate inputs at trust boundaries with shared schemas.
- Use explicit domain types for identifiers, platform names, job states, and errors.
- Do not expose provider-specific payloads beyond an adapter boundary.
- Pass cancellation and deadlines through network and processing operations.
- Avoid logging whole requests, responses, headers, URLs, or media metadata.
- Use structured error codes; do not parse human-readable provider messages.
- Keep controllers thin and business rules in tested services.
- Make deletion and revocation operations idempotent.

## 6. Definition of done

A change is complete when:

- Acceptance criteria are met.
- Type checking, linting, and relevant tests pass.
- Authorization and failure paths are tested.
- Logs and analytics contain no new sensitive data.
- Documentation and API contracts are updated.
- Database changes include forward and rollback considerations.
- New configuration is documented with safe defaults.
- Security-sensitive changes receive appropriate review.
- User-visible behavior is accessible and has clear error messaging.

## 7. Dependency rules

- Prefer maintained packages with clear ownership and licensing.
- Review native modules for current Expo and platform compatibility.
- Avoid packages that scrape social platforms, collect cookies, or bypass controls.
- Keep FFmpeg and media parsing dependencies patched.
- Run dependency, license, and secret checks in CI.
- Document any dependency that has access to tokens, files, network traffic, or
  analytics data.

## 8. Documentation workflow

- Update [PROJECT_STATE.md](PROJECT_STATE.md) after milestone or blocker changes.
- Update [API_DESIGN.md](API_DESIGN.md) before merging API contract changes.
- Update [SECURITY_AND_COMPLIANCE.md](SECURITY_AND_COMPLIANCE.md) when data,
  permissions, retention, or platform behavior changes.
- Add an ADR under `docs/decisions/` for durable decisions.

