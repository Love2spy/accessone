import React from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

function ContractTracking() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contract Tracking</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Contracts</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Value</p>
              <h3 className="text-2xl font-bold">$0</h3>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Contracts Ending Soon</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Contracts</h2>
          <div className="text-center py-8 text-gray-500">
            No active contracts found. Contracts will appear here once they are awarded.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractTracking;