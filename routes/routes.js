const express = require("express");
const userController = require("../src/user/userController");
const router = express.Router();

router.post("/user/create", userController.createUserControllerFn); // Route pour créer un utilisateur
router.post("/user/login", userController.loginUserControllerFn); // Route pour la connexion

module.exports = router;
