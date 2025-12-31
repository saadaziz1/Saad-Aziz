const User = require('../models/user.model');

const userRepository = {
  async mentionSearch(query) {
    const filter = query ? { name: { $regex: query, $options: 'i' } } : {};
    return await User.find(filter)
      .select('_id name')
      .limit(20)
      .sort({ name: 1 });
  },

  async createUser(data) {
    return await User.create(data);
  },

  async findByEmail(email) {
    return await User.findOne({ email });
  },

  async findById(id) {
    return await User.findById(id);
  },

  async updateById(id, payload) {
    return await User.findByIdAndUpdate(id, payload, { new: true });
  },

  async list(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    
    const users = await User.find(filters)
      .select('-passwordHash')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filters);
    
    return { users, total };
  }
};

module.exports = userRepository;