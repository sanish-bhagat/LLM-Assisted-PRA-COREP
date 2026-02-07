from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class OwnFundsCET1(BaseModel):
    common_shares: float = Field(..., description="Common shares amount")
    retained_earnings: float = Field(..., description="Retained earnings amount")
    accumulated_oci: float = Field(..., description="Accumulated OCI amount")
    deductions: float = Field(..., description="Deductions amount")
    total_CET1: float = Field(..., description="Total CET1 amount (derived)")

class Sources(BaseModel):
    common_shares: List[str] = Field(default_factory=list, description="Regulatory citations for common shares")
    retained_earnings: List[str] = Field(default_factory=list, description="Regulatory citations for retained earnings")
    accumulated_oci: List[str] = Field(default_factory=list, description="Regulatory citations for accumulated OCI")
    deductions: List[str] = Field(default_factory=list, description="Regulatory citations for deductions")
    total_CET1: List[str] = Field(default_factory=list, description="Regulatory citations for total CET1")

class ValidationReport(BaseModel):
    status: Literal["PASS", "FAIL"]
    issues: List[str] = Field(default_factory=list)

class AuditEntry(BaseModel):
    field: str = Field(..., description="Field name")
    value: float = Field(..., description="Field value")
    citation: str = Field(..., description="Regulatory citation")
    source_text: str = Field(..., description="Excerpt from source text")

class AnalysisResult(BaseModel):
    template: str = "C01.00"
    own_funds: OwnFundsCET1 = Field(..., description="Contains CET1 components")
    sources: Sources
    validation: Optional[ValidationReport] = None
    audit_log: List[AuditEntry] = Field(default_factory=list)
    
    def to_frontend(self) -> dict:
        """Converts the backend result to the format expected by the frontend."""
        
        def get_amount(field_name: str) -> float:
            # own_funds is now a Pydantic model (OwnFundsCET1)
            val = getattr(self.own_funds, field_name, 0.0)
            try:
                return float(val) if val is not None else 0.0
            except (ValueError, TypeError):
                return 0.0

        # Map template (string) to a list of rows
        template_rows = [
            {"code": "C 01.00", "item": "Common Equity Tier 1 (CET1) capital", "amount": f"£{get_amount('total_CET1'):,.2f}"},
            {"code": "C 01.00", "item": "Common shares", "amount": f"£{get_amount('common_shares'):,.2f}"},
            {"code": "C 01.00", "item": "Retained earnings", "amount": f"£{get_amount('retained_earnings'):,.2f}"},
            {"code": "C 01.00", "item": "Accumulated OCI", "amount": f"£{get_amount('accumulated_oci'):,.2f}"},
            {"code": "C 01.00", "item": "Regulatory deductions", "amount": f"£{get_amount('deductions'):,.2f}"}
        ]
        
        # Map own_funds dict to list of label/value pairs
        own_funds_items = [
            {"label": "Common Shares", "value": f"£{get_amount('common_shares'):,.2f}"},
            {"label": "Retained Earnings", "value": f"£{get_amount('retained_earnings'):,.2f}"},
            {"label": "Accumulated OCI", "value": f"£{get_amount('accumulated_oci'):,.2f}"},
            {"label": "Deductions", "value": f"£{get_amount('deductions'):,.2f}"},
            {"label": "Total CET1", "value": f"£{get_amount('total_CET1'):,.2f}"}
        ]
        
        # Collect all sources into a flat list
        sources_list = []
        if self.sources:
            sources_list.extend(self.sources.common_shares)
            sources_list.extend(self.sources.retained_earnings)
            sources_list.extend(self.sources.accumulated_oci)
            sources_list.extend(self.sources.deductions)
        
        # Map validation status/issues
        validation_items = []
        if self.validation:
            validation_items.append({
                "rule": "CET1 Accounting Identity",
                "status": self.validation.status,
                "message": "; ".join(self.validation.issues) if self.validation.issues else "Validation passed."
            })
            
        # Map audit log
        audit_trail = []
        for entry in self.audit_log:
            audit_trail.append({
                "field": entry.field,
                "value": f"£{entry.value:,.2f}",
                "source": entry.citation,
                "justification": entry.source_text
            })
            
        return {
            "template": template_rows,
            "own_funds": own_funds_items,
            "sources": list(set(sources_list)), # Unique sources
            "validation": validation_items,
            "audit_trail": audit_trail
        }

class AnalyzeRequest(BaseModel):
    question: str
    scenario: str
