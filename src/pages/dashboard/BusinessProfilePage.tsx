import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db, INITIAL_CATEGORIES } from '../../lib/db';
import { Building, MapPin, CheckCircle2, Save } from 'lucide-react';

export const BusinessProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, currentBusiness, refreshData } = useAuth();

  const [name, setName] = useState(currentBusiness?.name || '');
  const [description, setDescription] = useState(currentBusiness?.description || '');
  const [categoryId, setCategoryId] = useState(currentBusiness?.category_id || INITIAL_CATEGORIES[0].id);
  const [businessType, setBusinessType] = useState(currentBusiness?.business_type || 'retail');
  const [location, setLocation] = useState(currentBusiness?.location || 'Wolaita Sodo');
  const [operatingSince, setOperatingSince] = useState(currentBusiness?.operating_since || '2023');
  const [workerCount, setWorkerCount] = useState(currentBusiness?.worker_count || 1);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Business name cannot be empty.');
      return;
    }

    if (currentBusiness) {
      db.updateBusiness(
        currentBusiness.id,
        {
          name,
          description,
          category_id: categoryId,
          business_type: businessType as any,
          location,
          operating_since: operatingSince,
          worker_count: Number(workerCount),
        },
        currentUser.id
      );
    } else {
      db.createBusiness({
        owner_id: currentUser.id,
        name,
        description,
        category_id: categoryId,
        business_type: businessType as any,
        location,
        operating_since: operatingSince,
        worker_count: Number(workerCount),
        status: 'active',
      });
    }

    refreshData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain your core enterprise identity, sector category, and Wolaita Sodo operating details.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Business profile details saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Official Business Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Business Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Industry Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
            >
              {INITIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Operating Sector Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white capitalize"
            >
              <option value="retail">Retail Shop / Grocery</option>
              <option value="agriculture">Agriculture & Agro-Processing</option>
              <option value="crafts">Traditional Crafts & Weaving</option>
              <option value="food_services">Food & Beverage Services</option>
              <option value="services">Technical / Personal Services</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Physical Location & Kebele</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Operating Since (Year)</label>
            <input
              type="text"
              value={operatingSince}
              onChange={(e) => setOperatingSince(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Worker Count</label>
            <input
              type="number"
              min={1}
              value={workerCount}
              onChange={(e) => setWorkerCount(Number(e.target.value))}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Save className="w-4 h-4 text-teal-400" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
