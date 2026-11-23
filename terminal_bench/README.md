# Terminal-Bench / Harbor-style practice scaffold

This is a **practice-only** task, not an official or calibrated benchmark submission. It supplies a task instruction, an agent container recipe, a separate verifier container recipe, an independent Python checker, and a reference solution script. The test checks deterministic artifacts and writes `/logs/verifier/reward.txt` with `1` or `0`.

For a quick local check without Docker:

```sh
npm run demo
ARTIFACT_DIR=output REWARD_FILE=/tmp/practice-reward.txt python3 terminal_bench/tests/verify.py
```

For Docker-based execution or evaluation, inspect the two Dockerfiles and your Harbor version's supported task layout. The Docker/Harbor runner is not available in the build environment used to package this repository.
