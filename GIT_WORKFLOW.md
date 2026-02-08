# 🔄 Git Workflow Guide

This guide will help you keep your local changes synced with the GitHub repository.

## 📋 Quick Commands

### Check Status
```bash
git status
```
Shows which files have been modified, added, or deleted.

### Add All Changes
```bash
git add .
```
Stages all changes for commit.

### Commit Changes
```bash
git commit -m "Your descriptive message here"
```
Commits staged changes with a message.

### Push to GitHub
```bash
git push
```
Pushes committed changes to GitHub.

### Pull Latest Changes
```bash
git pull
```
Gets latest changes from GitHub.

## 🚀 Complete Sync Workflow

### Every Time You Make Changes:

```bash
# 1. Check what changed
git status

# 2. Add all changes
git add .

# 3. Commit with a descriptive message
git commit -m "feat: Add new feature" 
# or
git commit -m "fix: Fix bug in component"
# or
git commit -m "docs: Update documentation"

# 4. Push to GitHub
git push
```

## 📝 Commit Message Conventions

Use these prefixes for clear commit history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples:
```bash
git commit -m "feat: Add shopping cart functionality"
git commit -m "fix: Resolve navbar mobile menu issue"
git commit -m "docs: Update API documentation"
git commit -m "style: Format code with prettier"
git commit -m "refactor: Optimize product query"
```

## 🔄 Daily Workflow

### Morning (Start of Day)
```bash
# Get latest changes from team/other devices
git pull
```

### During Development
```bash
# After completing a feature or fix
git add .
git commit -m "feat: Your feature description"
git push
```

### End of Day
```bash
# Make sure everything is synced
git add .
git commit -m "chore: End of day commit"
git push
```

## 🛠️ Useful Commands

### View Commit History
```bash
git log --oneline
```

### View Changes Before Committing
```bash
git diff
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Discard All Local Changes
```bash
git reset --hard HEAD
```

### Create a New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branches
```bash
git checkout main
```

### Merge Branch
```bash
git checkout main
git merge feature/new-feature
```

## 🚨 Common Issues & Solutions

### Issue: "Your branch is behind 'origin/main'"
**Solution:**
```bash
git pull
```

### Issue: "Please commit your changes or stash them"
**Solution:**
```bash
# Option 1: Commit changes
git add .
git commit -m "WIP: Work in progress"

# Option 2: Stash changes
git stash
git pull
git stash pop
```

### Issue: Merge Conflicts
**Solution:**
1. Open conflicted files
2. Resolve conflicts (look for `<<<<<<<`, `=======`, `>>>>>>>`)
3. Remove conflict markers
4. Add and commit:
```bash
git add .
git commit -m "fix: Resolve merge conflicts"
git push
```

### Issue: Forgot to Pull Before Making Changes
**Solution:**
```bash
git stash
git pull
git stash pop
# Resolve any conflicts
git add .
git commit -m "Your message"
git push
```

## 🎯 Best Practices

1. **Commit Often** - Small, frequent commits are better than large ones
2. **Pull Before Push** - Always pull latest changes before pushing
3. **Write Clear Messages** - Describe what and why, not how
4. **Test Before Commit** - Make sure code works before committing
5. **Don't Commit Secrets** - Never commit `.env` files or API keys
6. **Use Branches** - Create feature branches for new work

## 🔐 Protecting Sensitive Data

Files already ignored (in `.gitignore`):
- `.env` and `.env.local`
- `node_modules/`
- `.next/`
- `backend/venv/`
- `backend/__pycache__/`

**Never commit:**
- Database credentials
- API keys
- JWT secrets
- Personal information

## 📊 Checking Sync Status

### Check if Local is Up to Date
```bash
git fetch
git status
```

### See Differences with Remote
```bash
git fetch
git diff main origin/main
```

## 🤖 Automation Tips

### Create Git Aliases (Optional)
Add to `~/.gitconfig`:
```
[alias]
    sync = !git add . && git commit -m 'chore: Auto sync' && git push
    save = !git add . && git commit -m 'WIP: Save progress'
    update = !git pull && git status
```

Then use:
```bash
git sync    # Quick sync
git save    # Save work in progress
git update  # Get latest changes
```

## 📱 Quick Reference Card

```
┌─────────────────────────────────────────┐
│         DAILY GIT WORKFLOW              │
├─────────────────────────────────────────┤
│ 1. git pull                             │
│ 2. Make your changes                    │
│ 3. git add .                            │
│ 4. git commit -m "message"              │
│ 5. git push                             │
└─────────────────────────────────────────┘
```

## 🎓 Learning Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Remember: Commit early, commit often, and always sync with the remote repository!** 🚀
