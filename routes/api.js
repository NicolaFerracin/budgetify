const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');
const budgetController = require('../controllers/budgetController');
const { catchErrors } = require('../handlers/errors');

// API
router.get('/api/v1/transaction/:id', catchErrors(transactionController.getTransaction));
router.post('/api/v1/transaction/:id', catchErrors(transactionController.editTransaction));
router.post('/api/v1/budget/:id/month', catchErrors(budgetController.updateMonth));
router.delete('/api/v1/transaction/:id', catchErrors(transactionController.deleteTransaction));
router.delete('/api/v1/wallet/:id', catchErrors(walletController.deleteWallet));
router.delete('/api/v1/budget/:id', catchErrors(budgetController.deleteBudget));

module.exports = router;