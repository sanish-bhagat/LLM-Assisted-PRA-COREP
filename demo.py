import json
from backend.core.rag import RAGManager
from backend.core.engine import ReasoningEngine
from backend.schema import AnalyzeRequest
import os
from dotenv import load_dotenv

load_dotenv()

def run_demo():
    print("--- PRA COREP Reporting Assistant Demo ---")
    
    # 1. Setup
    data_path = "./Data"
    vector_db_path = "./backend/vector_db"
    model_name = os.getenv("MODEL_NAME", "llama3:8b")
    embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    print(f"Initializing RAG (LLM: {model_name}, Embeddings: {embedding_model})...")
    rag = RAGManager(data_path, vector_db_path, embedding_model=embedding_model, base_url=base_url)
    # Force rebuild for demo if needed, or just initialize
    rag.initialize_vector_store()
    
    engine = ReasoningEngine(rag, model_name=model_name, base_url=base_url)
    
    # 2. Sample Query
    request = AnalyzeRequest(
        question="How should CET1 be reported for a bank with £120M shares, £10M earnings, £5M deductions?",
        scenario="The bank has issued ordinary shares worth £120 million. It has audited retained earnings of £10 million. There are regulatory deductions of £5 million related to intangible assets."
    )
    
    print(f"\nProcessing Query: {request.question}")
    print(f"Scenario: {request.scenario}")
    
    # 3. Analyze
    result = engine.analyze(request.question, request.scenario)
    
    # 4. Display Results
    print("\n--- RESULTS ---")
    print(json.dumps(result.model_dump(exclude={"frontend_data"}), indent=2))
    
    print("\n--- VALIDATION ---")
    print(f"Status: {result.validation.status}")
    for issue in result.validation.issues:
        print(f"- {issue}")
        
    print("\n--- AUDIT LOG ---")
    for entry in result.audit_log:
        print(f"Field: {entry['field']}")
        print(f"  Value: {entry['value']}")
        print(f"  Citation: {entry['citation']}")
        print(f"  Source Text: {entry['source_text'][:100]}...")

if __name__ == "__main__":
    run_demo()
