import { useState } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import OutputTabs from "@/components/OutputTabs";
import { analyzeReport } from "@/lib/api";
import type { AnalyzeResponse } from "@/types/report";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (question: string, scenario: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await analyzeReport({ question, scenario });
      setResult(response);
      toast({
        title: "Analysis Complete",
        description: `${response.template.length} COREP rows extracted, ${response.validation.length} validations run.`,
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {result ? (
              <OutputTabs data={result} />
            ) : (
              <div className="card-elevated p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] lg:min-h-[400px]">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  No Analysis Results
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Enter a regulatory question and reporting scenario, then click
                  "Analyze Report" to generate COREP template data, validation
                  results, and an audit trail.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>COREP Reporting Assistant v1.0</span>
          <span>EBA ITS (EU) 2021/451 Compliant</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
