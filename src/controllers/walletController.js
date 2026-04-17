exports.getWalletBalance = async (req, res) => {
  res.status(200).json({ success: true, data: { balance: 0 } });
};
exports.getWalletTransactions = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};
exports.addMoney = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
exports.verifyPayment = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
exports.withdrawMoney = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
