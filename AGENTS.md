# AGENTS.md - Standard for Automated Agents

This file establishes standard rules for automated agents working on the MyDiet monorepo project.

## Project Context

- **Name**: MyDiet
- **Description**: A mobile iPhone application designed for meal planning and automated shopping list aggregation, built with Expo and optimized for offline usage.
- **Stack**: Expo SDK 54, React Native (React 19), Tailwind CSS (NativeWind 4), TypeScript 5.

## Critical Operating Principles

1. **Feature-First Architecture**
   - Place all domain-specific features inside separate folders in `src/features/{feature-name}/` (e.g., `meal-planner`, `shopping-list`).
   - Keep shared components in `src/shared/components/` and shared technical types in `src/shared/types/`.
   - Never write excessively generic shared components with conditionally active logic. Duplicate component structures if they evolve separately.

2. **Clean Coding Style**
   - Only write functional React components. Avoid class components.
   - Prefer TypeScript `interface` over `type` definitions for models and props.
   - Use early returns and guard clauses. Place error-handling blocks first and the happy path last.

3. **Styling & Rendering**
   - Rely solely on Utility-First CSS using `NativeWind` via the `className` prop. Do not use standard `StyleSheet.create` or write raw CSS unless impossible with Tailwind.

4. **Git Workflow Safeguards**
   - No direct committing of features of code to `main`.
   - Use strict naming conventions: `feat/*`, `fix/*`, `chore/*`.
   - Work in branch-ready workflows, creating short-lived sub-branches before processing changes.
