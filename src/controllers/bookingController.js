exports.createBooking = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
exports.getUserBookings = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};
exports.getBookingById = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
exports.cancelBooking = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
