# GitHub Branch Protection & Team Workflow Ruleset: `Ai-Stock-AnlyasisSystem`

This document defines the strict branch protection rules and development workflow for your 4-person team working on `abhijeetgorhe26/Ai-Stock-AnlyasisSystem`.

---

## 🔒 1. Main Branch Protection Settings (Enforced via `github-ruleset.json`)

Direct pushes to `main` are strictly **BLOCKED**. All changes must go through the Pull Request (PR) workflow:

- ✅ **Require a Pull Request Before Merging**: Direct commits to `main` are rejected.
- ✅ **Require 1–2 Approvals**: PRs require at least 1 approving review from a team member.
- ✅ **Dismiss Stale Approvals**: Approvals are automatically reset if new commits are pushed to the PR.
- ✅ **Require Status Checks to Pass**: Build and linter checks (`npm run build`) must pass cleanly.
- ✅ **Require Conversation Resolution**: All review threads and comments must be resolved before merging.
- ✅ **Block Force Pushes**: `git push --force` to `main` is completely prohibited (`non_fast_forward`).
- ✅ **Block Branch Deletion**: Deleting the `main` branch is prevented (`deletion`).
- 👑 **Repository Owner Merge Authority**: The Repository Admin (`actor_id: 5` in `bypass_actors`) has full authority to review, approve, and merge PRs.

---

## 🚫 2. Important Repository Settings

### Disable Auto-Merge:
Ensure GitHub does NOT merge PRs automatically without manual review:
1. Go to **Settings** ➔ **General** ➔ **Pull Requests**.
2. **Uncheck** `Allow auto-merge`.

---

## 🔄 3. Team Developer Workflow (4-Person Team)

All team members must follow this standard Git feature branch workflow:

### Step 1: Create a New Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/login  # or feature/dashboard, fix/api-port, etc.
```

### Step 2: Develop & Commit Locally
```bash
git add .
git commit -m "feat: Add login and signup pages"
```

### Step 3: Push Feature Branch to GitHub
```bash
git push -u origin feature/login
```

### Step 4: Open & Merge Pull Request
```text
feature/login
      ↓
Pull Request (GitHub)
      ↓
Status Checks Pass (npm run build)
      ↓
Team Review & Resolve Discussions
      ↓
Repository Owner Approval
      ↓
Merge into main
```

---

## 📥 4. How to Import Ruleset JSON to GitHub

Import [`github-ruleset.json`](file:///Users/abhijeetgorhe/Desktop/Final%20Year/Mega%20Project/AI%20System/Ai-Stock-AnlyasisSystem/github-ruleset.json) directly into GitHub:
1. Open GitHub ➔ Repository **Settings** ➔ **Rulesets** (under *Code and automation*).
2. Click **New ruleset** ➔ **Import a ruleset**.
3. Choose [`github-ruleset.json`](file:///Users/abhijeetgorhe/Desktop/Final%20Year/Mega%20Project/AI%20System/Ai-Stock-AnlyasisSystem/github-ruleset.json) and set status to **Active**.
