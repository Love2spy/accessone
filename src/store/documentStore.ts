import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document } from '../types';

interface DocumentStore {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  getDocumentsByOpportunity: (opportunityId: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
        })),
        
      updateDocument: (id, document) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...document } : d
          ),
        })),
        
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),

      getDocumentsByOpportunity: (opportunityId: string) =>
        get().documents.filter((d) => d.opportunityId === opportunityId),
    }),
    {
      name: 'documents-storage'
    }
  )
);