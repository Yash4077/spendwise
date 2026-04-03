import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CATEGORY_ICONS = {
  'Salary': '💼', 'Freelance': '💻', 'Investment': '📈', 'Business': '🏢',
  'Gift': '🎁', 'Food & Dining': '🍽️', 'Transport': '🚌', 'Shopping': '🛍️',
  'Entertainment': '🎬', 'Utilities': '💡', 'Healthcare': '🏥', 'Education': '📚',
  'Rent': '🏠', 'Other': '📌',
};

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  const icon = CATEGORY_ICONS[transaction.category] || '📌';

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
        isIncome ? 'bg-emerald-50' : 'bg-red-50'
      }`}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
          }`}>
            {transaction.category}
          </span>
          <span className="text-xs text-slate-400">{formatDate(transaction.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <p className={`font-bold text-base ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
        </p>

        {/* Actions - show on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
