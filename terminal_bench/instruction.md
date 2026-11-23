# Offline synthetic data update task

You are in `/app` with a TypeScript CLI and synthetic CSV input in `examples/source.csv`.

Without contacting external systems, run or repair the application so it produces:

- `/app/output/processed.csv` with the input's three records and the account-like values masked except their final four digits;
- `/app/output/audit.json` with total processed records and counts by input status.

The output must not reveal full account-like numbers. Duplicate record IDs and malformed numbers must be rejected rather than silently accepted. Do not alter `examples/source.csv` or disable checks. The verifier checks both artifacts independently.
