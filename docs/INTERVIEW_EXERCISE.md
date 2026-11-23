# 10-minute screen-sharing exercise

**Scenario:** A stakeholder asks that feed records with a new `SUSPENDED` status should be accepted. Currently the code rejects this status.

1. Open `src/pipeline.ts` and search for `Status` and the allowed-status validation.
2. Make a new branch named `feature/add-suspended-status`.
3. Add `SUSPENDED` to the `Status` type and allowed set; initialize its audit count.
4. Add a unit test to `tests/pipeline.test.ts` for a `SUSPENDED` input row.
5. Run `npm test`, then `npm run demo`.
6. Use VS Code Source Control or `git diff` to review your changes.
7. Commit, push the branch to both GitHub and GitLab.
8. Create a PR on GitHub and an MR on GitLab, check pipelines, explain the changes.

**Optional debugging task:** Run `npm run demo:bad` and explain why the duplicate input fails with a nonzero exit status. Do not weaken input validation just to make invalid data pass.

**What to say:** Explain the expected behavior, your smallest change, test evidence, why a feature branch protects `main`, and how CI gives independent feedback.
