import os
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from schema import AnalyzeRequest, AnalysisResult
from core.rag import RAGManager
from core.engine import ReasoningEngine

# Load environment variables
load_dotenv()

app = FastAPI(title="PRA COREP Reporting Assistant API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Components
data_path = os.getenv("DATA_PATH", "Data")
vector_db_path = os.getenv("VECTOR_DB_PATH", "./vector_db")
model_name = os.getenv("MODEL_NAME", "llama3:8b")
embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

rag_manager = RAGManager(data_path, vector_db_path, embedding_model=embedding_model, base_url=base_url)
engine = ReasoningEngine(rag_manager, model_name=model_name, base_url=base_url)

@app.on_event("startup")
async def startup_event():
    # Pre-initialize vector store on startup
    # This might take a moment if documents are being processed for the first time
    try:
        rag_manager.initialize_vector_store()
        print("Vector store initialized successfully.")
    except Exception as e:
        print(f"Error initializing vector store: {e}")

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        print(f"Received analysis request: {request.question[:50]}...")
        result = engine.analyze(request.question, request.scenario)
        # Convert to frontend format before returning
        return result.to_frontend()
    except Exception as e:
        print(f"ERROR in /analyze: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
