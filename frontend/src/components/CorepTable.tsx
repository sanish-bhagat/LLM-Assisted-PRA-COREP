import { Download } from "lucide-react";
import type { CorepRow } from "@/types/report";

interface CorepTableProps {
  data: CorepRow[];
}

function exportToCSV(data: CorepRow[]) {
  const headers = "Code,Item,Amount";
  const rows = data.map((r) => `"${r.code}","${r.item}","${r.amount}"`).join("\n");
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "corep_extract.csv";
  link.click();
  URL.revokeObjectURL(url);
}

const CorepTable = ({ data }: CorepTableProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {data.length} row{data.length !== 1 ? "s" : ""} extracted
        </p>
        <button
          onClick={() => exportToCSV(data)}
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
              <th>Code</th>
              <th>Item</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="font-mono text-xs text-primary font-medium whitespace-nowrap">
                  {row.code}
                </td>
                <td>{row.item}</td>
                <td className="text-right font-mono font-medium whitespace-nowrap">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorepTable;
