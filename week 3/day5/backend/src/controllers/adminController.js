const asyncHandler = require('express-async-handler');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/apiError');

const adminController = {
  promoteToAdmin: asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.role === 'superadmin') throw new ApiError(400, 'Cannot modify superadmin role');

    const updatedUser = await userRepository.updateById(req.params.id, { role: 'admin' });
    res.status(200).json({ success: true, message: 'User promoted to admin', user: updatedUser });
  }),

  promoteToSuperadmin: asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');

    const updatedUser = await userRepository.updateById(req.params.id, { role: 'superadmin' });
    res.status(200).json({ success: true, message: 'User promoted to superadmin', user: updatedUser });
  }),

  demoteToUser: asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.role === 'superadmin' && req.user.id === user._id.toString()) {
      throw new ApiError(400, 'Cannot demote yourself from superadmin');
    }

    const updatedUser = await userRepository.updateById(req.params.id, { role: 'user' });
    res.status(200).json({ success: true, message: 'User demoted to regular user', user: updatedUser });
  })
};

module.exports = adminController;