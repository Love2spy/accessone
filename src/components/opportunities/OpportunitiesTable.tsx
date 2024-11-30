import { ExternalLink, Eye, Trash2 } from 'lucide-react';
import { Opportunity } from '../../types';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onViewSAM: (noticeId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
}

export default function OpportunitiesTable({ opportunities, onViewSAM, onViewDetails, onDelete }: OpportunitiesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opportunity ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {opp.noticeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {opp.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {opp.agency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(opp.responseDeadline).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  opp.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  opp.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                  opp.status === 'bidding' ? 'bg-purple-100 text-purple-800' :
                  opp.status === 'submitted' ? 'bg-green-100 text-green-800' :
                  opp.status === 'won' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                <button 
                  onClick={() => onViewDetails(opp)}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button 
                  onClick={() => onViewSAM(opp.noticeId)}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  View on SAM.gov <ExternalLink className="w-4 h-4 ml-1" />
                </button>
                <button 
                  onClick={() => onDelete(opp.id)}
                  className="text-red-600 hover:text-red-800 inline-flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {opportunities.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No opportunities found. Add a new opportunity or import from SAM.gov
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}