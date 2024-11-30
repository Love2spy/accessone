import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import type { 
  Opportunity, 
  BidAnalysis, 
  Template, 
  PricingCalculation,
  Milestone,
  Subcontractor,
  Proposal
} from '../types';

interface Store {
  // Proposals
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  removeProposal: (id: string) => void;

  // Templates
  templates: Template[];
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  removeTemplate: (id: string) => void;

  // Pricing Calculations
  pricingCalculations: PricingCalculation[];
  addPricingCalculation: (calculation: PricingCalculation) => void;
  updatePricingCalculation: (id: string, updates: Partial<PricingCalculation>) => void;
  removePricingCalculation: (id: string) => void;

  // Milestones
  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  removeMilestone: (id: string) => void;

  // Subcontractors
  subcontractors: Subcontractor[];
  addSubcontractor: (subcontractor: Subcontractor) => void;
  updateSubcontractor: (id: string, updates: Partial<Subcontractor>) => void;
  removeSubcontractor: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Initialize all state arrays
      proposals: [],
      templates: [],
      pricingCalculations: [],
      milestones: [],
      subcontractors: [],

      // Proposal actions
      addProposal: (proposal) =>
        set((state) => ({
          proposals: [...state.proposals, proposal],
        })),
      updateProposal: (id, updates) =>
        set((state) => ({
          proposals: state.proposals.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      removeProposal: (id) =>
        set((state) => ({
          proposals: state.proposals.filter((p) => p.id !== id),
        })),

      // Template actions
      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      // Pricing Calculation actions
      addPricingCalculation: (calculation) =>
        set((state) => ({
          pricingCalculations: [...state.pricingCalculations, calculation],
        })),
      updatePricingCalculation: (id, updates) =>
        set((state) => ({
          pricingCalculations: state.pricingCalculations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removePricingCalculation: (id) =>
        set((state) => ({
          pricingCalculations: state.pricingCalculations.filter((c) => c.id !== id),
        })),

      // Milestone actions
      addMilestone: (milestone) =>
        set((state) => ({
          milestones: [...state.milestones, milestone],
        })),
      updateMilestone: (id, updates) =>
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      removeMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),

      // Subcontractor actions
      addSubcontractor: (subcontractor) =>
        set((state) => ({
          subcontractors: [...state.subcontractors, subcontractor],
        })),
      updateSubcontractor: (id, updates) =>
        set((state) => ({
          subcontractors: state.subcontractors.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      removeSubcontractor: (id) =>
        set((state) => ({
          subcontractors: state.subcontractors.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'gcms-storage',
      partialize: (state) => {
        const userId = useAuthStore.getState().user?.id;
        // Only persist data if user is authenticated
        if (!userId) return {};
        
        return {
          // Namespace data with user ID
          [`proposals-${userId}`]: state.proposals,
          [`templates-${userId}`]: state.templates,
          [`pricingCalculations-${userId}`]: state.pricingCalculations,
          [`milestones-${userId}`]: state.milestones,
          [`subcontractors-${userId}`]: state.subcontractors,
        };
      },
      onRehydrateStorage: () => (state) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId || !state) return;

        // Rehydrate data from user-specific namespace
        set({
          proposals: state[`proposals-${userId}`] || [],
          templates: state[`templates-${userId}`] || [],
          pricingCalculations: state[`pricingCalculations-${userId}`] || [],
          milestones: state[`milestones-${userId}`] || [],
          subcontractors: state[`subcontractors-${userId}`] || [],
        });
      },
    }
  )
);