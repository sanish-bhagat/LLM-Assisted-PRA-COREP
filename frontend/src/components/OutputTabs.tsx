import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, ShieldCheck, BookOpen } from "lucide-react";
import CorepTable from "@/components/CorepTable";
import ValidationPanel from "@/components/ValidationPanel";
import AuditTable from "@/components/AuditTable";
import type { AnalyzeResponse } from "@/types/report";

interface OutputTabsProps {
  data: AnalyzeResponse;
}

const OutputTabs = ({ data }: OutputTabsProps) => {
  return (
    <div className="card-elevated p-5 sm:p-6 animate-fade-in-up">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Analysis Results
      </h2>

      <Tabs defaultValue="corep" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="corep" className="gap-1.5 text-xs sm:text-sm">
            <FileSpreadsheet className="h-3.5 w-3.5 hidden sm:inline" />
            COREP Extract
          </TabsTrigger>
          <TabsTrigger value="validation" className="gap-1.5 text-xs sm:text-sm">
            <ShieldCheck className="h-3.5 w-3.5 hidden sm:inline" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5 hidden sm:inline" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="corep">
          <CorepTable data={data.template} />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationPanel data={data.validation} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTable data={data.audit_trail} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutputTabs;
