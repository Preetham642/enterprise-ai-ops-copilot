# Enterprise AI Operations Copilot

A production-style AI workflow application that simulates how enterprise operations teams can use AI to investigate incidents, retrieve internal knowledge, check service health, create incident tickets, and generate structured remediation recommendations.

## Overview

Enterprise AI Operations Copilot combines:

- FastAPI backend APIs
- React dashboard frontend
- OpenAI-powered response generation
- ChromaDB vector search
- Retrieval-Augmented Generation (RAG)
- LangGraph workflow orchestration
- Service monitoring tool simulation
- Incident ticket automation
- Structured logging

The goal of this project is to demonstrate an enterprise-ready AI workflow system, not just a basic chatbot.

## Key Features

- AI incident analysis
- Enterprise knowledge retrieval
- Semantic search using embeddings
- RAG-based response generation
- LangGraph multi-step workflow
- Service health checking tool
- Incident ticket creation tool
- Agent activity timeline
- React + Tailwind dashboard
- FastAPI REST APIs
- Swagger API documentation
- Structured application logging
- Docker support
- Secure environment variable handling

## Architecture

```text
User
↓
React Dashboard
↓
FastAPI Backend
↓
LangGraph Workflow
↓
Retrieve Documents from ChromaDB
↓
Check Service Status Tool
↓
Create Incident Ticket Tool
↓
OpenAI Response Generation
↓
Structured Incident Response