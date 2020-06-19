var express = require("express");
var router = express.Router();

const userController = require("../controllers/user"); //author
const bookController = require("../controllers/book");
const auth = require("../auth");

router.post("/login", userController.login);
router.post("/register", userController.register);

router.get("/books", bookController.book_list);
router.get("/book/:id", bookController.book_detail);
router.post("/book/create", auth, bookController.book_create);
router.post("/book/:id/delete", auth, bookController.book_delete);

module.exports = router;
