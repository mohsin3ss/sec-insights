import { useState, useEffect, useRef } from "react";
import { GroupBase } from "react-select";
import Select from "react-select/dist/declarations/src/Select";
import { BackendDocumentInterface, Ticker } from "~/types/document";
import type { SelectOption } from "~/types/selection";
import {
  findDocumentById,
  getAllTickers,
  sortDocuments,
} from "~/utils/documents";
import {
  getAvailableOption1,
  getAvailableOption2,
} from "~/utils/landing-page-selection";
import useLocalStorage from "./utils/useLocalStorage";
import { backendClient } from "~/api/backend";

export const MAX_NUMBER_OF_SELECTED_DOCUMENTS = 10;

export const useDocumentSelector = (accessToken: string) => {
  // Stores all documents returned by backend
  const [allDocuments, setAllDocuments] = useState<BackendDocumentInterface[]>(
    [],
  );
  // Options for 3 columns that show on the landing page
  const [availableTickers, setAvailableTickers] = useState<Ticker[]>(
      [],
  );
  const [documentOption1, setDocumentOption1] = useState<SelectOption[] | null>(
    null,
  );
  const [documentOption2, setDocumentOption2] = useState<SelectOption[] | null>(
    null,
  );

  useEffect(() => {
    setAvailableTickers(getAllTickers(allDocuments));
  }, [allDocuments]);

  useEffect(() => {
    async function getDocuments() {
      const docs = await backendClient.fetchDocuments(accessToken);
      setAllDocuments(docs);
    }
    getDocuments().catch(() => console.error("could not fetch documents"));
  }, []);

  const [selectedDocuments, setSelectedDocuments] = useLocalStorage<
    BackendDocumentInterface[]
  >("selectedDocuments", []);
  const sortedSelectedDocuments = sortDocuments(selectedDocuments);

  // Selected values for each dropdown are saved in these respectively
  const [selectedTicker, setSelectedTicker] =
    useState<Ticker | null>(null);
  const [selectedOption1, setSelectedOption1] =
    useState<SelectOption | null>(null);
  const [selectedOption2, setSelectedOption2] =
    useState<SelectOption | null>(null);

  const handleAddDocument = () => {
    if (selectedTicker && selectedOption1 && selectedOption2) {
      setSelectedDocuments((prevDocs = []) => {
        if (prevDocs.find((doc) => doc.id === selectedOption2.value)) {
          return prevDocs;
        }
        const newDoc = findDocumentById(selectedOption2.value, allDocuments);
        return newDoc ? [newDoc, ...prevDocs] : prevDocs;
      });
      setSelectedTicker(null);
      setSelectedOption1(null);
      setSelectedOption2(null);
      setShouldFocusDepartmentSelect(true);
    }
  };

  const handleRemoveDocument = (documentIndex: number) => {
    setSelectedDocuments((prevDocs) =>
      prevDocs.filter((_, index) => index !== documentIndex)
    );
  };

  useEffect(() => {
    setSelectedOption1(null);
    setSelectedOption2(null);
  }, [selectedTicker]);

  useEffect(() => {
    setSelectedOption2(null);
  }, [selectedOption1]);

  useEffect(() => {
    if (selectedTicker && !selectedOption1) {
      setDocumentOption1(
        getAvailableOption1(
          selectedTicker?.ticker,
          allDocuments
        )
      );
    }
  }, [selectedTicker, selectedOption1, allDocuments]);

  useEffect(() => {
    if (selectedTicker && selectedOption1) {
      setDocumentOption2(
        getAvailableOption2(
          selectedTicker?.ticker,
          selectedOption1?.value,
          allDocuments
        )
      );
    }
  }, [selectedTicker, selectedOption1, allDocuments]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "Enter" && event.shiftKey) ||
        (event.key === "Enter" && event.metaKey)
      ) {
        handleAddDocument();
      }
      if (event.key === "k" && event.metaKey) {
        setShouldFocusDepartmentSelect(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleAddDocument]);

  const isDocumentSelectionEnabled =
    selectedDocuments.length < MAX_NUMBER_OF_SELECTED_DOCUMENTS;

  const isStartConversationButtonEnabled = selectedDocuments.length > 0;

  const selectTicker = (ticker: Ticker) => {
    setSelectedTicker(ticker);
    setFocusDocumentType(true);
  };

  const selectDocumentType = (docType: SelectOption | null) => {
    setSelectedOption1(docType);
    setFocusYear(true);
  };

  const [shouldFocusDepartmentSelect, setShouldFocusDepartmentSelect] =
    useState(false);

  const [focusYear, setFocusYear] = useState(false);
  const yearFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusYear && yearFocusRef.current) {
      yearFocusRef.current?.focus();
      setFocusYear(false);
    }
  }, [focusYear]);

  const [focusDocumentType, setFocusDocumentType] = useState(false);
  const documentTypeFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusDocumentType && documentTypeFocusRef.current) {
      documentTypeFocusRef.current?.focus();
      setFocusDocumentType(false);
    }
  }, [focusDocumentType]);

  return {
    availableDocuments: allDocuments,
    availableTickers,
    availableDocumentOptions1: documentOption1,
    availableDocumentOptions2: documentOption2,
    selectedDocuments,
    sortedSelectedDocuments,
    selectedTicker,
    selectedDocumentOption1: selectedOption1,
    selectedDocumentOption2: selectedOption2,
    setSelectedOption2: setSelectedOption2,
    handleAddDocument,
    handleRemoveDocument,
    isDocumentSelectionEnabled,
    isStartConversationButtonEnabled,
    yearFocusRef,
    documentTypeFocusRef,
    selectTicker,
    selectDocumentOption1: selectDocumentType,
    shouldFocusDepartmentSelect,
    setShouldFocusDepartmentSelect,
  };
};
