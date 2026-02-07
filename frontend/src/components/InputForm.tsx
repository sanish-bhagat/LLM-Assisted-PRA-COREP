import { useState } from "react";
import { Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputFormProps {
  onSubmit: (question: string, scenario: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUESTION = "How should CET1 capital be reported under COREP C 01.00 for a UK bank?";
const EXAMPLE_SCENARIO = "A mid-sized UK bank with £2.45bn in CET1 capital, consisting of £1.2bn paid-up share capital, £950m retained earnings, £-45m accumulated OCI, and £-155m regulatory deductions. The bank uses the standardized approach for credit risk with total risk exposure of £18.2bn. AT1 instruments of £380m and T2 capital of £520m are also held.";

const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [question, setQuestion] = useState("");
  const [scenario, setScenario] = useState("");

  const isDisabled = !question.trim() || !scenario.trim() || isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      onSubmit(question, scenario);
    }
  };

  const loadExample = () => {
    setQuestion(EXAMPLE_QUESTION);
    setScenario(EXAMPLE_SCENARIO);
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Analysis Input
        </h2>
        <button
          type="button"
          onClick={loadExample}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          Load Example
        </button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="question" className="text-sm font-medium text-foreground">
          Regulatory Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How should CET1 be reported?"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="scenario" className="text-sm font-medium text-foreground">
          Reporting Scenario
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe bank capital structure, risk exposures, and relevant financial data..."
          rows={5}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isDisabled}
        className="w-full gap-2"
        size="lg"
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Analyze Report
          </>
        )}
      </Button>
    </form>
  );
};

export default InputForm;
