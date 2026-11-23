# Automation Interview Demo — VS Code / GitHub / GitLab / Docker

A **synthetic, independent** TypeScript/Node.js data-processing mini-project for software developer screen-sharing demonstrations. Its generic extract/validate/mask/report flow resembles many UiPath-style ETL automations, but **does not include the user's employer-specific workflow, interfaces, SQL, transaction formats, credentials, or real customer information**. It is not a live banking integration.

## What it demonstrates

- Read a CSV feed; verify the header and each row
- Reject duplicate IDs, malformed account-like numbers and unknown statuses
- Replace an account-like value with asterisks except the final 4 digits
- Produce a sanitized CSV plus JSON audit counts
- Run unit tests from VS Code's terminal
- Build a Docker image; run in an isolated container
- Trigger CI in both **GitHub Actions** and **GitLab CI**

## Start in VS Code

Requires Node.js **22** or newer; Git; VS Code. Docker is optional for the first demo.

```sh
code .
node --version
npm test
npm run demo
cat output/processed.csv
cat output/audit.json
```

All examples are generated fake records; no network calls or credentials.

## Run using Docker

```sh
docker build -t automation-interview-demo .
docker run --rm automation-interview-demo
```

To retrieve output on macOS/Linux/Git Bash:

```sh
mkdir -p output
docker run --rm -v "$(pwd)/output:/app/output" automation-interview-demo
```

Windows PowerShell volume mount:

```powershell
docker run --rm -v "${PWD}/output:/app/output" automation-interview-demo
```

## Push to GitHub *and* GitLab

1. Create empty **private** repositories named `automation-interview-demo` on both websites. **Do not** initialize the remote with a README, `.gitignore`, or license; this project already has files.
2. Open the extracted directory in VS Code. In Terminal, run:

```sh
git init -b main
git add .
git status
git commit -m "Initial commit: synthetic data automation demo"
git remote add github https://github.com/YOUR-USERNAME/automation-interview-demo.git
git remote add gitlab https://gitlab.com/YOUR-USERNAME/automation-interview-demo.git
git push -u github main
git push gitlab main
```

Replace `YOUR-USERNAME` with the correct account or namespace. GitHub and GitLab may ask you to authenticate via browser, Git Credential Manager, SSH keys or a personal access token; never put tokens into your code or commit them.

3. Open GitHub → **Actions**, and GitLab → **Build > Pipelines**, to see the CI results.
4. Branch to practice change review:

```sh
git switch -c feature/add-suspended-status
# Change code and add a test (see docs/INTERVIEW_EXERCISE.md)
npm test
git add src tests
git commit -m "Add SUSPENDED status support"
git push -u github feature/add-suspended-status
git push gitlab feature/add-suspended-status
```

5. In GitHub, open a **Pull Request** from the feature branch into `main`. In GitLab, open a **Merge Request** with the same branches. Don't merge until tests pass.

## Interview explanation

> "This is a small automated daily-feed processor. I designed it to validate data before writing output, mask account-like identifiers, and produce an audit summary. I manage changes through feature branches and tests. The same repository runs validation in GitHub Actions and GitLab CI, and it can be containerized with Docker. These sample records are synthetic."

## More
- [Practice feature + deliberate bug exercise](docs/INTERVIEW_EXERCISE.md)
- [Git workflow reference](docs/GIT_CHEATSHEET.md)
- [Security notes](SECURITY.md)

## Terminal-Bench practice fixture

The `terminal_bench/` folder includes an offline, independent verifier and two Dockerfile templates. This is a **practice scaffold**, not an officially calibrated Terminal-Bench submission. See `terminal_bench/README.md`.
