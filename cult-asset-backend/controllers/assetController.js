const pool = require('../db');

// @route   POST /api/assets
// @desc    Add a new asset (Admin only)
exports.addAsset = async (req, res) => {
    const { category_id, name, description, total_quantity, health_status } = req.body;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO Assets (category_id, name, description, total_quantity, available_quantity, health_status) VALUES (?, ?, ?, ?, ?, ?)',
            [category_id || null, name, description, total_quantity, total_quantity, health_status || 'good']
        );
        res.status(201).json({ message: 'Asset created successfully', assetId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding asset' });
    }
};

// @route   GET /api/assets
// @desc    Browse available assets (Public/Consumers)
exports.getAllAssets = async (req, res) => {
    try {
        // We use a LEFT JOIN to attach the plain-text category name to the asset
        const [assets] = await pool.query(`
            SELECT a.id, a.name, a.description, a.total_quantity, a.available_quantity, a.health_status, c.name AS category_name
            FROM Assets a
            LEFT JOIN Categories c ON a.category_id = c.id
        `);
        res.status(200).json(assets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching assets' });
    }
};

// @route   PUT /api/assets/:id
// @desc    Edit asset information (Admin only)
exports.updateAsset = async (req, res) => {
    const { id } = req.params;
    const { name, description, total_quantity, available_quantity, health_status } = req.body;
    
    try {
        const [result] = await pool.query(
            'UPDATE Assets SET name = ?, description = ?, total_quantity = ?, available_quantity = ?, health_status = ? WHERE id = ?',
            [name, description, total_quantity, available_quantity, health_status, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating asset' });
    }
};

// @route   DELETE /api/assets/:id
// @desc    Delete assets (Admin only)
exports.deleteAsset = async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.query('DELETE FROM Assets WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting asset' });
    }
};
