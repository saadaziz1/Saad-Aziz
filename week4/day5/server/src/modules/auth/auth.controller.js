export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res) => {
    await this.authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  };

  login = async (req, res) => {
    const data = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data
    });
  };
}
