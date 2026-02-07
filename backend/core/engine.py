import json
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from core.rag import RAGManager
from core.validator import ReportingValidator
from schema import AnalysisResult, Sources, OwnFundsCET1, ValidationReport

class ReasoningEngine:
    def __init__(self, rag_manager: RAGManager, model_name: str = "llama3:8b", base_url: str = "http://localhost:11434"):
        self.rag_manager = rag_manager
        self.llm = ChatOllama(model=model_name, temperature=0, base_url=base_url)
        
    def analyze(self, question: str, scenario: str) -> AnalysisResult:
        # 1. Retrieve Context
        query = f"{question} {scenario}"
        context_docs = self.rag_manager.retrieve(query)
        context_text = "\n\n".join([f"Source: {d.metadata['source']}\nContent: {d.page_content}" for d in context_docs])

        # 2. Prepare Prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a senior RegTech assistant specializing in PRA COREP reporting.
            Your task is to extract capital components for template C01.00 based on the user's scenario and the provided regulatory context.
            
            RULES:
            1. Use ONLY the provided regulatory context for rules.
            2. If data is missing in the scenario, return null for that field.
            3. Every reported value must have a citation from the context.
            4. Total CET1 must be derived: common_shares + retained_earnings + accumulated_oci - deductions.
            5. Populate the audit_log with entries for each field extracted, including the citation and the exact text from the source.
            """),
            ("human", "Context:\n{context}\n\nScenario:\n{scenario}\n\nQuestion:\n{question}")
        ])

        # 3. Call LLM with structured output
        # Note: We use a wrapper or manual parse because the user asked for a specific schema structure
        # that includes internal calculation logic.
        structured_llm = self.llm.with_structured_output(AnalysisResult)
        
        try:
            print(f"Invoking LLM for structured output...")
            # We add a check for the result to handle potential parsing issues
            result = structured_llm.invoke(prompt.format(
                context=context_text,
                scenario=scenario,
                question=question
            ))
            
            print(f"LLM output received: {result}")
            
            # Run Validation Engine
            validation_report = ReportingValidator.validate_c01(result.model_dump())
            result.validation = validation_report
            
            return result
        except Exception as e:
            print(f"Error in ReasoningEngine.analyze: {str(e)}")
            import traceback
            traceback.print_exc()
            return AnalysisResult(
                template="C01.00",
                own_funds=OwnFundsCET1(common_shares=0, retained_earnings=0, accumulated_oci=0, deductions=0, total_CET1=0),
                sources=Sources(),
                validation=ValidationReport(status="FAIL", issues=[f"Error parsing LLM output: {str(e)}"]),
                audit_log=[]
            )

    # Removed _map_to_frontend as it's now in schema.py
