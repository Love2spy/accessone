// ... existing types ...

export interface Document {
  id: string;
  opportunityId: string;
  name: string;
  type: 'rfp' | 'amendment' | 'question' | 'attachment' | 'proposal' | 'other';
  description?: string;
  url: string;
  uploadedAt: string;
  size?: number;
}

// Update Opportunity interface to include documents
export interface Opportunity {
  id: string;
  title: string;
  agency: string;
  noticeId: string;
  postedDate: string;
  responseDeadline: string;
  description: string;
  naicsCode: string;
  type: string;
  setAside: string;
  status: 'new' | 'analyzing' | 'bidding' | 'submitted' | 'won' | 'lost';
  documents?: Document[];
}