import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { generateProposal, generateWordContent, generateGoogleDocsContent } from '../../services/proposalGenerator';
import { Download, Save, X } from 'lucide-react';

export default function ProposalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, templates, opportunities, updateProposal } = useStore();
  
  const proposal = proposals.find(p => p.id === id);
  const opportunity = opportunities.find(o => o.opportunityId === proposal?.opportunityId);

  const [content, setContent] = useState(proposal?.content || '');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (!proposal || !opportunity) {
      navigate('/proposals');
    }
  }, [proposal, opportunity, navigate]);

  if (!proposal || !opportunity) {
    return null;
  }

  const handleSave = () => {
    updateProposal(proposal.id, { content });
  };

  const handleExport = async (format: 'doc' | 'google') => {
    const sections = generateProposal(opportunity, templates, {
      id: '1',
      opportunityId: opportunity.id,
      laborRates: [],
      materials: [],
      overhead: 0,
      profit: 0,
      totalPrice: 0
    });

    if (format === 'google') {
      const content = generateGoogleDocsContent(sections);
      window.open('https://docs.google.com/document/create', '_blank');
    } else {
      const content = generateWordContent(sections);
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${proposal.title.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setShowExportModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{proposal.title}</h1>
          <p className="text-gray-500">Due: {new Date(proposal.dueDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="Enter proposal content..."
        />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Export Proposal</h2>
              <button onClick={() => setShowExportModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleExport('google')}
                className="w-full p-4 text-left bg-white border rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium">Google Docs</div>
                <p className="text-sm text-gray-500">Create a new Google Doc</p>
              </button>
              
              <button
                onClick={() => handleExport('doc')}
                className="w-full p-4 text-left bg-white border rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium">Microsoft Word</div>
                <p className="text-sm text-gray-500">Download as .doc file</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}