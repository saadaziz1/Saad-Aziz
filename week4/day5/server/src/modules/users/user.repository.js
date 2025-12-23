import User from "./user.model.js";

export class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(id) {
    return User.findById(id);
  }

  findAll() {
    return User.find();
  }

  async toggleBlock(id) {
    const user = await User.findById(id);
    return User.findByIdAndUpdate(id, { isBlocked: !user.isBlocked }, { new: true });
  }

  updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true });
  }

  count() {
    return User.countDocuments();
  }

  getUsersByRole() {
    return User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
  }
}
