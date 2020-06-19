const validator = require("express-validator");

exports.book_list = function (req, res, next) {
  book
    .find({}, "title author")
    .populate("author")
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ books: list });
    });
};

exports.book_detail = function (req, res, next) {
  book
    .findById(req.params.id)
    .populate("author")
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var err = new Error("Book Not Found");
        res.status(404).json({ err });
      }
      res.status(200).json({ book: results.book });
    });
};

exports.book_create = [
  validator
    .body("title", "title cannot be empty")
    .isLength({ min: 1 })
    .trim()
    .escape(),
  validator
    .body("description", "description cannot be empty")
    .isLength({ min: 1 })
    .trim()
    .escape(),
  validator.body("cover_image").trim().escape(),
  validator
    .body("price", "price can only be numeric")
    .isNumeric()
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    var Book = new book({
      title: req.body.title,
      author: req.user_detail.id,
      description: req.body.description,
      cover_image: req.body.cover_image,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      res.json({ err: errors.array() });
    }
    if (req.user_detail.pseudonym === "Darth Vader") {
      Book.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ saved: "success" });
      });
    } else {
      res
        .status(500)
        .json({ err: { msg: "You are blocked out of publishing any books" } });
    }
  },
];

exports.book_delete = (req, res, next) => {
  book.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    }
    if (results.author.toString() === req.user_detail.id.toString()) {
      book.findByIdAndRemove(req.params.id).exec((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ status: "success" });
      });
    }
  });
};
