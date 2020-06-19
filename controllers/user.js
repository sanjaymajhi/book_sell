const validator = require("express-validator");
const Author = require("../models/author");

exports.register = [
  validator.body("pseudonym").escape().trim(),
  validator.body("username").escape().trim(),
  validator.body("password").trim(),

  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        status: "unsuccessful",
        errors: errors.array(),
      });
      return;
    }

    Author.findOne({ username: req.body.username }, "username").exec(
      async (err, username) => {
        if (err) {
          return next(err);
        }
        if (username) {
          res.json({
            status: "unsuccessful",
            error: { msg: "Username already exists" },
          });
          return;
        } else {
          var salt = await bcrypt.genSalt(10);
          var password = await bcrypt.hash(req.body.password, salt);

          var author = new Author({
            pseudonym: req.body.pseudonym,
            password: password,
            username: req.body.username,
          });

          await author.save((err) => {
            if (err) {
              throw err;
            }

            res.status(200).json({ status: "success" });
          });
        }
      }
    );
  },
];

exports.login = [
  validator.body("username").escape().trim(),
  validator.body("password").trim(),

  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        status: "unsuccessful",
        errors: errors.array(),
      });
      return;
    }

    Author.findOne({ username: req.body.username }).exec(
      async (err, result) => {
        if (err) {
          return next(err);
        }
        if (!result) {
          res.json({
            status: "unsuccessful",
            error: { msg: "username does not exists" },
          });
          return;
        } else {
          const isMatch = await bcrypt.compare(
            req.body.password,
            result.password
          );

          if (!isMatch) {
            res.json({
              status: "unsuccessful",
              error: { msg: "Incorrect password" },
            });
            return;
          }

          var payload = {
            user: {
              id: result._id,
              name: result.pseudonym,
            },
          };
          await jwt.sign(
            payload,
            "sanjay",
            { expiresIn: 3600 },
            async (err, token) => {
              if (err) {
                throw err;
              }
              res.status(200).json({
                token: token,
                _id: result._id,
                username: result.username,
              });
            }
          );
        }
      }
    );
  },
];
