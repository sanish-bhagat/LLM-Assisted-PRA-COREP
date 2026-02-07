import type { AnalyzeRequest, AnalyzeResponse } from "@/types/report";

const API_BASE = "http://localhost:8000";

export async function analyzeReport(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Analysis failed (${response.status}): ${errorData.detail || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // If it's a network error (like backend not running), re-throw so UI can show it
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Cannot connect to backend server. Please ensure it is running at http://localhost:8000");
    }
    throw error;
  }
}

function getMockResponse(_request: AnalyzeRequest): AnalyzeResponse {
  return {
    template: [
      { code: "C 01.00", item: "Common Equity Tier 1 (CET1) capital", amount: "€2,450,000,000" },
      { code: "C 01.00", item: "Additional Tier 1 (AT1) capital", amount: "€380,000,000" },
      { code: "C 01.00", item: "Tier 2 (T2) capital", amount: "€520,000,000" },
      { code: "C 02.00", item: "Total Risk Exposure Amount (TREA)", amount: "€18,200,000,000" },
      { code: "C 03.00", item: "CET1 Ratio", amount: "13.46%" },
      { code: "C 03.00", item: "Total Capital Ratio", amount: "18.41%" },
      { code: "C 04.00", item: "Leverage Ratio", amount: "5.12%" },
    ],
    own_funds: [
      { label: "Paid-up capital", value: "€1,200,000,000" },
      { label: "Retained earnings", value: "€950,000,000" },
      { label: "Accumulated OCI", value: "€-45,000,000" },
      { label: "Regulatory adjustments", value: "€-155,000,000" },
    ],
    sources: [
      "CRR Article 26 — CET1 Items",
      "CRR Article 36 — Deductions from CET1",
      "EBA ITS on Reporting (EU) 2021/451",
      "PRA Rulebook — Capital Buffers",
    ],
    validation: [
      { rule: "CET1 ratio ≥ 4.5%", status: "PASS", message: "CET1 ratio is 13.46%, well above the minimum requirement" },
      { rule: "Total Capital ratio ≥ 8%", status: "PASS", message: "Total Capital ratio is 18.41%, above minimum" },
      { rule: "Leverage ratio ≥ 3%", status: "PASS", message: "Leverage ratio is 5.12%, above minimum" },
      { rule: "CET1 items reconciliation", status: "PASS", message: "Sum of CET1 components matches reported total" },
      { rule: "Counter-cyclical buffer", status: "WARNING", message: "CCyB rate should be verified against latest PRA announcement" },
      { rule: "MREL compliance check", status: "FAIL", message: "MREL reporting fields C 05.01 not populated — requires subordinated debt data" },
    ],
    audit_trail: [
      { field: "CET1 Capital", value: "€2,450,000,000", source: "Balance Sheet — Equity Section", justification: "Aggregated from paid-up capital, reserves, and regulatory adjustments per CRR Art. 26" },
      { field: "Risk Exposure", value: "€18,200,000,000", source: "Risk-Weighted Assets Report", justification: "Total credit, market, and operational risk per standardized approach" },
      { field: "CET1 Ratio", value: "13.46%", source: "Calculated", justification: "CET1 / TREA = 2,450M / 18,200M = 13.46%" },
      { field: "AT1 Capital", value: "€380,000,000", source: "Capital Instruments Register", justification: "AT1 bonds issued meeting CRR Art. 52 criteria" },
      { field: "Leverage Exposure", value: "€47,851,562,500", source: "Leverage Ratio Report", justification: "Total exposure measure per CRR Art. 429" },
    ],
  };
}
