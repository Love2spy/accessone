import { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle2, XCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

function Proposals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const { proposals, addProposal } = useStore(state => ({
    proposals: state.proposals,
    addProposal: state.addProposal
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_review':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'submitted':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'won':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'lost':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const handleNewProposal = () => {
    navigate('/proposals/new');
  };

  const handleEditProposal = (id: string) => {
    navigate(`/proposals/${id}/edit`);
  };

  const handleExportProposal = (id: string) => {
    setSelectedProposal(id);
    setShowExportModal(true);
  };

  const handleExport = (format: 'doc' | 'pdf' | 'google') => {
    if (!selectedProposal) return;
    
    const proposal = proposals.find(p => p.id === selectedProposal);
    if (!proposal) return;

    switch (format) {
      case 'google':
        window.open('https://docs.google.com/document/create', '_blank');
        break;
      case 'doc':
        const wordContent = `
${proposal.title}
Opportunity ID: ${proposal.opportunityId}
Due Date: ${new Date(proposal.dueDate).toLocaleDateString()}

1. Executive Summary
[Insert executive summary]

2. Technical Approach
[Insert technical approach]

3. Management Approach
[Insert management approach]

4. Past Performance
[Insert past performance]

5. Pricing
[Insert pricing details]
        `;
        
        const blob = new Blob([wordContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${proposal.title.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      case 'pdf':
        // PDF generation would be implemented here
        break;
    }
    
    setShowExportModal(false);
  };

  const filteredProposals = proposals.filter(proposal => 
    activeTab === 'active' 
      ? ['draft', 'in_review', 'submitted'].includes(proposal.status)
      : ['won', 'lost'].includes(proposal.status)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <button 
          onClick={handleNewProposal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Proposal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'active'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active Proposals
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'archived'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('archived')}
        >
          Archived
        </button>
      </div>

      {/* Proposals Grid */}
      <div className="grid gap-6">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No proposals found. Create your first proposal to get started.
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {proposal.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Opportunity ID: {proposal.opportunityId}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(proposal.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(proposal.status)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">
                    {proposal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${proposal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Due: {new Date(proposal.dueDate).toLocaleDateString()}</span>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleEditProposal(proposal.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleExportProposal(proposal.id)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Export Proposal</h2>
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
              
              <button
                onClick={() => handleExport('pdf')}
                className="w-full p-4 text-left bg-white border rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium">PDF</div>
                <p className="text-sm text-gray-500">Download as PDF file</p>
              </button>
              
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full p-2 text-center text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposals;