const router = require("express").Router();
const UserController = require('../controllers/UserController')

// middlewares
const verifyToken = require("../helpers/check-token");
const { imageUpload } = require("../helpers/image-upload");

router.get('/', UserController.getAllUsers)
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/getuserbytoken/:token", UserController.getUserByToken);
router.get("/:id", UserController.getUserById);
router.get("/img/:photo", UserController.getUserPhoto);
router.post("/editprofile/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);
  
module.exports = router;