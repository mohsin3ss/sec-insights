from fire import Fire
from app.schema import Document
from app.db.session import SessionLocal
from app.api import crud
import asyncio


async def upsert_single_document(
        doc_url: str,
        department_ticker: str,
        department_name: str,
        subcategory_1: str,
        subcategory_2: str,
    ):
    """
    Upserts a single SEC document into the database using its URL.

    Required data for the document includes:
    * url: url of where the document is hosted
    * department ticker: unique department key
    * department name: name that will be shown to the user in dropdown 1
    * subcategory 1: document type shown in dropdown 2
    * subcategory 2: document shown in dropdown 3
    """
    if not (department_ticker and department_name and subcategory_1 and subcategory_2):
        print("Metadata values are missing; department_ticker, department_name, subcategory_1, subcategory_2")

    if not doc_url or not doc_url.startswith('http'):
        print("DOC_URL must be an http(s) based url value")
        return

    metadata_map = {
        "department_ticker": department_ticker,
        "department_name": department_name,
        "subcategory_1": subcategory_1,
        "subcategory_2": subcategory_2,
    }
    doc = Document(url=doc_url, metadata_map=metadata_map)

    async with SessionLocal() as db:
        document = await crud.upsert_document_by_url(db, doc)
        print(f"Upserted document. Database ID:\n{document.id}")


def main_upsert_single_document(
        doc_url: str,
        department_ticker: str,
        department_name: str,
        subcategory_1: str,
        subcategory_2: str,
):
    """
    Script to upsert a single document by URL.
    This script is useful when trying to use your own PDF files.
    """
    asyncio.run(upsert_single_document(doc_url, department_ticker, department_name, subcategory_1, subcategory_2))


if __name__ == "__main__":
    Fire(main_upsert_single_document)
