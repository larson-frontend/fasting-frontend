# CI/CD for fasting-frontend

This project uses GitHub Actions for PR checks, CI, and releases. The PR workflow now matches the backend’s skip/force logic so you can intentionally skip or force runs.

## Workflows

- Pull Request Checks: `.github/workflows/pr-checks.yml`
	- Quick validation (type-check + tests)
	- Test matrix (unit/integration/e2e)
	- Breaking changes heuristic
	- Performance/build size snapshot
	- PR summary
- CI/CD Pipeline (push/PR): `.github/workflows/ci.yml`
- Release (tags/dispatch): `.github/workflows/release.yml`

## Skip/Force CI (Parity with Backend)

The PR workflow starts with a Gate step that decides whether to run the rest of the jobs.

- Docs-only auto-skip: If only docs/meta changed (Markdown, LICENSE, .github, CHANGELOG), jobs are skipped by default.
- Skip tokens (case-insensitive) in PR title or latest commit message:
	- [skip ci], [ci skip], [no ci], [skip actions], [actions skip]
	- [skip dev-ci] only affects PRs targeting develop
- Force CI in any of these ways:
	- Include [force ci] or [ci force] in PR title or latest commit message
	- Add label: ci:force
	- Manually dispatch the workflow with input force=true

Gate outputs are summarized in the PR Checks summary. When skipped, each job row is marked “⏭️ Skipped”.

### Quick Examples

- Skip all CI for a trivial docs change:
	- Commit message: "Update docs [skip ci]"
- Skip only for develop base PR:
	- PR title: "Tweak copy [skip dev-ci]"
- Force CI for docs-only PR:
	- Add label ci:force, or
	- PR title: "Docs overhaul [force ci]"
	- Or run the workflow manually with force=true

## Node and scripts

- Node: 22.x
- Test scripts:
	- test:run (Vitest run)
	- test:all (Vitest + standalone e2e smoke)
	- test:all:ci (verbose + coverage + standalone)
- Type-check: vue-tsc --noEmit

## Tips

- If PR checks don’t start for docs-only changes, that’s expected. Add ci:force or a force token to run anyway.
- Keep skip/force tokens in either the PR title or the latest commit message; matching is case-insensitive.
- Create the label ci:force in the repo if missing to enable the label-based override.
