const router = require("express").Router();
const userController = require("./user.controller");

router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req.body);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const result = await userController.register(req.body);
    res.json({ data: "User registered Sucessfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/email/verify", async (req, res, next) => {
  try {
    const result = await userController.verifyEmail(req.body);
    res.json({ data: "Email verified Sucessfully" });
  } catch (error) {
    next(error);
  }
});
router.post("/email/resend", async (req, res, next) => {
  try {
    const result = await userController.resendEmailOTP(req.body);
    res.json({ data: "OTP resent sucessfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
