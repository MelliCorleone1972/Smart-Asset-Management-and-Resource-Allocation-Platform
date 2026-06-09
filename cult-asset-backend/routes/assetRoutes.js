const express = require('express');
const router = express.Router();
const { addAsset, getAllAssets, updateAsset, deleteAsset } = require('../controllers/assetController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public route: Anyone logged in can browse assets
router.get('/', verifyToken, getAllAssets);

// Protected routes: Only Admins can modify inventory
router.post('/', verifyToken, isAdmin, addAsset);
router.put('/:id', verifyToken, isAdmin, updateAsset);
router.delete('/:id', verifyToken, isAdmin, deleteAsset);

module.exports = router;
