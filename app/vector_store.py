from pathlib import Path
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

load_dotenv()

CHROMA_PATH = "chroma_db"


def build_vector_store():
    docs = []

    for file_path in Path("data").glob("*.txt"):
        content = file_path.read_text()
        docs.append(
            Document(
                page_content=content,
                metadata={"source": file_path.name}
            )
        )

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    vector_store = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )

    return {
        "status": "success",
        "documents_indexed": len(docs)
    }


def search_vector_store(query: str):
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    vector_store = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

    results = vector_store.similarity_search(query, k=2)

    return [
        {
            "source": doc.metadata.get("source"),
            "content": doc.page_content
        }
        for doc in results
    ]