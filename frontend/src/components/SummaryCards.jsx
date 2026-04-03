import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function SummaryCards({ summary, loading }) {
  const cards = [
    {
      title: 'Total Income',
      value: summary.income,
      icon: <FiTrendingUp className="text-xl" />,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Total Expenses',
      value: summary.expense,
      icon: <FiTrendingDown className="text-xl" />,
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      textColor: 'text-red-500',
    },
    {
      title: 'Net Balance',
      value: summary.balance,
      icon: <FiDollarSign className="text-xl" />,
      bg: summary.balance >= 0 ? 'bg-violet-50' : 'bg-orange-50',
      iconBg: summary.balance >= 0 ? 'bg-violet-600' : 'bg-orange-500',
      textColor: summary.balance >= 0 ? 'text-violet-600' : 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className={`${card.bg} rounded-2xl p-5 border border-white shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">{card.title}</span>
            <div className={`${card.iconBg} text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-sm`}>
              {card.icon}
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-white/60 rounded-lg animate-pulse w-24"></div>
          ) : (
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {formatAmount(card.value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
