export interface BackendDocument {
  created_at: string;
  id: string;
  updated_at: string;
  metadata_map: BackendMetadataMap;
  url: string;
}

export interface BackendMetadataMap {
  document_details: DocumentDetails;
}

export interface DocumentDetails {
  department_ticker: string;
  department_name: string;
  subcategory_1: string;
  subcategory_2: string;
}