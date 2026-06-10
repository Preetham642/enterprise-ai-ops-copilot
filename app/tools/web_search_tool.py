import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def search_web(query: str):
    if not os.getenv("TAVILY_API_KEY"):
        return []

    response = client.search(
        query=query,
        max_results=3,
        search_depth="basic"
    )

    return [
        {
            "title": item.get("title"),
            "url": item.get("url"),
            "content": item.get("content")
        }
        for item in response.get("results", [])
    ]