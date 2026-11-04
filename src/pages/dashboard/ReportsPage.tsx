import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Printer, Download, Calendar, TrendingUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentBusiness, currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  if (!currentBusiness) {
    return <div className="p-6 bg-white rounded-xl">Please set up your business profile first.</div>;
  }

  const allTransactions = db.getTransactions(currentBusiness.id);
  const products = db.getProducts(currentBusiness.id);

  // Filter transactions for selected month
  const monthTransactions = allTransactions.filter((t) =>
    t.transaction_date.startsWith(selectedMonth)
  );

  const monthSales = monthTransactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = monthTransactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthOperatingResult = monthSales - monthExpenses;

  // Breakdown by expense category
  const expenseBreakdown: Record<string, number> = {};
  monthTransactions
    .filter((t) => t.transaction_type === 'expense')
    .forEach((t) => {
      expenseBreakdown[t.category] = (expenseBreakdown[t.category] || 0) + t.amount;
    });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Type', 'Amount (ETB)'];
    const rows = [
      ['Total Recorded Sales (Revenue)', 'Income', monthSales],
      ['Total Recorded Operating Costs', 'Expense', monthExpenses],
      ['Estimated Operating Result', 'Net', monthOperatingResult],
      ...Object.entries(expenseBreakdown).map(([cat, amt]) => [
        `Expense - ${cat}`,
        'Expense',
        amt,
      ]),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SodoBiz_Statement_${currentBusiness.name.replace(/\s+/g, '_')}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports & Statements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured monthly performance summaries suitable for personal review or presentation to loan officers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="py-2 px-3 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-white focus:outline-none focus:border-teal-500"
          >
            <option value="2026-10">October 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Official Statement</span>
          </button>
        </div>
      </div>

      {/* Printable Financial Statement Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Statement Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-700 font-bold">
              SodoBiz Bridge · Micro-Enterprise Performance Statement
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {currentBusiness.name}
            </h2>
            <div className="text-xs text-slate-600 mt-1 space-x-2">
              <span>{currentBusiness.location}</span>
              <span>·</span>
              <span className="capitalize">{currentBusiness.business_type}</span>
              <span>·</span>
              <span>Owner: {currentUser.full_name}</span>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>Report Period: <strong className="text-slate-800">{selectedMonth}</strong></div>
            <div>Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 3 Core Result Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Recorded Sales Inflow</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {monthSales.toLocaleString()} <span className="text-xs font-normal">ETB</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {monthTransactions.filter((t) => t.transaction_type === 'income').length} entries recorded
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Recorded Operating Costs</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {monthExpenses.toLocaleString()} <span className="text-xs font-normal">ETB</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Restock, rent, utilities, transport
            </div>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
            <div className="text-xs text-teal-800 font-bold">Estimated Operating Result</div>
            <div className={`text-xl font-black font-mono tabular-nums mt-1 ${monthOperatingResult >= 0 ? 'text-teal-800' : 'text-rose-700'}`}>
              {monthOperatingResult >= 0 ? `+${monthOperatingResult.toLocaleString()}` : monthOperatingResult.toLocaleString()} <span className="text-xs font-normal">ETB</span>
            </div>
            <div className="text-[10px] text-teal-900 mt-0.5">
              Net operating surplus
            </div>
          </div>
        </div>

        {/* Detailed Itemized Categories */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900">Cost Breakdown by Operational Category</h3>
          {Object.keys(expenseBreakdown).length === 0 ? (
            <div className="text-xs text-slate-500 py-3">No expenses recorded for this month period.</div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4">Expense Category</th>
                    <th className="py-2.5 px-4 text-right">Share (%)</th>
                    <th className="py-2.5 px-4 text-right">Amount (ETB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Object.entries(expenseBreakdown).map(([cat, amt]) => {
                    const pct = Math.round((amt / (monthExpenses || 1)) * 100);
                    return (
                      <tr key={cat}>
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-800">{cat}</td>
                        <td className="py-2.5 px-4 text-right text-slate-500">{pct}%</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                          {amt.toLocaleString()} ETB
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50/80 font-bold">
                    <td className="py-2.5 px-4 font-sans text-slate-900">Total Operational Outflow</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">100%</td>
                    <td className="py-2.5 px-4 text-right text-rose-700 tabular-nums">
                      {monthExpenses.toLocaleString()} ETB
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Stock Valuation Summary */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900">Current Inventory Asset Position</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400">Total Products</div>
              <div className="font-bold font-mono text-slate-900 mt-0.5">{products.length} cataloged</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400">Total Units in Stock</div>
              <div className="font-bold font-mono text-slate-900 mt-0.5">
                {products.reduce((acc, p) => acc + p.stock_quantity, 0)} units
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400">Estimated Retail Value</div>
              <div className="font-bold font-mono text-teal-700 mt-0.5">
                {products.reduce((acc, p) => acc + p.selling_price * p.stock_quantity, 0).toLocaleString()} ETB
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400">Items Needing Restock</div>
              <div className="font-bold font-mono text-amber-700 mt-0.5">
                {products.filter((p) => p.stock_quantity <= p.low_stock_threshold).length} items
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Regulatory Auditor Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 print-break-inside-avoid">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Important Verification Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            This financial statement is derived exclusively from transaction logs entered into SodoBiz Bridge by the business owner. It represents an estimated operating result and does not constitute a certified independent accounting audit. Verified financial institutions (including Omo Bank and VisionFund) may conduct physical shop inspections and verify Kebele residency before credit determination.
          </p>
        </div>

        {/* Verification Sign-Off Area for Bank Officers / Support Agents */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600 print-break-inside-avoid">
          <div>
            <div className="border-b border-slate-300 pb-1 mb-1 font-semibold">Entrepreneur Signature:</div>
            <div className="text-[11px] text-slate-400">I confirm the records above reflect my business transactions.</div>
          </div>
          <div>
            <div className="border-b border-slate-300 pb-1 mb-1 font-semibold">Support Counselor / Reviewer Stamp:</div>
            <div className="text-[11px] text-slate-400">SodoBiz Agent or Receiving Institution Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
