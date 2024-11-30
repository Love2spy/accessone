import { Opportunity } from '../types';

// SAM.gov URL patterns
const SAM_URL_PATTERNS = [
  // Modern SAM.gov URLs
  {
    pattern: /sam\.gov\/opp\/([a-f0-9-]+)\/view/i,
    type: 'modern'
  }
];

export const validateSAMUrl = (url: string): boolean => {
  return SAM_URL_PATTERNS.some(({ pattern }) => pattern.test(url));
};

export const extractNoticeId = (url: string): string | null => {
  for (const { pattern } of SAM_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const fetchOpportunityDetails = async (noticeId: string): Promise<Opportunity> => {
  // Since we can't actually fetch from SAM.gov API in this demo,
  // we'll create a basic opportunity that can be manually edited
  return {
    id: crypto.randomUUID(),
    noticeId: noticeId,
    title: 'New Opportunity',
    agency: '',
    postedDate: new Date().toISOString(),
    responseDeadline: new Date().toISOString(),
    description: 'Please enter the opportunity details.',
    naicsCode: '',
    type: 'Contract',
    setAside: 'Total Small Business',
    status: 'new'
  };
};

// Helper function to open SAM.gov search in new tab
export const openSAMSearch = () => {
  window.open('https://sam.gov/content/opportunities', '_blank');
};

// Helper function to open specific opportunity on SAM.gov
export const openOpportunityOnSAM = (noticeId: string) => {
  window.open(`https://sam.gov/opp/${noticeId}/view`, '_blank');
};