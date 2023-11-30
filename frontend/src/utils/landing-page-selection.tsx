import type { BackendDocumentInterface } from "~/types/document";

import type { SelectOption } from "~/types/selection";
import { filterByTicker, filterByTickerAndType} from "./documents";

function documentToOption1(document: BackendDocumentInterface): SelectOption {
  return {
    value: document.subcategory_1,
    label: document.subcategory_1,
  };
}

function documentToOption2(document: BackendDocumentInterface): SelectOption {
  return {
    value: document.id,
    label: document.subcategory_2,
  };
}

export function getAvailableOption1(
  ticker: string,
  documents: BackendDocumentInterface[]
): SelectOption[] {
  const docs = filterByTicker(ticker, documents);
  return  docs.map(documentToOption1);
}

export function getAvailableOption2(
  ticker: string,
  type: string,
  documents: BackendDocumentInterface[]
): SelectOption[] {
  const docs = filterByTickerAndType(ticker, type, documents);
  return docs.map(documentToOption2);
}
