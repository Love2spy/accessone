import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { useOpportunityStore } from '../../store/opportunityStore';
import { Proposal } from '../../types';

export default function NewProposal() {
  const navigate = useNavigate();
  const opportunities = useOpportunityStore(state => state.opportunities);
  const addProposal = useStore(state => state.addProposal);
  
  const [formData, setFormData] = useState({
    title: '',
    opportunityId: '',
    dueDate: '',
    content: '',
    status: 'draft' as const,
    progress: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const proposal: Proposal = {
      id: crypto.randomUUID(),
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    };

    addProposal(proposal);
    navigate('/proposals');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Proposal</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Opportunity
            </label>
            <select
              required
              value={formData.opportunityId}
              onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an opportunity...</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.noticeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/proposals')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Proposal
          </button>
        </div>
      </form>
    </div>
  );
}