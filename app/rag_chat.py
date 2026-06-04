from openai import OpenAI
from dotenv import load_dotenv
from app.tools.ticketing_tool import create_incident_ticket
from app.vector_store import search_vector_store
from app.tools.service_checker import check_service_status
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def ask_rag(question: str):
    documents = search_vector_store(question)

    context = "\n\n".join(
        [f"Source: {doc['source']}\nContent: {doc['content']}" for doc in documents]
    )

    service_status = check_service_status("payment-api")

    ticket = create_incident_ticket(
    summary="Checkout failures increasing due to payment-api issue",
    severity="SEV-2"
)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
You are an Enterprise AI Operations Copilot.

Use the company documents and service status below.

Company Documents:
{context}

Service Status:
{service_status}

Return the answer in this exact format:

Summary:
Service Status:
Root Cause:
Recommended Actions:
Risk Level:
Confidence Score:
"""
            },
            {
                "role": "user",
                "content": question
            }
        ]
    )

    return {
    "question": question,
    "answer": response.choices[0].message.content,
    "sources": list(set([doc["source"] for doc in documents])),
    "service_status": service_status,
    "ticket": ticket,
    "retrieval_count": len(documents),
    "status": "success"
}