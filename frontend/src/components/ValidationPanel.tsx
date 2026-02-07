import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { ValidationItem } from "@/types/report";

interface ValidationPanelProps {
  data: ValidationItem[];
}

const statusConfig = {
  PASS: {
    icon: CheckCircle2,
    className: "badge-pass",
    label: "PASS",
  },
  FAIL: {
    icon: XCircle,
    className: "badge-fail",
    label: "FAIL",
  },
  WARNING: {
    icon: AlertTriangle,
    className: "badge-warning",
    label: "WARNING",
  },
};

const ValidationPanel = ({ data }: ValidationPanelProps) => {
  const passCount = data.filter((d) => d.status === "PASS").length;
  const failCount = data.filter((d) => d.status === "FAIL").length;
  const warnCount = data.filter((d) => d.status === "WARNING").length;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="badge-pass">{passCount} Passed</span>
        </div>
        {warnCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="badge-warning">{warnCount} Warning{warnCount !== 1 ? "s" : ""}</span>
          </div>
        )}
        {failCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="badge-fail">{failCount} Failed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {data.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-md border border-border p-3 bg-card"
            >
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${
                item.status === "PASS" ? "text-success" :
                item.status === "FAIL" ? "text-destructive" :
                "text-warning"
              }`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{item.rule}</span>
                  <span className={config.className}>{config.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ValidationPanel;
