import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .ingestion import DocumentIngestor

class RAGManager:
    def __init__(self, data_path: str, vector_db_path: str, embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2", base_url: str = "http://localhost:11434"):
        self.data_path = data_path
        self.vector_db_path = vector_db_path
        print(f"Initializing HuggingFace embeddings using model: {embedding_model}...")
        self.embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        self.vector_store = None

    def initialize_vector_store(self, force_rebuild: bool = False):
        if not force_rebuild and os.path.exists(self.vector_db_path):
            print(f"Loading existing vector store from {self.vector_db_path}...")
            self.vector_store = FAISS.load_local(self.vector_db_path, self.embeddings, allow_dangerous_deserialization=True)
            return

        print("Building new vector store. This may take a while depending on document size...")
        ingestor = DocumentIngestor(self.data_path)
        documents = ingestor.ingest_all()
        print(f"Total documents loaded: {len(documents)}")
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        splits = text_splitter.split_documents(documents)
        print(f"Total chunks created: {len(splits)}")
        
        if not splits:
            print("Warning: No documents found to index. Creating an empty vector store or skipping.")
            # We need at least one document for FAISS.from_documents to work.
            # If no docs, we'll create a dummy one to avoid the IndexError
            from langchain_core.documents import Document
            splits = [Document(page_content="No regulatory documents found.", metadata={"source": "none"})]

        print("Generating embeddings and indexing in FAISS...")
        self.vector_store = FAISS.from_documents(splits, self.embeddings)
        self.vector_store.save_local(self.vector_db_path)
        print("Vector store build complete and saved.")

    def retrieve(self, query: str, k: int = 8):
        if not self.vector_store:
            self.initialize_vector_store()
        
        return self.vector_store.similarity_search(query, k=k)
