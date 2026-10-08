---
name: pk-work-issues
description: 'Work up to 3 GitHub issues end to end: fresh branch from latest main (or stacked), tests, browser evidence, one PR per issue.'
argument-hint: '[#issue ...] [extra instructions]'
disable-model-invocation: true
---

# Work issues

Run in a fresh session, typically after the previous PR was closed. Work up to 3 issues **sequentially**, each on its own branch, each ending in its own PR.

Use the `gh` CLI. Resolve the repo from `git remote -v` and pass `--repo <owner>/<name>` when `gh` has no default. If the repo has `docs/agents/issue-tracker.md`, follow its conventions. Read repo memory and `AGENTS.md` for environment gotchas before running anything.

## 1. Pick issues

- Issues given: use them, in the given order.
- None given: rank open issues by unblocked, unassigned, clear acceptance criteria, small scope; take up to 3. Prefer picks that touch different files, or that naturally stack.
- Read each with `gh issue view <n> --comments`; a `Handoff` comment or `Update after #<pr>` section overrides older body text.
- An issue too ambiguous to act on: ask the user, or skip it with a comment stating the open question.
- Claim each pick: `gh issue edit <n> --add-assignee @me`.

Done when: an ordered list of claimed issues, each with its acceptance criteria stated in one line.

## 2. Sync main

Unless the user says otherwise, every branch starts from the latest `origin/<default>`:

- Working tree must be clean. If it is not, stop and ask; uncommitted work belongs to the user.
- `git fetch origin`, switch to the default branch, `git pull --ff-only`. If fast-forward fails, stop and ask.
- Install dependencies when the lockfile changed since the last install.
- Run the full verification suite (tests, lint, typecheck/build: discover the commands from `package.json` and docs) and record the **baseline**: pre-existing failures are not this work's failures.

Done when: local default branch equals `origin/<default>` and the baseline is recorded.

## 3. Work each issue

For each issue in order:

1. **Branch**: `<issue>-<short-slug>`. Choose the base:
   - Latest default branch: the issue is independent of unmerged work.
   - **Stack** on the previous issue's branch: the issue depends on its unmerged code or edits the same lines. Record this; the PR base becomes that branch.
2. **Implement** in small commits that reference the issue. Keep scope to the acceptance criteria; out-of-scope findings become new issues, linked from the PR.
3. **Test**: add or update tests that pin the new behaviour. For a bug, write the regression test first and see it fail (red) before fixing.
4. **Verify**: run the full suite and compare against the baseline. Inspect the actual output, not a saved-output file path.
5. **Browser check** (when the change is user-visible): run the app, exercise the changed flow, stop the server afterwards. Capture a few screenshots: before/after for visual changes, one per key state otherwise. Publish them on the evidence branch (below).
6. **PR**: push the branch, then `gh pr create --base <base>`. Write the body with the `pr` skill when available. Include:
   - `Closes #<n>`.
   - Evidence: test run summary and embedded screenshots.
   - For stacked PRs: `Stacked on #<parent>` and the required merge order (parent first, retarget to default, then merge).
7. **Checkpoint**: append to `/memories/session/pk-work-issues.md` the baseline (once), and per issue: branch, base, PR link, verification result, open decisions, and anything the next issue relies on. Later issues and the final report read from this file, so the session can be compacted between issues without losing state.

Done when: the PR exists, the suite matches the baseline plus new passing tests, evidence is attached, and the checkpoint is written.

## Evidence branch

Screenshots live on an orphan branch `pr-evidence` that is never merged, keeping them out of the default branch. `gh` cannot upload images, so PR bodies embed them by raw URL.

- Check repo memory for how to get browser captures into the workspace.
- Use a separate worktree so the feature branch stays checked out:
  - Branch exists on origin: `git fetch origin pr-evidence && git worktree add /tmp/pr-evidence pr-evidence`.
  - Otherwise: `git worktree add --orphan -b pr-evidence /tmp/pr-evidence`.
- Copy PNGs to `/tmp/pr-evidence/<issue>-<slug>/<name>.png`, commit, `git push origin pr-evidence`, and take the commit SHA.
- Embed pinned to that SHA: `![<caption>](https://raw.githubusercontent.com/<owner>/<repo>/<sha>/<issue>-<slug>/<name>.png)`. Fetch one URL to confirm it resolves.
- Remove the worktree afterwards: `git worktree remove /tmp/pr-evidence`.

## Test integrity

A test changes only when the intended behaviour it pins changes, and the PR states why. The suite goes green through fixing code, never through deleting, skipping, or weakening tests (looser assertions, broadened mocks, `.skip`, `.only`, raised timeouts to hide flakiness).

When a test looks obsolete, leave it failing and treat it as a **user decision**:

- Open the PR as a draft.
- Add a `Needs decision` section at the top of the PR body: the test, why it looks obsolete, and the suggested change.

## 4. Report

- Per issue: branch, base (default or stacked), PR link, verification result versus baseline, decisions needed.
- Issues skipped and why; new issues created.
- Suggest `/pk-close-pr` once PRs are merged.
