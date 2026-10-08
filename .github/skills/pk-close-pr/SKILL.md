---
name: pk-close-pr
description: 'Wrap up a finished PR: confirm or perform the merge, reconcile related GitHub issues, pick up to 3 follow-up issues and prepare fresh-session handoffs.'
argument-hint: '[PR number] [merge]'
disable-model-invocation: true
---

# Close PR

Run when the user is done with a PR. Default assumption: the PR is already merged. Merge it only when the invocation says so.

Use the `gh` CLI. Resolve the repo from `git remote -v` and pass `--repo <owner>/<name>` when `gh` has no default. If the repo has `docs/agents/issue-tracker.md`, follow its conventions.

## 1. Pin the PR

- PR = the number given, else the PR for the current branch (`gh pr view`). If neither resolves, ask.
- Read `gh pr view <n> --json number,title,body,state,mergedAt,mergeCommit,baseRefName,headRefName,closingIssuesReferences,commits,url,comments` and `gh pr diff <n> --name-only`.

Done when: number, state, base branch, merge commit (if any), and changed files are known.

## 2. Settle the merge

- **Already merged**: `git fetch origin`, then confirm the merge commit is on the default branch (`git merge-base --is-ancestor <sha> origin/<default>`). A stacked PR merged into another feature branch has *not landed*: report it and treat issue closures that depend on landing as pending.
- **Merge requested**: check `gh pr checks <n>`, mergeability, and review state; stop and report on red checks, conflicts, or missing approvals. Match the repo's merge method (recent default-branch history, allowed methods); ask if ambiguous. Keep the remote branch unless asked to delete it.
- **Open, no merge requested**: stop and ask.

Done when: the merge commit is confirmed on the default branch, or the user knows why not.

## 3. Reconcile issues

Gather candidates:

- `closingIssuesReferences`, plus every `#n` in the PR body, commits, and comments.
- Open issues whose scope overlaps the changed files or feature (search by PR title keywords and touched areas).
- Issues GitHub auto-closed from this PR.
- Deferred work introduced by the PR: new TODOs in the diff, review comments marked follow-up.

Give each candidate exactly one action, justified by evidence in the diff:

| Action | When | Content |
|---|---|---|
| Close | Fully delivered | What was done, PR link, merge commit, verification |
| Edit body | Partially delivered, or a discovery changes the spec | Tick delivered checklist items in place; append an `Update after #<pr>` section for scope-changing discoveries. Leave existing text intact |
| Comment | Progress or information that leaves the spec intact | Decision, gotcha, or progress note |
| Reopen | Auto-closed but incomplete | What is still missing |
| Create | Deferred work with no issue | Problem, acceptance criteria, link to PR |
| Leave | No material change | — |

Invocation authorizes these writes. Default to a comment; edit the body only for checklist ticks and spec-changing discoveries.

Done when: every candidate has one applied action and a link.

## 4. Pick follow-ups

Rank up to 3 open issues by: unblocked, unassigned, enabled by this PR, clear acceptance criteria, small scope. One line of reasoning each; flag picks that touch the same files (they conflict as parallel sessions). Ask the user which to take forward.

Done when: the user has picked, or declined.

## 5. Prepare handoffs

The issue is the single source of truth: a fresh session reads it with `gh issue view <n> --comments`. For each picked issue, check it carries goal, acceptance criteria, relevant files, verification commands, and known gotchas. Write durable gaps into the issue as a comment, or as a body edit if they change the spec (step 3).

The handoff prompt is then `/pk-work-issues #<n> ...`, plus only session-local context the issue should not hold (local environment quirks, a branch to start from). Omit extra text when the issue is complete.

Done when: each pick has a pasteable prompt in a fenced block.

## 6. Report

- Merge status and default-branch confirmation.
- Issue actions: number, action, link.
- Follow-up picks and their handoff prompts.
- Offer local cleanup: switch to the default branch and pull. Delete local branches only on request.
