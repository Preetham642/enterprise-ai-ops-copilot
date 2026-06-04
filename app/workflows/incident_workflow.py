from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from app.logger import logger
from openai import OpenAI
from dotenv import load_dotenv
from app.vector_store import search_vector_store
from app.tools.service_checker import check_service_status
from app.tools.ticketing_tool import create_incident_ticket
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class IncidentState(TypedDict):
    question: str
    documents: List[Dict[str, Any]]
    service_status: Dict[str, Any]
    ticket: Dict[str, Any]
    answer: str


def retrieve_documents_node(state: IncidentState):

    logger.info("Starting document retrieval")

    documents = search_vector_store(
        state["question"]
    )

    logger.info(
        f"Retrieved {len(documents)} documents"
    )

    return {
        "documents": documents
    }


def check_service_node(state: IncidentState):

    logger.info(
        "Checking payment-api service status"
    )

    service_status = check_service_status(
        "payment-api"
    )

    logger.info(
        f"Service status: {service_status['status']}"
    )

    return {
        "service_status": service_status
    }


def create_ticket_node(state: IncidentState):

    logger.info(
        "Creating incident ticket"
    )

    ticket = create_incident_ticket(
        summary="Checkout failures increasing due to payment-api issue",
        severity="SEV-2"
    )

    logger.info(
        f"Created ticket: {ticket['ticket_id']}"
    )

    return {
        "ticket": ticket
    }


def generate_answer_node(state: IncidentState):

    logger.info(
        "Generating AI response"
    )

    context = "\n\n".join(
        [
            f"Source: {doc['source']}\nContent: {doc['content']}"
            for doc in state["documents"]
        ]
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
You are an Enterprise AI Operations Copilot.

Use the company documents, service status, and ticket data below.

Company Documents:
{context}

Service Status:
{state['service_status']}

Ticket:
{state['ticket']}

Return the answer in this format:

Summary:
Service Status:
Ticket Created:
Root Cause:
Recommended Actions:
Risk Level:
Confidence Score:
"""
            },
            {
                "role": "user",
                "content": state["question"]
            }
        ]
    )

    logger.info(
        "AI response generated successfully"
    )

    return {
        "answer": response.choices[0].message.content
    }


def build_incident_workflow():
    graph = StateGraph(IncidentState)

    graph.add_node("retrieve_documents", retrieve_documents_node)
    graph.add_node("check_service", check_service_node)
    graph.add_node("create_ticket", create_ticket_node)
    graph.add_node("generate_answer", generate_answer_node)

    graph.add_edge(START, "retrieve_documents")
    graph.add_edge("retrieve_documents", "check_service")
    graph.add_edge("check_service", "create_ticket")
    graph.add_edge("create_ticket", "generate_answer")
    graph.add_edge("generate_answer", END)

    return graph.compile()


incident_workflow = build_incident_workflow()


def run_incident_workflow(question: str):
    result = incident_workflow.invoke({
        "question": question,
        "documents": [],
        "service_status": {},
        "ticket": {},
        "answer": ""
    })

    return {
        "question": question,
        "answer": result["answer"],
        "sources": list(set([doc["source"] for doc in result["documents"]])),
        "service_status": result["service_status"],
        "ticket": result["ticket"],
        "workflow_steps": [
            "retrieve_documents",
            "check_service",
            "create_ticket",
            "generate_answer"
        ],
        "status": "success"
    }