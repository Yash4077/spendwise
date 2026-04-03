import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionModal from '../components/TransactionModal';
import TransactionItem from '../components/TransactionItem';
import API from '../utils/api';
import { FiPlus, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const { user } = useAuth();
  const now = new Date();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState({ month: now.getMonth() + 1, year: now.getFullYear(), type: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setSummaryLoading(true);
    try {
      const params = { month: filter.month, year: filter.year };
      if (filter.type) params.type = filter.type;

      const [txRes, sumRes] = await Promise.all([
        API.get('/transactions', { params }),
        API.get('/transactions/summary', { params: { month: filter.month, year: filter.year } })
      ]);
      setTransactions(txRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      showToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
      setSummaryLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (formData) => {
    await API.post('/transactions', formData);
    showToast('Transaction added successfully!');
    fetchData();
  };

  const handleEdit = async (formData) => {
    await API.put(`/transactions/${editData._id}`, formData);
    showToast('Transaction updated!');
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      showToast('Transaction deleted.');
      setDeleteConfirm(null);
      fetchData();
    } catch {
      showToast('Could not delete transaction.', 'error');
    }
  };

  const openEdit = (tx) => { setEditData(tx); setShowModal(true); };
  const openAdd = () => { setEditData(null); setShowModal(true); };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Transaction?</h3>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500 text-sm mt-0.5">Hello, {user?.name?.split(' ')[0]} 👋 Here's your financial overview</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} loading={summaryLoading} />

        {/* Filters */}
        <div className="card">
          <div className="flex flex-wrap items-center gap-3">
            <FiFilter className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filter:</span>

            {/* Month */}
            <select
              value={filter.month}
              onChange={(e) => setFilter({ ...filter, month: Number(e.target.value) })}
              className="input-field w-auto"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={filter.year}
              onChange={(e) => setFilter({ ...filter, year: Number(e.target.value) })}
              className="input-field w-auto"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Type */}
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="input-field w-auto"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">
              Transactions
              <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {transactions.length}
              </span>
            </h3>
            <span className="text-xs text-slate-400">{MONTHS[filter.month - 1]} {filter.year}</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-40"></div>
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-24"></div>
                  </div>
                  <div className="h-5 bg-slate-100 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-500 font-medium">No transactions found</p>
              <p className="text-slate-400 text-sm mt-1">Try a different filter or add a new transaction</p>
              <button onClick={openAdd} className="btn-primary mt-5 inline-flex items-center gap-2">
                <FiPlus /> Add Transaction
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map(tx => (
                <TransactionItem
                  key={tx._id}
                  transaction={tx}
                  onEdit={openEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSubmit={editData ? handleEdit : handleAdd}
          editData={editData}
        />
      )}
    </div>
  );
}
