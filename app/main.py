from app.rag import load_documents, search_documents
from fastapi import FastAPI
from app.rag_chat import ask_rag
from app.tools.service_checker import check_service_status
from app.vector_store import build_vector_store, search_vector_store
from pydantic import BaseModel
from app.workflows.incident_workflow import run_incident_workflow
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(
    title="Enterprise AI Operations Copilot",
    version="1.0.0"
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "AI Ops Copilot is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/documents")
def get_documents():
    documents = load_documents()
    return {
        "document_count": len(documents),
        "documents": documents
    }

class SearchRequest(BaseModel):
    query: str

@app.post("/search")
def search(request: SearchRequest):
    results = search_documents(request.query)

    return {
        "query": request.query,
        "matches": results
    }

@app.get("/service/{service_name}")
def get_service_status(service_name: str):

    return check_service_status(service_name)

@app.post("/vector/build")
def build_vectors():
    return build_vector_store()


@app.post("/vector/search")
def vector_search(request: SearchRequest):
    results = search_vector_store(request.query)

    return {
        "query": request.query,
        "matches": results
    }

@app.post("/rag/chat")
def rag_chat(request: ChatRequest):
    return ask_rag(request.message)

@app.post("/workflow/incident")
def incident_workflow_endpoint(request: ChatRequest):
    return run_incident_workflow(request.message)

@app.post("/chat")
def chat(request: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
    "content": """
You are an Enterprise AI Operations Copilot.

Your responsibilities:

- Analyze incidents
- Review operational issues
- Recommend actions
- Explain technical concepts
- Provide root cause hypotheses
- Suggest next steps

Respond in the following format:

Summary:
Root Cause:
Recommended Actions:
Risk Level:
"""
            },
            {
                "role": "user",
                "content": request.message
            }
        ]
    )

    return {
        "user_message": request.message,
        "ai_response": response.choices[0].message.content,
        "status": "success"
    }