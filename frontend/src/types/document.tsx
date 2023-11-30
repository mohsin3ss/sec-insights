import { DocumentColorEnum } from "~/utils/colors";

export type Ticker = {
  ticker: string;
  fullName: string;
};

export interface BackendDocumentInterface extends Ticker {
  id: string;
  url: string;
  subcategory_1: string;
  subcategory_2: string;
  color: DocumentColorEnum;
}
