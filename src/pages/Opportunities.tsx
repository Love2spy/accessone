import { useState } from 'react';
import { Search, Filter, Download, Plus, Trash2 } from 'lucide-react';
import { openSAMSearch, openOpportunityOnSAM } from '../services/samApi';
import { useOpportunityStore } from '../store/opportunityStore';
import AddOpportunityModal from '../components/opportunities/AddOpportunityModal';
import OpportunitiesTable from '../components/opportunities/OpportunitiesTable';
import OpportunityDetailsModal from '../components/opportunities/OpportunityDetailsModal';
import type { Opportunity } from '../types';

function Opportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  
  const { opportunities, addOpportunity, clearOpportunities, removeOpportunity } = useOpportunityStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleImportFromSAM = () => {
    setShowAddModal(true);
  };

  const handleViewOnSAM = (noticeId: string) => {
    openOpportunityOnSAM(noticeId);
  };

  const handleAddOpportunity = (opportunity: Opportunity) => {
    addOpportunity(opportunity);
    setShowAddModal(false);
  };

  const handleViewDetails = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleDeleteOpportunity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      removeOpportunity(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all opportunities? This action cannot be undone.')) {
      clearOpportunities();
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.noticeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contract Opportunities</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleImportFromSAM}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Import from SAM.gov
          </button>
          <button 
            onClick={openSAMSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Browse SAM.gov
          </button>
          {opportunities.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        <OpportunitiesTable 
          opportunities={filteredOpportunities}
          onViewSAM={handleViewOnSAM}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteOpportunity}
        />
      </div>

      {showAddModal && (
        <AddOpportunityModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddOpportunity}
        />
      )}

      {selectedOpportunity && (
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
}

export default Opportunities;