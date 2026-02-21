const router = require("express").Router();
const userRouter = require("../modules/users/user.route");

router.use("/", (req, res, next) => {
  try {
    res.json({ data: "API is working Properly" });
  } catch (error) {
    next(error);
  }
});

router.use("api/v1/users", userRouter);

module.exports = router;
