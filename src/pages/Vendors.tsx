import { useState } from 'react';
import { Search, Plus, MapPin, Phone, Mail, Building2, Clock, CheckCircle2, XCircle, MessageCircle, X, Link as LinkIcon, Filter, Trash2, Star, Edit, Globe, Map } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store';
import { Subcontractor } from '../types';

function Vendors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Subcontractor['status'] | 'all'>('all');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('all');
  const [showVendorDetails, setShowVendorDetails] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState<string | null>(null);
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [newVendor, setNewVendor] = useState<Partial<Subcontractor>>({
    name: '',
    location: '',
    contact: '',
    email: '',
    specialties: [],
    status: 'new',
    statusUpdatedAt: new Date().toISOString(),
    notes: '',
    rating: 0,
    pastPerformance: [],
    linkedOpportunities: []
  });

  const subcontractors = useStore(state => state.subcontractors);
  const opportunities = useStore(state => state.opportunities);
  const addSubcontractor = useStore(state => state.addSubcontractor);
  const updateSubcontractor = useStore(state => state.updateSubcontractor);
  const removeSubcontractor = useStore(state => state.removeSubcontractor);

  const handleGoogleSearch = (companyName: string) => {
    const searchQuery = encodeURIComponent(companyName);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const handleGoogleMaps = (location: string) => {
    const searchQuery = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const getStatusIcon = (status: Subcontractor['status']) => {
    switch (status) {
      case 'new':
        return <Plus className="w-4 h-4 text-blue-500" />;
      case 'contacted':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'waiting_response':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'quoted':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: Subcontractor['status']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAddVendor = () => {
    const vendor: Subcontractor = {
      ...newVendor as Subcontractor,
      id: crypto.randomUUID(),
      specialties: newVendor.specialties || [],
      pastPerformance: newVendor.pastPerformance || [],
      linkedOpportunities: []
    };
    
    addSubcontractor(vendor);
    setShowNewVendorForm(false);
    setNewVendor({
      name: '',
      location: '',
      contact: '',
      email: '',
      specialties: [],
      status: 'new',
      statusUpdatedAt: new Date().toISOString(),
      notes: '',
      rating: 0,
      pastPerformance: [],
      linkedOpportunities: []
    });
  };

  const handleDeleteVendor = (id: string) => {
    removeSubcontractor(id);
    setShowDeleteConfirm(null);
  };

  const handleUpdateVendor = (id: string, updates: Partial<Subcontractor>) => {
    updateSubcontractor(id, updates);
    setIsEditing(false);
  };

  const handleLinkOpportunity = (subcontractorId: string) => {
    if (!selectedOpportunityId) return;

    const subcontractor = subcontractors.find(s => s.id === subcontractorId);
    if (!subcontractor) return;

    const opportunity = opportunities.find(o => o.id === selectedOpportunityId);
    if (!opportunity) return;

    const linkedOpportunities = [
      ...(subcontractor.linkedOpportunities || []),
      {
        id: opportunity.id,
        title: opportunity.title,
        noticeId: opportunity.noticeId,
        linkedAt: new Date().toISOString()
      }
    ];

    updateSubcontractor(subcontractorId, { linkedOpportunities });
    setShowLinkForm(null);
    setSelectedOpportunityId('');
  };

  const selectedSubcontractor = showVendorDetails ? 
    subcontractors.find(s => s.id === showVendorDetails) : null;

  const filteredSubcontractors = subcontractors.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    const matchesOpportunity = opportunityFilter === 'all' || 
      sub.linkedOpportunities?.some(opp => opp.id === opportunityFilter);
    
    return matchesSearch && matchesStatus && matchesOpportunity;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subcontractor Management</h1>
        <button 
          onClick={() => setShowNewVendorForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Subcontractor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search subcontractors by name, location, or specialty..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Subcontractor['status'] | 'all')}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="waiting_response">Waiting Response</option>
              <option value="quoted">Quoted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-gray-400" />
            <select
              value={opportunityFilter}
              onChange={(e) => setOpportunityFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Opportunities</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.noticeId})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subcontractor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubcontractors.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No subcontractors found. Add your first subcontractor to get started.
          </div>
        ) : (
          filteredSubcontractors.map((sub) => (
            <div key={sub.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{sub.name}</h3>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{sub.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                  {getStatusIcon(sub.status)}
                  <span className="text-sm font-medium">{getStatusText(sub.status)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{sub.contact}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{sub.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">{sub.specialties.join(', ')}</span>
                </div>
                {sub.linkedOpportunities && sub.linkedOpportunities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Linked Opportunities:</p>
                    <div className="space-y-1">
                      {sub.linkedOpportunities.map(opp => (
                        <div key={opp.id} className="text-sm text-gray-600 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-1" />
                          {opp.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowVendorDetails(sub.id)}
                  className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                <button 
                  onClick={() => {
                    setShowLinkForm(sub.id);
                    setSelectedOpportunityId('');
                  }}
                  className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(sub.id)}
                  className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Vendor Form Modal */}
      {showNewVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Subcontractor</h2>
              <button onClick={() => setShowNewVendorForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddVendor(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleGoogleSearch(newVendor.name)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Search Google
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVendor.location}
                    onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleGoogleMaps(newVendor.location)}
                    className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    View on Maps
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={newVendor.contact}
                  onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={newVendor.specialties?.join(', ')}
                  onChange={(e) => setNewVendor({ 
                    ...newVendor, 
                    specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewVendorForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Subcontractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Opportunity Modal */}
      {showLinkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Link Opportunity</h2>
              <button onClick={() => setShowLinkForm(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Opportunity
                </label>
                <select
                  value={selectedOpportunityId}
                  onChange={(e) => setSelectedOpportunityId(e.target.value)}
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

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLinkForm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLinkOpportunity(showLinkForm)}
                  disabled={!selectedOpportunityId}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Link Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Delete Subcontractor</h2>
              <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this subcontractor? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVendor(showDeleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedSubcontractor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Subcontractor Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    setShowVendorDetails(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateVendor(selectedSubcontractor.id, selectedSubcontractor);
              }} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={selectedSubcontractor.name}
                      onChange={(e) => updateSubcontractor(selectedSubcontractor.id, { name: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={selectedSubcontractor.location}
                      onChange={(e) => updateSubcontractor(selectedSubcontractor.id, { location: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input
                      type="text"
                      value={selectedSubcontractor.contact}
                      onChange={(e) => updateSubcontractor(selectedSubcontractor.id, { contact: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedSubcontractor.email}
                      onChange={(e) => updateSubcontractor(selectedSubcontractor.id, { email: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                  <input
                    type="text"
                    value={selectedSubcontractor.specialties.join(', ')}
                    onChange={(e) => updateSubcontractor(selectedSubcontractor.id, {
                      specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedSubcontractor.status}
                    onChange={(e) => updateSubcontractor(selectedSubcontractor.id, {
                      status: e.target.value as Subcontractor['status'],
                      statusUpdatedAt: new Date().toISOString()
                    })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="waiting_response">Waiting Response</option>
                    <option value="quoted">Quoted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={selectedSubcontractor.notes}
                    onChange={(e) => updateSubcontractor(selectedSubcontractor.id, { notes: e.target.value })}
                    rows={4}
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
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                    <p className="mt-1">{selectedSubcontractor.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{selectedSubcontractor.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                    <p className="mt-1">{selectedSubcontractor.contact}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{selectedSubcontractor.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedSubcontractor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1 flex items-center">
                    {getStatusIcon(selectedSubcontractor.status)}
                    <span className="ml-2">{getStatusText(selectedSubcontractor.status)}</span>
                    <span className="ml-2 text-sm text-gray -500">
                      (Updated: {format(new Date(selectedSubcontractor.statusUpdatedAt), 'MMM d, yyyy')})
                    </span>
                  </div>
                </div>

                {selectedSubcontractor.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 whitespace-pre-wrap">{selectedSubcontractor.notes}</p>
                  </div>
                )}

                {selectedSubcontractor.linkedOpportunities && selectedSubcontractor.linkedOpportunities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Linked Opportunities</h3>
                    <div className="mt-2 space-y-2">
                      {selectedSubcontractor.linkedOpportunities.map(opp => (
                        <div key={opp.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium">{opp.title}</p>
                            <p className="text-sm text-gray-500">ID: {opp.noticeId}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            Linked on {format(new Date(opp.linkedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;