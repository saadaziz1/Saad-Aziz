const asyncHandler = require('express-async-handler');
const userRepository = require('../repositories/userRepository');

const userController = {
  mentionSearch: asyncHandler(async (req, res) => {
    const { q = '' } = req.query;
    const users = await userRepository.mentionSearch(q);
    res.status(200).json({ success: true, users });
  }),

  blockUser: asyncHandler(async (req, res) => {
    const user = await userRepository.updateById(req.params.id, { isBlocked: true });
    res.status(200).json({ success: true, message: 'User blocked', user });
  }),

  unblockUser: asyncHandler(async (req, res) => {
    const user = await userRepository.updateById(req.params.id, { isBlocked: false });
    res.status(200).json({ success: true, message: 'User unblocked', user });
  }),

  listUsers: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await userRepository.list({}, { page, limit });
    res.status(200).json({ success: true, ...result });
  })
};

module.exports = userController;