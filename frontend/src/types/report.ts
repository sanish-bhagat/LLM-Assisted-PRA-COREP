export interface CorepRow {
  code: string;
  item: string;
  amount: string;
}

export interface ValidationItem {
  rule: string;
  status: "PASS" | "FAIL" | "WARNING";
  message: string;
}

export interface AuditEntry {
  field: string;
  value: string;
  source: string;
  justification: string;
}

export interface OwnFundsItem {
  label: string;
  value: string;
}

export interface AnalyzeResponse {
  template: CorepRow[];
  own_funds: OwnFundsItem[];
  sources: string[];
  validation: ValidationItem[];
  audit_trail: AuditEntry[];
}

export interface AnalyzeRequest {
  question: string;
  scenario: string;
}
