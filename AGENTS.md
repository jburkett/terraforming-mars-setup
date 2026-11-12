# Development workflow

- Treat each top-level implementation task in `tasks.md` as a commit boundary.
- Complete and verify each task before committing; run all relevant tests and quality checks.
- Follow red-green-refactor TDD: demonstrate the missing behavior with a failing test before implementing it, then make it pass and refactor.
- A task explicitly dedicated to writing failing tests may be committed red only when the intentional failure is documented and demonstrates missing behavior, not broken tooling.
- All tests must pass before a PR is considered ready for merge.
- Reference the task ID in each task commit message and describe the completed work.
- Stay within the authorized story or task range.
- Preserve individual task commits on the working branch. Squash merging the final PR is acceptable.
