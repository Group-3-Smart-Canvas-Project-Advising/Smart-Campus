Here's a comprehensive Git command cheat sheet:

<span style = color:orange;>
*** I generated this with Claude, so it might have some errors, just double check if you have any problems. ***
</span>

## 🎯 Basic Setup

```bash
# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check your config
git config --list

# Get help
git help <command>
```

## 📦 Repository Basics

```bash
# Initialize a new repo
git init

# Clone an existing repo
git clone <repository-url>
git clone <repository-url> <folder-name>

# Check repo status
git status

# View commit history
git log
git log --oneline              # Compact view
git log --graph --oneline      # Visual branch graph
git log -n 5                   # Last 5 commits
```

## 📝 Making Changes

```bash
# Stage files
git add <file>                 # Stage specific file
git add .                      # Stage all in current directory
git add -A                     # Stage all changes everywhere
git add *.js                   # Stage all .js files

# Unstage files
git reset <file>               # Unstage specific file
git reset                      # Unstage all

# Commit changes
git commit -m "Commit message"
git commit -am "Message"       # Add and commit tracked files
git commit --amend             # Modify last commit

# Remove files
git rm <file>                  # Delete and stage removal
git rm --cached <file>         # Remove from git, keep locally

# View changes
git diff                       # Unstaged changes
git diff --staged              # Staged changes
git diff <commit1> <commit2>   # Between commits
```

## 🌿 Branching

```bash
# List branches
git branch                     # Local branches
git branch -a                  # All branches (local + remote)
git branch -r                  # Remote branches

# Create branch
git branch <branch-name>
git checkout -b <branch-name>  # Create and switch

# Switch branches
git checkout <branch-name>
git switch <branch-name>       # Newer command

# Rename branch
git branch -m <old-name> <new-name>
git branch -m <new-name>       # Rename current branch

# Delete branch
git branch -d <branch-name>    # Safe delete (merged only)
git branch -D <branch-name>    # Force delete
```

## 🔄 Merging & Rebasing

```bash
# Merge branch into current branch
git merge <branch-name>

# Rebase current branch onto another
git rebase <branch-name>

# Abort merge/rebase
git merge --abort
git rebase --abort

# Continue after resolving conflicts
git rebase --continue
```

## 🌐 Remote Repositories

```bash
# View remotes
git remote -v

# Add remote
git remote add origin <url>
git remote add <name> <url>

# Remove remote
git remote remove <name>

# Rename remote
git remote rename <old> <new>

# Fetch from remote (don't merge)
git fetch origin
git fetch --all                # All remotes

# Pull from remote (fetch + merge)
git pull origin <branch-name>
git pull                       # Current branch

# Push to remote
git push origin <branch-name>
git push -u origin <branch-name>  # Set upstream
git push                          # Push current branch
git push --all                    # Push all branches

# Force push (DANGEROUS!)
git push -f origin <branch-name>
git push --force-with-lease       # Safer force push
```

## ⏪ Undoing Changes

```bash
# Discard local changes
git checkout -- <file>         # Discard file changes
git checkout .                 # Discard all changes

# Revert commit (create new commit)
git revert <commit-hash>

# Reset to previous commit
git reset --soft HEAD~1        # Keep changes staged
git reset --mixed HEAD~1       # Keep changes unstaged (default)
git reset --hard HEAD~1        # DISCARD all changes

# Reset to specific commit
git reset --hard <commit-hash>

# Restore file from commit
git checkout <commit-hash> -- <file>
```

## 🏷️ Tags

```bash
# List tags
git tag

# Create tag
git tag <tag-name>
git tag -a v1.0 -m "Version 1.0"  # Annotated tag

# Push tags
git push origin <tag-name>
git push origin --tags         # Push all tags

# Delete tag
git tag -d <tag-name>          # Local
git push origin --delete <tag-name>  # Remote
```

## 🔍 Inspection & Comparison

```bash
# Show commit details
git show <commit-hash>

# Show file at specific commit
git show <commit-hash>:<file>

# List files in commit
git diff-tree --no-commit-id --name-only -r <commit-hash>

# Find who changed a line
git blame <file>

# Search commits
git log --grep="search term"
git log --author="author name"
```

## 🗑️ Cleanup

```bash
# Remove untracked files
git clean -n                   # Dry run (preview)
git clean -f                   # Remove files
git clean -fd                  # Remove files and directories

# Prune deleted remote branches
git remote prune origin
git fetch --prune
```

## 💾 Stashing

```bash
# Save work temporarily
git stash
git stash save "message"
git stash -u                   # Include untracked files

# List stashes
git stash list

# Apply stash
git stash apply                # Apply latest
git stash apply stash@{2}      # Apply specific stash
git stash pop                  # Apply and remove

# Drop stash
git stash drop stash@{0}
git stash clear                # Remove all stashes
```

## 🔧 Useful Aliases

Add these to your `.gitconfig` or use:

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
```

## 🆘 Emergency Commands

```bash
# Lost commit? Find it!
git reflog                     # Shows all HEAD movements

# Recover deleted branch
git checkout -b <branch-name> <commit-hash>

# Undo last push (if no one pulled yet)
git push -f origin HEAD^:<branch-name>

# Fix "detached HEAD"
git checkout <branch-name>
```

## 📋 Common Workflows

### Feature Branch Workflow
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature
# Create pull request on GitHub/GitLab
```

### Update Branch with Main
```bash
git checkout main
git pull origin main
git checkout feature-branch
git merge main                 # Or: git rebase main
```

### Fix Merge Conflicts
```bash
# After git merge or git pull shows conflicts
# 1. Edit files to resolve conflicts
# 2. Stage resolved files
git add <resolved-file>
# 3. Complete merge
git commit
```

## 🚨 Best Practices

- ✅ Commit often with clear messages
- ✅ Pull before you push
- ✅ Use branches for features
- ✅ Review changes before committing (`git diff`)
- ❌ Don't commit sensitive data (passwords, API keys)
- ❌ Don't force push to shared branches
- ❌ Don't commit large binary files