export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  listUsers = async (req, res) => {
    const users = await this.userService.listUsers();
    res.json({ success: true, data: users });
  };

  getProfile = async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    res.json({ success: true, data: user });
  };

  updateProfile = async (req, res) => {
    const user = await this.userService.updateUser(req.user.id, req.body);
    res.json({ success: true, data: user });
  };

  toggleBlockUser = async (req, res) => {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot block/unblock yourself" });
    }
    const user = await this.userService.toggleBlockUser(req.params.id);
    res.json({ success: true, data: user });
  };

  toggleRoleUser = async (req, res) => {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot change your own role" });
    }
    const user = await this.userService.toggleRoleUser(req.params.id);
    res.json({ success: true, data: user });
  };

  getUserById = async (id) => {
    return this.userRepo.findById(id);
  };

  updateUser = async (id, updateData) => {
    return this.userRepo.updateById(id, updateData);
  };
}
