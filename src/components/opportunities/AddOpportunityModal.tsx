import { X, Link as LinkIcon, AlertCircle, Loader2, Info, Plus } from 'lucide-react';
import { useState } from 'react';
import { Opportunity } from '../../types';
import { validateSAMUrl, extractNoticeId, fetchOpportunityDetails } from '../../services/samApi';

interface AddOpportunityModalProps {
  onClose: () => void;
  onAdd: (opportunity: Opportunity) => void;
}

export default function AddOpportunityModal({ onClose, onAdd }: AddOpportunityModalProps) {
  const [mode, setMode] = useState<'import' | 'manual'>('import');
  const [samUrl, setSamUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [manualForm, setManualForm] = useState<Partial<Opportunity>>({
    title: '',
    agency: '',
    noticeId: '',
    postedDate: new Date().toISOString().split('T')[0],
    responseDeadline: '',
    description: '',
    naicsCode: '',
    type: 'Contract',
    setAside: 'Total Small Business',
    status: 'new'
  });

  const handleSAMImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!samUrl.trim()) {
        throw new Error('Please enter a SAM.gov opportunity URL');
      }

      if (!validateSAMUrl(samUrl)) {
        throw new Error('Invalid SAM.gov URL format. Please enter a valid URL (e.g., https://sam.gov/opp/...)');
      }

      const noticeId = extractNoticeId(samUrl);
      if (!noticeId) {
        throw new Error('Could not extract opportunity ID from URL');
      }

      const opportunity = await fetchOpportunityDetails(noticeId);
      
      if (opportunity.title === 'Manual Entry Required') {
        // Switch to manual mode with pre-filled notice ID
        setMode('manual');
        setManualForm({ ...manualForm, noticeId });
        setError('Could not import details automatically. Please enter them manually.');
      } else {
        onAdd(opportunity);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import opportunity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opportunity: Opportunity = {
      id: crypto.randomUUID(),
      ...manualForm as Opportunity
    };
    onAdd(opportunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Opportunity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('import')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              mode === 'import'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Import from SAM.gov
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              mode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manual Entry
          </button>
        </div>

        {mode === 'import' ? (
          <form onSubmit={handleSAMImport} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SAM.gov Opportunity URL
              </label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={samUrl}
                    onChange={(e) => {
                      setSamUrl(e.target.value);
                      setError('');
                    }}
                    placeholder="https://sam.gov/opp/..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import'
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How to Import</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Go to SAM.gov and find your opportunity</li>
                    <li>Copy the opportunity URL from your browser</li>
                    <li>Paste it here and click Import</li>
                    <li>If automatic import fails, you can enter details manually</li>
                  </ol>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.title}
                  onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.agency}
                  onChange={(e) => setManualForm({ ...manualForm, agency: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice ID
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.noticeId}
                  onChange={(e) => setManualForm({ ...manualForm, noticeId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Deadline
                </label>
                <input
                  type="date"
                  required
                  value={manualForm.responseDeadline?.split('T')[0]}
                  onChange={(e) => setManualForm({ ...manualForm, responseDeadline: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NAICS Code
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.naicsCode}
                  onChange={(e) => setManualForm({ ...manualForm, naicsCode: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set-Aside
                </label>
                <select
                  value={manualForm.setAside}
                  onChange={(e) => setManualForm({ ...manualForm, setAside: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={manualForm.description}
                onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                rows={4}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Opportunity
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}