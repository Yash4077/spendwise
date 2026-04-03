const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route   GET /api/transactions
// @desc    Get all transactions for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, type } = req.query;
    const filter = { user: req.user.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    if (type && (type === 'income' || type === 'expense')) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get summary (income, expense, balance) for a month
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter);

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({ income, expense, balance: income - expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  const { type, category, amount, description, date } = req.body;

  if (!type || !category || !amount || !description || !date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount: Number(amount),
      description,
      date: new Date(date)
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this transaction.' });
    }

    const { type, category, amount, description, date } = req.body;

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount: Number(amount), description, date: new Date(date) },
      { new: true, runValidators: true }
    );

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction.' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
