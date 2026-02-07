from schema import AnalysisResult, ValidationReport

class ReportingValidator:
    @staticmethod
    def validate_c01(data: dict) -> ValidationReport:
        issues = []
        own_funds = data.get("own_funds", {})
        
        def get_val(key):
            val = own_funds.get(key)
            if isinstance(val, dict):
                return val.get("amount")
            return val

        common_shares = get_val("common_shares")
        retained_earnings = get_val("retained_earnings")
        accumulated_oci = get_val("accumulated_oci")
        deductions = get_val("deductions")
        total_cet1 = get_val("total_CET1")

        # Check for None/Missing
        if any(v is None for v in [common_shares, retained_earnings, accumulated_oci, deductions, total_cet1]):
            issues.append("One or more mandatory fields are missing (null).")
            return ValidationReport(status="FAIL", issues=issues)

        # Calculation Check
        calculated_total = common_shares + retained_earnings + accumulated_oci - deductions
        if abs(calculated_total - total_cet1) > 0.01:
            issues.append(f"Total CET1 mismatch. Calculated: {calculated_total}, Reported: {total_cet1}")

        # Negative Check
        if total_cet1 < 0:
            issues.append("CET1 cannot be negative.")

        status = "PASS" if not issues else "FAIL"
        return ValidationReport(status=status, issues=issues)
