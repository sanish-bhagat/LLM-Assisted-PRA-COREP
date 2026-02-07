# LLM-assisted PRA COREP Regulatory Reporting Assistant

This MVP demonstrates an end-to-end system for automating PRA COREP (C01.00) reporting using RAG and structured LLM reasoning.

## Features
- **RAG Pipeline**: Ingests PRA Rulebook and COREP Instructions (PDF/Excel).
- **Reasoning Engine**: Uses Ollama (llama3:8b) to map scenarios to C01.00 components.
- **Validation**: Enforces CET1 accounting identities and regulatory constraints.
- **Auditability**: Provides citations and source text for every reported field.
- **FastAPI Backend**: Ready for integration with modern frontends.

## Project Structure
- `backend/`: Python source code.
  - `core/`: Ingestion, RAG, Engine, and Validator logic.
  - `app.py`: FastAPI entry point.
- `Data/`: Regulatory documents (PDFs and Excel).
- `demo.py`: CLI script to demonstrate the full flow.
- `setup.bat`: Quick setup for Windows (uses Conda).

## Setup Instructions
1. Ensure Ollama is running and `llama3:8b` is pulled (`ollama pull llama3:8b`).
2. Run `setup.bat` to activate `dl_env` and install dependencies.
3. Open `backend/.env` and verify `OLLAMA_BASE_URL`.
4. Run the demo:
   ```bash
   python demo.py
   ```

## Sample Query
**Question**: "How should CET1 be reported for a bank with £120M shares, £10M earnings, £5M deductions?"
**Scenario**: "The bank has issued ordinary shares worth £120 million. It has audited retained earnings of £10 million. There are regulatory deductions of £5 million related to intangible assets."

## Tech Stack
- **Backend**: Python, FastAPI
- **LLM/RAG**: LangChain, Ollama (llama3:8b)
- **Vector DB**: FAISS
- **Validation**: Pydantic
