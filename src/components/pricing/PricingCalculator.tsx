import React from 'react';
import { PricingCalculation } from '../../types';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface PricingCalculatorProps {
  calculation?: PricingCalculation;
  onSave: (calculation: PricingCalculation) => void;
  onCancel: () => void;
}

export default function PricingCalculator({ calculation, onSave, onCancel }: PricingCalculatorProps) {
  const [formData, setFormData] = React.useState<Partial<PricingCalculation>>(
    calculation || {
      laborRates: [],
      materials: [],
      overhead: 0,
      profit: 0,
      totalPrice: 0
    }
  );

  const addLaborRate = () => {
    setFormData({
      ...formData,
      laborRates: [
        ...(formData.laborRates || []),
        { role: '', rate: 0, hours: 0 }
      ]
    });
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [
        ...(formData.materials || []),
        { item: '', quantity: 0, unitPrice: 0 }
      ]
    });
  };

  const updateLaborRate = (index: number, field: string, value: string | number) => {
    const newLaborRates = [...(formData.laborRates || [])];
    newLaborRates[index] = { ...newLaborRates[index], [field]: value };
    setFormData({ ...formData, laborRates: newLaborRates });
  };

  const updateMaterial = (index: number, field: string, value: string | number) => {
    const newMaterials = [...(formData.materials || [])];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setFormData({ ...formData, materials: newMaterials });
  };

  const calculateTotal = () => {
    const laborTotal = (formData.laborRates || []).reduce(
      (sum, item) => sum + (item.rate * item.hours),
      0
    );

    const materialsTotal = (formData.materials || []).reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    const subtotal = laborTotal + materialsTotal;
    const overheadAmount = subtotal * ((formData.overhead || 0) / 100);
    const profitAmount = (subtotal + overheadAmount) * ((formData.profit || 0) / 100);

    return subtotal + overheadAmount + profitAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: calculation?.id || crypto.randomUUID(),
      opportunityId: calculation?.opportunityId || '',
      ...formData as PricingCalculation,
      totalPrice: calculateTotal()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Labor Rates Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Labor Rates</h3>
          <button
            type="button"
            onClick={addLaborRate}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Labor Rate
          </button>
        </div>

        {formData.laborRates?.map((rate, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={rate.role}
              onChange={(e) => updateLaborRate(index, 'role', e.target.value)}
              placeholder="Role"
              className="rounded-md border-gray-300"
            />
            <input
              type="number"
              value={rate.rate}
              onChange={(e) => updateLaborRate(index, 'rate', parseFloat(e.target.value))}
              placeholder="Rate"
              className="rounded-md border-gray-300"
            />
            <input
              type="number"
              value={rate.hours}
              onChange={(e) => updateLaborRate(index, 'hours', parseInt(e.target.value))}
              placeholder="Hours"
              className="rounded-md border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                const newRates = [...(formData.laborRates || [])];
                newRates.splice(index, 1);
                setFormData({ ...formData, laborRates: newRates });
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Materials Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Materials</h3>
          <button
            type="button"
            onClick={addMaterial}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Material
          </button>
        </div>

        {formData.materials?.map((material, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={material.item}
              onChange={(e) => updateMaterial(index, 'item', e.target.value)}
              placeholder="Item"
              className="rounded-md border-gray-300"
            />
            <input
              type="number"
              value={material.quantity}
              onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
              placeholder="Quantity"
              className="rounded-md border-gray-300"
            />
            <input
              type="number"
              value={material.unitPrice}
              onChange={(e) => updateMaterial(index, 'unitPrice', parseFloat(e.target.value))}
              placeholder="Unit Price"
              className="rounded-md border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                const newMaterials = [...(formData.materials || [])];
                newMaterials.splice(index, 1);
                setFormData({ ...formData, materials: newMaterials });
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Overhead and Profit */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Overhead (%)</label>
          <input
            type="number"
            value={formData.overhead}
            onChange={(e) => setFormData({ ...formData, overhead: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profit (%)</label>
          <input
            type="number"
            value={formData.profit}
            onChange={(e) => setFormData({ ...formData, profit: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${calculateTotal().toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save Calculation
        </button>
      </div>
    </form>
  );
}