import os
import pandas as pd
from pypdf import PdfReader
from langchain_core.documents import Document
from typing import List

class DocumentIngestor:
    def __init__(self, data_path: str):
        self.data_path = data_path

    def load_pdf(self, file_name: str) -> List[Document]:
        path = os.path.join(self.data_path, file_name)
        if not os.path.exists(path):
            print(f"Warning: {path} not found.")
            return []
        
        print(f"  - Loading PDF: {file_name}...")
        reader = PdfReader(path)
        documents = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text.strip():
                metadata = {
                    "source": file_name,
                    "page": i + 1,
                    "type": "regulatory_rulebook" if "ps822" in file_name else "instruction"
                }
                documents.append(Document(page_content=text, metadata=metadata))
        return documents

    def load_excel(self, file_name: str) -> List[Document]:
        path = os.path.join(self.data_path, file_name)
        if not os.path.exists(path):
            print(f"Warning: {path} not found.")
            return []
        
        # Focus on C01.00 - Own Funds
        # We'll read the excel and convert relevant parts to text descriptions
        xls = pd.ExcelFile(path)
        documents = []
        
        # Try to find sheet C01.00
        sheet_names = [s for s in xls.sheet_names if "C 01.00" in s or "C01.00" in s]
        for sheet in sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet)
            # Simple conversion: row by row description
            content = f"Template: {sheet}\n"
            content += df.to_string()
            metadata = {"source": file_name, "sheet": sheet, "type": "template_structure"}
            documents.append(Document(page_content=content, metadata=metadata))
            
        return documents

    def ingest_all(self) -> List[Document]:
        all_docs = []
        # PDFs
        all_docs.extend(self.load_pdf("ps822app1.pdf"))
        all_docs.extend(self.load_pdf("annex-ii-reporting-instructions.pdf"))
        # Excel
        all_docs.extend(self.load_excel("Annex I - Own funds templates.xlsx"))
        return all_docs
