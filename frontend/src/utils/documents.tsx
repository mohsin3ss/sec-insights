import type { BackendDocumentInterface, Ticker } from "~/types/document";

export function getAllTickers(documents: BackendDocumentInterface[]): Ticker[] {
  const result: Ticker[] = [];
  const seen: { [key: string]: boolean } = {};

  for (const doc of documents) {
    // Skip if we've seen this ticker before
    if (seen[doc.ticker]) {
      continue;
    }

    seen[doc.ticker] = true;
    result.push({
      fullName: doc.fullName,
      ticker: doc.ticker,
    });
  }

  return result;
}

export function filterByTicker(
  ticker: string,
  documents: BackendDocumentInterface[]
): BackendDocumentInterface[] {
  if (!ticker) {
    return [];
  }

  const uniqueIds: string[] = [];
  return  documents.filter(document => {
    if (document.ticker === ticker) {
      const isDuplicate = uniqueIds.includes(document.subcategory_1);

      if (!isDuplicate) {
        uniqueIds.push(document.subcategory_1);
        return true;
      }
    }

    return false;
  });
}

export function filterByTickerAndType(
  ticker: string,
  docType: string,
  documents: BackendDocumentInterface[]
): BackendDocumentInterface[] {
  if (!ticker) {
    return [];
  }
  const uniqueIds: string[] = [];
  return documents.filter(document => {
    if (document.ticker === ticker && document.subcategory_1 === docType) {
      const isDuplicate = uniqueIds.includes(document.subcategory_2);

      if (!isDuplicate) {
        uniqueIds.push(document.subcategory_2);
        return true;
      }
    }

    return false;
  });
}

export function findDocumentById(
  id: string,
  documents: BackendDocumentInterface[]
): BackendDocumentInterface | null {
  return documents.find((val) => val.id === id) || null;
}

export function sortDocuments(selectedDocuments: BackendDocumentInterface[]): BackendDocumentInterface[] {
  return selectedDocuments.sort((a, b) => {
    // Sort by fullName
    const nameComparison = a.fullName.localeCompare(b.fullName);
    if (nameComparison !== 0) return nameComparison;

    // If fullNames are equal, sort by subcategory_1
    return a.subcategory_1.localeCompare(b.subcategory_1);
  });
}
