const userService = require("./userServices");

const createUserControllerFn = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    const status = await userService.createUserDBService({ email });
    if (status) {
      return res
        .status(201)
        .json({ status: true, message: "User created successfully" });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error in createUserControllerFn:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const loginUserControllerFn = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    res
      .status(200)
      .json({ status: true, message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in loginUserControllerFn:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { createUserControllerFn, loginUserControllerFn };
