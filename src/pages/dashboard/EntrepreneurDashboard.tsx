import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import {
  TrendingUp,
  Receipt,
  Package,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const EntrepreneurDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, currentBusiness, t } = useAuth();
  const [period, setPeriod] = useState<'30days' | 'all'>('30days');

  if (!currentBusiness) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Building className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">No Business Profile Registered Yet</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Please complete your business profile details (name, sector, and location) to begin recording transactions.
        </p>
        <button
          onClick={() => onNavigate('/dashboard/business')}
          className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-500"
        >
          Create Business Profile
        </button>
      </div>
    );
  }

  const allTransactions = db.getTransactions(currentBusiness.id);
  const products = db.getProducts(currentBusiness.id);
  const readinessItems = db.getBusinessReadiness(currentBusiness.id);

  // Financial calculations
  const totalSales = allTransactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const operatingResult = totalSales - totalExpenses;

  // Inventory low stock count
  const lowStockCount = products.filter(
    (p) => p.stock_quantity <= p.low_stock_threshold && p.is_active
  ).length;

  // Readiness score
  const completedReadiness = readinessItems.filter((r) => r.status === 'completed').length;
  const totalReadiness = readinessItems.length || 9;
  const readinessPercent = Math.round((completedReadiness / totalReadiness) * 100);

  // Recent transactions
  const recentTransactions = allTransactions.slice(0, 5);

  // Expense breakdown by category
  const expenseCategories: Record<string, number> = {};
  allTransactions
    .filter((t) => t.transaction_type === 'expense')
    .forEach((t) => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentBusiness.name}
          </h1>
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span>{currentBusiness.location}</span>
            <span>·</span>
            <span className="capitalize">{currentBusiness.business_type}</span>
            <span>·</span>
            <span className="text-teal-700 font-medium">Owner: {currentUser.full_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/dashboard/transactions/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.metrics.totalSales}</span>
            <Receipt className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalSales.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-400">
            From {allTransactions.filter((t) => t.transaction_type === 'income').length} recorded sales entries
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.metrics.totalExpenses}</span>
            <Receipt className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalExpenses.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Restock, shop rent, transport & utilities
          </div>
        </div>

        {/* Estimated Operating Result */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.metrics.operatingProfit}</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${operatingResult >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
            {operatingResult >= 0 ? `+${operatingResult.toLocaleString()}` : operatingResult.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Income minus expenses. Unaudited estimate.
          </div>
        </div>

        {/* Readiness Checklist Completion */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Business Readiness</span>
            <CheckSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {readinessPercent}%
            </span>
            <span className="text-xs text-teal-700 font-medium font-mono">
              ({completedReadiness}/{totalReadiness} items)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full" style={{ width: `${readinessPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Low-Stock Alert Banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900">Inventory Alert: </span>
              <span className="text-amber-800">
                You have {lowStockCount} product(s) at or below your minimum stock threshold. Restock before market day.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/dashboard/products')}
            className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* Main Grid: Transactions & Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Transactions</h2>
            <button
              onClick={() => onNavigate('/dashboard/transactions')}
              className="text-xs text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({allTransactions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>No transactions logged yet.</p>
              <button
                onClick={() => onNavigate('/dashboard/transactions/new')}
                className="text-teal-700 font-semibold"
              >
                + Record your first sale or expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Amount (ETB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {tx.transaction_date}
                      </td>
                      <td className="py-2.5 font-medium text-slate-800 whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-2.5 text-slate-600 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className={`py-2.5 text-right font-mono font-bold whitespace-nowrap ${
                        tx.transaction_type === 'income' ? 'text-teal-700' : 'text-rose-600'
                      }`}>
                        {tx.transaction_type === 'income' ? '+' : '-'}
                        {tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expense Category Breakdown & Readiness Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Expense Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Recorded Expenses by Category</h2>
            {Object.keys(expenseCategories).length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-2.5 pt-1">
                {Object.entries(expenseCategories).map(([cat, amount]) => {
                  const percent = Math.round((amount / (totalExpenses || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat}</span>
                        <span className="font-mono text-slate-600 font-semibold tabular-nums">
                          {amount.toLocaleString()} ETB ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-700 h-full" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Readiness Recommendation */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs text-teal-400 font-semibold uppercase tracking-wider">
              <span>Next Readiness Step</span>
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {readinessPercent < 100
                ? 'Complete Municipal License & Trade Documentation'
                : 'All Initial Milestones Completed!'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {readinessPercent < 100
                ? 'Your transaction volume is growing steadily. Ensure your Kebele trade registration is up to date to access Omo Bank micro loans.'
                : 'You have completed all standard record milestones. Generate your print-ready profile summary for local loan officers.'}
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/dashboard/readiness')}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
              >
                View Readiness Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
