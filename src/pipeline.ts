/**
 * Synthetic daily-data workflow for VS Code / Git / CI demonstrations.
 * No bank data, credentials, internal integrations, or external requests.
 */
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export interface InputRecord {
  record_id: string;
  customer_reference: string;
  account_number: string;
  status: Status;
}
export interface Audit {
  processed: number;
  status_counts: Record<Status, number>;
}
export interface Result {
  output: string;
  audit: Audit;
}

/** Parse RFC-4180-style CSV, including quoted commas and escaped quotes. */
export function parseCsv(source: string): string[][] {
  const text = source.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, afterQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { quoted = false; afterQuote = true; }
      else { field += c; }
    } else if (afterQuote) {
      if (c === ',') { row.push(field); field = ''; afterQuote = false; }
      else if (c === '\n' || c === '\r') {
        row.push(field); rows.push(row); row = []; field = ''; afterQuote = false;
        if (c === '\r' && text[i+1] === '\n') i++;
      } else { throw new Error('Unexpected text after closing quote'); }
    } else if (c === '"') {
      if (field.length) throw new Error('Unexpected quote in unquoted field');
      quoted = true;
    } else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      row.push(field); rows.push(row); row = []; field = '';
      if (c === '\r' && text[i+1] === '\n') i++;
    } else { field += c; }
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  if (row.length || field || afterQuote) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(v => v.length !== 0));
}

export function toCsv(rows: string[][]): string {
  return rows.map(row => row.map(v => /[",\r\n]/.test(v)
    ? `"${v.replaceAll('"', '""')}"` : v).join(',')).join('\n') + '\n';
}

export function maskAccount(value: string): string {
  if (!/^\d{12,19}$/.test(value)) throw new Error('account_number must have 12–19 digits');
  return '*'.repeat(value.length - 4) + value.slice(-4);
}

export function processFeed(source: string): Result {
  const rows = parseCsv(source);
  const expected = ['record_id', 'customer_reference', 'account_number', 'status'];
  if (!rows.length || rows[0].join('|') !== expected.join('|')) {
    throw new Error(`Expected CSV header: ${expected.join(',')}`);
  }
  if (rows.length === 1) throw new Error('Input has no data rows');
  const seen = new Set<string>();
  const counts: Audit['status_counts'] = { ACTIVE: 0, INACTIVE: 0, PENDING: 0 };
  const outputRows = [['record_id', 'customer_reference', 'masked_account', 'status']];
  for (const [i, fields] of rows.slice(1).entries()) {
    const line = i + 2;
    if (fields.length !== 4) throw new Error(`Line ${line}: expected 4 columns`);
    const [recordId, customerRef, accountNumber, statusRaw] = fields.map(v => v.trim());
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(recordId)) throw new Error(`Line ${line}: invalid record_id`);
    if (seen.has(recordId)) throw new Error(`Line ${line}: duplicate record_id`);
    if (!customerRef || customerRef.length > 60) throw new Error(`Line ${line}: invalid customer_reference`);
    if (!['ACTIVE', 'INACTIVE', 'PENDING'].includes(statusRaw)) throw new Error(`Line ${line}: unsupported status`);
    const status = statusRaw as Status;
    const masked = maskAccount(accountNumber);
    seen.add(recordId); counts[status]++;
    outputRows.push([recordId, customerRef, masked, status]);
  }
  return { output: toCsv(outputRows), audit: { processed: seen.size, status_counts: counts } };
}
