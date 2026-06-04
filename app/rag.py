from pathlib import Path


def load_documents():
    data_path = Path("data")
    documents = []

    for file_path in data_path.glob("*.txt"):
        content = file_path.read_text()
        documents.append({
            "source": file_path.name,
            "content": content
        })

    return documents

def search_documents(query: str):
    documents = load_documents()

    query = query.lower()

    matches = []

    for doc in documents:

        if query in doc["content"].lower():
            matches.append(doc)

    return matches