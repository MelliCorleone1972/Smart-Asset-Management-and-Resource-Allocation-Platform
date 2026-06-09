const pool = require('../db');

// @route   POST /api/bookings
// @desc    Request an asset (Consumer)
exports.createBooking = async (req, res) => {
    const { asset_id, quantity, start_date, due_date } = req.body;
    const user_id = req.user.userId; // Extracted from the JWT middleware

    try {
        // 1. Check if the asset exists and has enough inventory
        const [assets] = await pool.query('SELECT available_quantity FROM Assets WHERE id = ?', [asset_id]);
        if (assets.length === 0) return res.status(404).json({ message: 'Asset not found' });

        if (assets[0].available_quantity < quantity) {
            return res.status(400).json({ message: 'Booking request exceeds available inventory.' });
        }

        // 2. Create the pending booking
        const [result] = await pool.query(
            'INSERT INTO Bookings (user_id, asset_id, quantity, start_date, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, asset_id, quantity, start_date, due_date, 'pending']
        );

        res.status(201).json({ message: 'Booking requested successfully', bookingId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
};

// @route   GET /api/bookings/my-history
// @desc    View borrowing history (Consumer)
exports.getUserBookings = async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT b.id, a.name AS asset_name, b.quantity, b.start_date, b.due_date, b.status 
            FROM Bookings b
            JOIN Assets a ON b.asset_id = a.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.userId]);
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};

// @route   GET /api/bookings
// @desc    View all active requests (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT b.id, u.name AS user_name, a.name AS asset_name, b.quantity, b.start_date, b.due_date, b.status 
            FROM Bookings b
            JOIN Users u ON b.user_id = u.id
            JOIN Assets a ON b.asset_id = a.id
            ORDER BY b.created_at DESC
        `);
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching all bookings' });
    }
};

// @route   PUT /api/bookings/:id/status
// @desc    Approve, Issue, or Return an asset (Admin only)
exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expects 'approved', 'rejected', 'issued', or 'returned'

    try {
        // 1. Get current booking details
        const [bookings] = await pool.query('SELECT * FROM Bookings WHERE id = ?', [id]);
        if (bookings.length === 0) return res.status(404).json({ message: 'Booking not found' });
        
        const booking = bookings[0];

        // 2. Handle Inventory Logic based on state change
        if (status === 'issued' && booking.status !== 'issued') {
            // Deduct from available inventory
            await pool.query('UPDATE Assets SET available_quantity = available_quantity - ? WHERE id = ?', [booking.quantity, booking.asset_id]);
        } else if (status === 'returned' && booking.status !== 'returned') {
            // Add back to available inventory and set return date
            await pool.query('UPDATE Assets SET available_quantity = available_quantity + ? WHERE id = ?', [booking.quantity, booking.asset_id]);
            await pool.query('UPDATE Bookings SET actual_return_date = NOW() WHERE id = ?', [id]);
        }

        // 3. Update the booking status
        await pool.query('UPDATE Bookings SET status = ? WHERE id = ?', [status, id]);

        res.status(200).json({ message: `Booking status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};
