import { BackendDocument } from "~/types/backend/document";
import { BackendDocumentInterface } from "~/types/document";
import { documentColors } from "~/utils/colors";
import _ from "lodash";

export const fromBackendDocumentToFrontend = (
  backendDocuments: BackendDocument[]
) => {
  // sort by created_at
  backendDocuments = _.sortBy(backendDocuments, 'created_at');
  const frontendDocs: BackendDocumentInterface[] = backendDocuments
  .filter((backendDoc) => 'document_details' in backendDoc.metadata_map)
  .map((backendDoc, index) => {
    // we have 10 colors for 10 documents
    const colorIndex = index < 10 ? index : 0;
    return {
      id: backendDoc.id,
      url: backendDoc.url,
      ticker: backendDoc.metadata_map.document_details.department_ticker,
      fullName: backendDoc.metadata_map.document_details.department_name,
      subcategory_1: backendDoc.metadata_map.document_details.subcategory_1,
      subcategory_2: backendDoc.metadata_map.document_details.subcategory_2,
      color: documentColors[colorIndex],
    } as BackendDocumentInterface;
  });

  return frontendDocs;
};
