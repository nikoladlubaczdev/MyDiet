---
name: automatic-git-commit
description: "Use when: the user wants to commit changes with a descriptive, professional English commit message explaining the updates."
---

# Automatic Git Commit Prompt

You are tasked with generating a clear, professional English commit message for the pending changes in the Git repository, and then committing them.

## Requirements

1. **Verify changes**: First, check what files are modified, added, or deleted using `git status` or `git diff`.
2. **Commit Message Format**: Follow standard conventional commits format:
   - `<type>(<scope>): <short description in present tense>`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
   - The message must be entirely in English (e.g. `docs(architecture): restructure project layout to feature-first design`).
3. **Execute**:
   - Add the resolved files to staging.
   - Run the commit command with the calculated message.
   - Present a short summary of the commit to the user.
