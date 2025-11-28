// const express = require("express");
// const usersRouter = express.Router();
// const verifyToken = require("../middleware/authMiddleware");
// const userController = require("../controllers/userController");

// usersRouter.post("/register", userController.registerUser);
// usersRouter.post("/login", userController.loginUser);
// usersRouter.post("/logout", userController.logoutUser);

// usersRouter.get("/profile", verifyToken, userController.getUserProfile);
// usersRouter.get("/check-session", verifyToken, userController.checkSession);

// module.exports = usersRouter;

const express = require("express");
const usersRouter = express.Router();

// 👇 CAMBIO IMPORTANTE: Usamos destructuración { protect }
const { protect } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

usersRouter.post("/register", userController.registerUser);
usersRouter.post("/login", userController.loginUser);
usersRouter.post("/logout", userController.logoutUser);

// 👇 Usamos 'protect' en las rutas que requieren sesión
usersRouter.get("/profile", protect, userController.getUserProfile);
usersRouter.get("/check-session", protect, userController.checkSession);

module.exports = usersRouter;
