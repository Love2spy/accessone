import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Opportunity } from '../types';

interface OpportunityStore {
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  removeOpportunity: (id: string) => void;
  clearOpportunities: () => void;
}

export const useOpportunityStore = create<OpportunityStore>()(
  persist(
    (set) => ({
      opportunities: [],
      
      addOpportunity: (opportunity) =>
        set((state) => ({
          opportunities: [...state.opportunities, opportunity],
        })),
        
      updateOpportunity: (id, opportunity) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, ...opportunity } : o
          ),
        })),
        
      removeOpportunity: (id) =>
        set((state) => ({
          opportunities: state.opportunities.filter((o) => o.id !== id),
        })),

      clearOpportunities: () =>
        set({ opportunities: [] }),
    }),
    {
      name: 'opportunities-storage'
    }
  )
);