import User from "../users/user.model.js";

export class AuthRepository {
  findByEmail(email) {
    return User.findOne({ email });
  }

  createUser(data) {
    return User.create(data);
  }
}
