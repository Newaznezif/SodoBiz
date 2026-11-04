import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { TransactionType } from '../../types';
import { ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';

export const NewTransactionPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentBusiness, currentUser, refreshData } = useAuth();

  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('Sales - General');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'telebirr' | 'bank_transfer' | 'cbe_birr'>('cash');
  const [error, setError] = useState('');

  if (!currentBusiness) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs">
        Please complete your business profile first.
      </div>
    );
  }

  const incomeCategories = [
    'Sales - General',
    'Sales - Grain / Food',
    'Sales - Spices / Processing',
    'Sales - Handwoven Textiles',
    'Service / Milling Labor Fee',
    'Bulk Merchant Order',
  ];

  const expenseCategories = [
    'Inventory Restock',
    'Shop Rent',
    'Transport & Freight (Bajaj / Isuzu)',
    'Packaging & Sacks',
    'Electricity / Mill Utilities',
    'Machine Maintenance & Oil',
    'Worker Daily Wage',
    'Municipal Fee / Tax',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Transaction amount must be a positive number greater than 0.');
      return;
    }

    try {
      db.createTransaction({
        business_id: currentBusiness.id,
        created_by: currentUser.id,
        transaction_type: type,
        amount: numAmount,
        currency: 'ETB',
        category,
        description: description || `${type === 'income' ? 'Recorded sale' : 'Operating cost'} - ${category}`,
        transaction_date: date,
        payment_method: paymentMethod,
      });

      refreshData();
      onNavigate('/dashboard/transactions');
    } catch (err: any) {
      setError(err.message || 'Failed to record transaction');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={() => onNavigate('/dashboard/transactions')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Ledger
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Record New Transaction</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Log daily customer receipts or operating costs in Ethiopian Birr (ETB).
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Transaction Type Segmented Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Transaction Classification *</label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory(incomeCategories[0]);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'income'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Business Income (Sales)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory(expenseCategories[0]);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              - Operating Expense
            </button>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Amount (ETB) *</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                ETB
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Transaction Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        {/* Category & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
            >
              {(type === 'income' ? incomeCategories : expenseCategories).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Payment Channel</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white capitalize"
            >
              <option value="cash">Cash (Drawer / Till)</option>
              <option value="telebirr">Telebirr Digital Wallet</option>
              <option value="cbe_birr">CBE Birr Mobile</option>
              <option value="bank_transfer">Commercial Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Itemized Description / Note</label>
          <input
            type="text"
            placeholder="e.g. Sale of 2 sacks of Magna Teff to Sodo restaurant"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/transactions')}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Record Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};
