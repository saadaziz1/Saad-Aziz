import bcrypt from "bcrypt";
import { ApiError } from "../../shared/errors/ApiError.js";
import { generateToken } from "../../shared/utils/jwt.util.js";

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register(payload) {
    const { name, email, password } = payload;

    const existingUser =
      await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword
    });
  }

  async login(payload) {
    const { email, password } = payload;

    const user =
      await this.authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "User is blocked");
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    };
  }
}
