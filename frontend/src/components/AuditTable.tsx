import { Download } from "lucide-react";
import type { AuditEntry } from "@/types/report";

interface AuditTableProps {
  data: AuditEntry[];
}

function exportAuditCSV(data: AuditEntry[]) {
  const headers = "Field,Value,Source,Justification";
  const rows = data.map((r) =>
    `"${r.field}","${r.value}","${r.source}","${r.justification}"`
  ).join("\n");
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audit_trail.csv";
  link.click();
  URL.revokeObjectURL(url);
}

const AuditTable = ({ data }: AuditTableProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {data.length} audit entr{data.length !== 1 ? "ies" : "y"}
        </p>
        <button
          onClick={() => exportAuditCSV(data)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th>Source</th>
              <th>Justification</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="font-medium whitespace-nowrap">{row.field}</td>
                <td className="font-mono text-xs whitespace-nowrap">{row.value}</td>
                <td className="text-xs text-muted-foreground">{row.source}</td>
                <td className="text-xs text-muted-foreground max-w-xs">{row.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTable;
