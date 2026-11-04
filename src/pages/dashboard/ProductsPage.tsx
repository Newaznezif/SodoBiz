import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Product } from '../../types';
import {
  Package,
  PlusCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const ProductsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentBusiness, refreshData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [sku, setSku] = useState('');
  const [error, setError] = useState('');

  if (!currentBusiness) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs">
        Please complete your business profile first.
      </div>
    );
  }

  const products = db.getProducts(currentBusiness.id);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setSellingPrice(0);
    setCostPrice(0);
    setStockQuantity(10);
    setLowStockThreshold(5);
    setSku(`SKU-${Date.now().toString().slice(-4)}`);
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setSellingPrice(p.selling_price);
    setCostPrice(p.cost_price || 0);
    setStockQuantity(p.stock_quantity);
    setLowStockThreshold(p.low_stock_threshold);
    setSku(p.sku || '');
    setError('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name cannot be empty.');
      return;
    }
    if (sellingPrice < 0 || stockQuantity < 0) {
      setError('Price and quantity must be non-negative.');
      return;
    }

    if (editingProduct) {
      db.updateProduct(
        editingProduct.id,
        {
          name,
          description,
          selling_price: Number(sellingPrice),
          cost_price: Number(costPrice),
          stock_quantity: Number(stockQuantity),
          low_stock_threshold: Number(lowStockThreshold),
          sku,
        },
        currentBusiness.id
      );
      setEditingProduct(null);
    } else {
      db.createProduct({
        business_id: currentBusiness.id,
        name,
        description,
        selling_price: Number(sellingPrice),
        cost_price: Number(costPrice),
        stock_quantity: Number(stockQuantity),
        low_stock_threshold: Number(lowStockThreshold),
        sku,
        is_active: true,
      });
      setShowAddModal(false);
    }

    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product from your inventory catalog?')) {
      db.deleteProduct(id, currentBusiness.id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catalog your goods, track stock levels, and set threshold alerts before market restock.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, description, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No products found in catalog.</p>
            <button onClick={handleOpenAdd} className="text-teal-700 font-semibold hover:underline">
              + Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => {
                  const isLowStock = prod.stock_quantity <= prod.low_stock_threshold;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        {prod.sku && (
                          <div className="text-[10px] text-slate-400 font-mono">{prod.sku}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {prod.description}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 tabular-nums">
                        {prod.selling_price.toLocaleString()} ETB
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                        {prod.cost_price ? `${prod.cost_price.toLocaleString()} ETB` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold font-mono ${
                            isLowStock
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-teal-50 text-teal-800'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          <span>{prod.stock_quantity} units</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepared Berbere Spice (1 kg bag)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, packaging size, or grade..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Selling Price (ETB) *</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cost Price (ETB)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Low-Stock Alert Level</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">SKU / Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. SPICE-BER-01"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
                >
                  {editingProduct ? 'Save Product' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
