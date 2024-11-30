import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Ban,
  Search,
  BarChart2,
  FileText,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '../store/opportunityStore';
import { useStore } from '../store';
import { openSAMSearch } from '../services/samApi';

function Dashboard() {
  const navigate = useNavigate();
  const opportunities = useOpportunityStore(state => state.opportunities);
  const { proposals, subcontractors } = useStore();

  // Calculate statistics
  const activeOpportunities = opportunities.filter(opp => 
    ['new', 'analyzing', 'bidding'].includes(opp.status)
  ).length;

  const pendingAnalysis = opportunities.filter(opp => 
    opp.status === 'analyzing'
  ).length;

  const wonContracts = opportunities.filter(opp => 
    opp.status === 'won'
  ).length;

  const noBidDecisions = opportunities.filter(opp => 
    opp.status === 'lost'
  ).length;

  // Get recent activity
  const recentActivity = [
    ...opportunities.map(opp => ({
      type: 'opportunity',
      date: new Date(opp.postedDate),
      title: opp.title,
      status: opp.status
    })),
    ...proposals.map(prop => ({
      type: 'proposal',
      date: new Date(prop.dueDate),
      title: prop.title,
      status: prop.status
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'import':
        openSAMSearch();
        break;
      case 'analysis':
        navigate('/bid-analysis');
        break;
      case 'proposal':
        navigate('/proposals/new');
        break;
      case 'vendor':
        navigate('/vendors');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Opportunities</p>
              <h3 className="text-2xl font-bold mt-1">{activeOpportunities}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Analysis</p>
              <h3 className="text-2xl font-bold mt-1">{pendingAnalysis}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Won Contracts</p>
              <h3 className="text-2xl font-bold mt-1">{wonContracts}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">No-Bid Decisions</p>
              <h3 className="text-2xl font-bold mt-1">{noBidDecisions}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} - {activity.status}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {activity.date.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No recent activity
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleQuickAction('import')}
              className="p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-700 group-hover:text-blue-800">Import from SAM.gov</h3>
              </div>
              <p className="text-sm text-blue-600 group-hover:text-blue-700">Search and import opportunities</p>
            </button>
            
            <button 
              onClick={() => handleQuickAction('analysis')}
              className="p-4 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart2 className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-700 group-hover:text-green-800">Start New Analysis</h3>
              </div>
              <p className="text-sm text-green-600 group-hover:text-green-700">Begin bid/no-bid analysis</p>
            </button>
            
            <button 
              onClick={() => handleQuickAction('proposal')}
              className="p-4 text-left bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-700 group-hover:text-purple-800">Create Proposal</h3>
              </div>
              <p className="text-sm text-purple-600 group-hover:text-purple-700">Start a new proposal draft</p>
            </button>
            
            <button 
              onClick={() => handleQuickAction('vendor')}
              className="p-4 text-left bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium text-orange-700 group-hover:text-orange-800">Add Vendor</h3>
              </div>
              <p className="text-sm text-orange-600 group-hover:text-orange-700">Register new subcontractor</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;