---
name: automatic-git-commit
description: "Use when: the user wants to commit and push changes with an automatically generated, descriptive English commit message explaining the updates."
---

# Automatic Git Commit & Push Prompt

You are tasked with analyzing the current unstaged and staged changes, generating a clear, professional English commit message, adding all changes to staging, committing them, and pushing to the remote repository.

## Requirements

1. **Verify & Stage changes**: Check what files are modified, added, or deleted using `git status` or `git diff`. Automatically stage all changed files (except those that are intentionally ignored in `.gitignore`) using `git add -A`.
2. **Analyze Changes**: Look at the actual diff of the staged changes (`git diff --cached`) to fully understand what was modified.
3. **Commit Message Format**: Follow standard conventional commits format:
   - `<type>(<scope>): <short description in present tense>`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
   - The message must be entirely in English (e.g., `docs(architecture): propose feature-first design structure`).
   - Keep the summary short (under 72 characters) and written in the present tense. Avoid words like "reorganize" if it's the first time these files are introduced.
4. **Execute**:
   - Run the commit command with the generated message.
   - Automatically run `git push origin HEAD` (or push to the current branch) to send the changes to the remote repository.
   - Present a short summary of the commit and the push status to the user.
