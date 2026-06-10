from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from app.logger import logger
from app.tools.web_search_tool import search_web
from app.tools.incident_router import detect_incident_context
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
    incident_context: Dict[str, Any]
    documents: List[Dict[str, Any]]
    web_results: List[Dict[str, Any]]
    service_status: Dict[str, Any]
    ticket: Dict[str, Any]
    answer: str


def detect_incident_node(state: IncidentState):
    logger.info("Detecting incident context")

    incident_context = detect_incident_context(state["question"])

    logger.info(f"Detected service: {incident_context['service']}")
    logger.info(f"Detected severity: {incident_context['severity']}")

    return {
        "incident_context": incident_context
    }


def retrieve_documents_node(state: IncidentState):
    logger.info("Starting document retrieval")

    documents = search_vector_store(state["question"])

    logger.info(f"Retrieved {len(documents)} documents")

    return {
        "documents": documents
    }


def web_search_node(state: IncidentState):
    logger.info("Running live web search")

    web_results = search_web(state["question"])

    logger.info(f"Retrieved {len(web_results)} web results")

    return {
        "web_results": web_results
    }


def check_service_node(state: IncidentState):
    service_name = state["incident_context"]["service"]

    logger.info(f"Checking {service_name} service status")

    service_status = check_service_status(service_name)

    logger.info(f"Service status: {service_status['status']}")

    return {
        "service_status": service_status
    }


def create_ticket_node(state: IncidentState):
    incident_context = state["incident_context"]

    logger.info("Creating incident ticket")

    ticket = create_incident_ticket(
        summary=incident_context["summary"],
        severity=incident_context["severity"],
        assigned_team=incident_context["assigned_team"]
    )

    logger.info(f"Created ticket: {ticket['ticket_id']}")

    return {
        "ticket": ticket
    }


def generate_answer_node(state: IncidentState):
    logger.info("Generating AI response")

    document_context = "\n\n".join(
        [
            f"Source: {doc['source']}\nContent: {doc['content']}"
            for doc in state["documents"]
        ]
    )

    web_context = "\n\n".join(
        [
            f"Title: {item.get('title')}\nURL: {item.get('url')}\nContent: {item.get('content')}"
            for item in state["web_results"]
        ]
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
You are an Enterprise AI Operations Copilot.

Analyze the user's incident using:
1. The actual user question
2. Detected incident context
3. Retrieved internal company documents
4. Live web search results
5. Current service status
6. Created ticket data

Do not assume every incident is payment-related.
Use the detected service, severity, and assigned team.

Detected Incident Context:
{state["incident_context"]}

Internal Company Documents:
{document_context}

Live Web Search Results:
{web_context}

Service Status:
{state["service_status"]}

Ticket:
{state["ticket"]}

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

    logger.info("AI response generated successfully")

    return {
        "answer": response.choices[0].message.content
    }


def build_incident_workflow():
    graph = StateGraph(IncidentState)

    graph.add_node("detect_incident", detect_incident_node)
    graph.add_node("retrieve_documents", retrieve_documents_node)
    graph.add_node("web_search", web_search_node)
    graph.add_node("check_service", check_service_node)
    graph.add_node("create_ticket", create_ticket_node)
    graph.add_node("generate_answer", generate_answer_node)

    graph.add_edge(START, "detect_incident")
    graph.add_edge("detect_incident", "retrieve_documents")
    graph.add_edge("retrieve_documents", "web_search")
    graph.add_edge("web_search", "check_service")
    graph.add_edge("check_service", "create_ticket")
    graph.add_edge("create_ticket", "generate_answer")
    graph.add_edge("generate_answer", END)

    return graph.compile()


incident_workflow = build_incident_workflow()


def run_incident_workflow(question: str):
    result = incident_workflow.invoke({
        "question": question,
        "incident_context": {},
        "documents": [],
        "web_results": [],
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
        "web_results": result["web_results"],
        "incident_context": result["incident_context"],
        "workflow_steps": [
            "detect_incident",
            "retrieve_documents",
            "web_search",
            "check_service",
            "create_ticket",
            "generate_answer"
        ],
        "status": "success"
    }