"""Independent offline artifact verifier for synthetic Terminal-Bench-style practice."""
import csv
import json
import os
from pathlib import Path
import sys

root = Path(os.getenv('ARTIFACT_DIR', '/app/output'))
reward = Path(os.getenv('REWARD_FILE', '/logs/verifier/reward.txt'))
try:
    path = root / 'processed.csv'
    report = root / 'audit.json'
    assert path.is_file() and report.is_file(), 'Missing required output files'
    contents = path.read_text(encoding='utf-8')
    assert len(contents) < 100_000
    rows = list(csv.DictReader(contents.splitlines()))
    assert len(rows) == 3
    assert list(rows[0]) == ['record_id', 'customer_reference', 'masked_account', 'status']
    assert [r['record_id'] for r in rows] == ['R001', 'R002', 'R003']
    assert [r['masked_account'] for r in rows] == [
        '************4444', '************8888', '************3456'
    ]
    assert [r['status'] for r in rows] == ['ACTIVE', 'PENDING', 'INACTIVE']
    for full_number in ['1111222233334444', '5555666677778888', '1234567890123456']:
        assert full_number not in contents, 'Unmasked synthetic data'
    obj = json.loads(report.read_text(encoding='utf-8'))
    assert obj == {'processed': 3, 'status_counts': {'ACTIVE': 1, 'INACTIVE': 1, 'PENDING': 1}}
    score = '1'
except Exception as exc:
    print(f'FAIL: {exc}', file=sys.stderr)
    score = '0'
reward.parent.mkdir(parents=True, exist_ok=True)
reward.write_text(score, encoding='utf-8')
if score == '0':
    raise SystemExit(1)
print('Practice verifier passed')
