import { X, Calendar, Building2, Tag, FileText, AlertCircle, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../../types';
import { useOpportunityStore } from '../../store/opportunityStore';
import DocumentLibrary from '../documents/DocumentLibrary';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export default function OpportunityDetailsModal({ opportunity, onClose }: OpportunityDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(opportunity);
  const navigate = useNavigate();
  const updateOpportunity = useOpportunityStore(state => state.updateOpportunity);

  const handleStartAnalysis = () => {
    updateOpportunity(opportunity.id, { status: 'analyzing' });
    navigate('/bid-analysis');
    onClose();
  };

  const handleSave = () => {
    updateOpportunity(opportunity.id, editForm);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Edit Opportunity</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agency</label>
                <input
                  type="text"
                  value={editForm.agency}
                  onChange={(e) => setEditForm({ ...editForm, agency: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice ID</label>
                <input
                  type="text"
                  value={editForm.noticeId}
                  onChange={(e) => setEditForm({ ...editForm, noticeId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Deadline</label>
                <input
                  type="date"
                  value={editForm.responseDeadline.split('T')[0]}
                  onChange={(e) => setEditForm({ ...editForm, responseDeadline: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAICS Code</label>
                <input
                  type="text"
                  value={editForm.naicsCode}
                  onChange={(e) => setEditForm({ ...editForm, naicsCode: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set-Aside</label>
                <select
                  value={editForm.setAside}
                  onChange={(e) => setEditForm({ ...editForm, setAside: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Total Small Business">Total Small Business</option>
                  <option value="8(a)">8(a)</option>
                  <option value="WOSB">WOSB</option>
                  <option value="SDVOSB">SDVOSB</option>
                  <option value="HUBZone">HUBZone</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={6}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{opportunity.title}</h2>
            <p className="text-gray-500 mt-1">Opportunity ID: {opportunity.noticeId}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit2 className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Agency</p>
              <p className="font-medium">{opportunity.agency}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Response Deadline</p>
              <p className="font-medium">
                {new Date(opportunity.responseDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">NAICS Code</p>
              <p className="font-medium">{opportunity.naicsCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Set-Aside</p>
              <p className="font-medium">{opportunity.setAside}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Description</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="whitespace-pre-wrap text-gray-700">{opportunity.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <DocumentLibrary opportunityId={opportunity.id} />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleStartAnalysis}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}