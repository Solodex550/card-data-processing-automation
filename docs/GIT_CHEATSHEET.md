# Useful terminal commands

```sh
git status                 # inspect working tree
git diff                   # review unstaged changes
git log --oneline -5       # recent commits
git switch -c feature/test # create and enter branch
git add src tests          # stage relevant changes
git commit -m "..."        # save a snapshot
git remote -v              # show GitHub and GitLab URLs
git push -u github HEAD    # push current branch to GitHub
git push gitlab HEAD       # push same branch to GitLab
git branch -a              # list local and remote branches
```

- GitHub **Pull Request** and GitLab **Merge Request** serve similar review purposes.
- GitHub Actions YAML lives under `.github/workflows/`; GitLab CI YAML is `.gitlab-ci.yml`.
- Keep the repo private until you confirm you have permission to publish your own work.
- If you accidentally commit a secret, revoke/rotate it first; deleting it from a later commit is not enough.
