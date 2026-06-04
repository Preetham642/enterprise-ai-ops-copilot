# Enterprise AI Operations Copilot Architecture

## High Level Workflow

User Request
↓
FastAPI Endpoint
↓
LangGraph Workflow Engine
↓
Retrieve Enterprise Documents
↓
ChromaDB Vector Search
↓
Service Monitoring Tool
↓
Incident Ticket Tool
↓
OpenAI LLM
↓
Structured Incident Response

## Components

### API Layer

* FastAPI
* Swagger Documentation
* Request Validation

### Knowledge Layer

* Enterprise Documents
* OpenAI Embeddings
* ChromaDB Vector Store

### Workflow Layer

* LangGraph StateGraph
* Workflow Orchestration
* Incident Resolution Pipeline

### Tool Layer

* Service Status Checker
* Incident Ticket Generator

### AI Layer

* OpenAI GPT-4o-mini
* Prompt Engineering
* RAG Context Injection

## Workflow Nodes

1. retrieve_documents
2. check_service
3. create_ticket
4. generate_answer
