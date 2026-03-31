# Release Process

## Automated Releases

Releases are automatically generated every Thursday at 09:00 UTC via GitHub Actions. The workflow:

- Analyzes commit messages since the last release
- Determines version bump (major/minor/patch) based on conventional commits
- Generates categorized release notes
- Creates and publishes the release with a new tag

## Hotfix Releases

For urgent fixes that cannot wait for the scheduled release:

1. Fix the issue in `main` branch
2. Create a hotfix branch based on the latest release tag:

```bash
git checkout -b hotfix/<description> <release-commit-hash>
git cherry-pick <fix-commit-hash>
```

3. Manually trigger the "Generate Release" workflow via GitHub Actions
4. Enter your hotfix branch name as the "Base branch for the release"

The workflow will create a new patch release from your hotfix branch.
