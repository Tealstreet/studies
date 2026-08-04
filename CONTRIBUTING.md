# Contributing

This is a mirror repository. Work here through normal pull requests; you do not
need access to the upstream Tealstreet monorepo.

## Quick Start

Install the small workflow tools once:

```bash
brew install just gh
gh auth login
```

Start a branch from the latest `master`:

```bash
just start feat/my-change
```

Run checks before opening a PR:

```bash
just check
```

Push and open the PR:

```bash
just pr
```

After the PR is merged:

```bash
just done feat/my-change
```

## Plain Git Workflow

```bash
git switch master
git pull --ff-only origin master
git switch -c feat/my-change

yarn typecheck
yarn lint
yarn test

git push -u origin HEAD
gh pr create --fill

git switch master
git pull --ff-only origin master
git branch -d feat/my-change
```

## What Belongs Here

- Runtime-neutral study metadata.
- Study calculation or rendering logic that can be publicly reviewed.
- Runtime adapters under explicit directories such as `packages/studies/src/pinejs`.

Keep app-specific account state, order state, private data sources, and
patched-chart hooks in the host app until they have a stable public contract.

## Rules

- Do not commit directly to `master`.
- Do not add release or publish automation.
- If Git reports a conflict, stop and ask in the PR.
- Keep PRs focused. A maintainer reviews and merges accepted changes.
- Merged mirror PRs sync upstream automatically.
