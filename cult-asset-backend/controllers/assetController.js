const pool = require("../db");

// @route   POST /api/assets
// @desc    Add a new asset (Admin only)
exports.addAsset = async (req, res) => {
  // UPDATED: Now extracts 'category' directly as a string
  const { category, name, description, total_quantity, health_status } =
    req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO Assets (category, name, description, total_quantity, available_quantity, health_status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        category || "Uncategorized",
        name,
        description,
        total_quantity,
        total_quantity,
        health_status || "good",
      ],
    );
    res.status(201).json({
      message: "Asset created successfully",
      assetId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding asset" });
  }
};

// @route   GET /api/assets
// @desc    Browse available assets (Public/Consumers)
exports.getAllAssets = async (req, res) => {
  try {
    // UPDATED: Removed the complex JOIN. We just select 'category' directly from the Assets table!
    const [assets] = await pool.query(`
            SELECT id, name, description, total_quantity, available_quantity, health_status, category
            FROM Assets
        `);
    res.status(200).json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching assets" });
  }
};

// @route   PUT /api/assets/:id
// @desc    Edit asset information (Admin only)
exports.updateAsset = async (req, res) => {
  const { id } = req.params;
  // UPDATED: Added 'category' to the extracted body parameters
  const {
    name,
    category,
    description,
    total_quantity,
    available_quantity,
    health_status,
  } = req.body;

  try {
    // UPDATED: Added 'category = ?' to the SQL query
    const [result] = await pool.query(
      "UPDATE Assets SET name = ?, category = ?, description = ?, total_quantity = ?, available_quantity = ?, health_status = ? WHERE id = ?",
      [
        name,
        category || "Uncategorized",
        description,
        total_quantity,
        available_quantity,
        health_status,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json({ message: "Asset updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating asset" });
  }
};

// @route   DELETE /api/assets/:id
// @desc    Delete assets (Admin only)
exports.deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Assets WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting asset" });
  }
};
