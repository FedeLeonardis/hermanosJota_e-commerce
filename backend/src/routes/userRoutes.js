const express = require("express");
const usersRouter = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

usersRouter.post("/register", userController.registerUser);
usersRouter.post("/login", userController.loginUser);
usersRouter.post("/logout", userController.logoutUser);

usersRouter.get("/profile", verifyToken, userController.getUserProfile);
usersRouter.get("/check-session", verifyToken, userController.checkSession);

module.exports = usersRouter;
