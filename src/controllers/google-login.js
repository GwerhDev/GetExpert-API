const express = require("express");
const router = express.Router();
const passport = require("passport");
const userSchema = require("../models/User");
const { CLIENT_URL } = require("../config/config");
const { newToken } = require("../integrations/jwt");
const { loginGoogle } = require("../integrations/google");

passport.use('login-google', loginGoogle);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('login-google', { state: '200' }));

router.get('/callback', passport.authenticate('login-google', {
  successRedirect: `/auth/user/google/login/success`,
  failureRedirect: '/auth/user/google/login/failure'
}));

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;
    const userExist = await userSchema.findOne({ email: user.email });

    if (userExist) {
      const { _id, status, isExpert } = userExist;
      const data_login = { _id: _id.toString(), status, isExpert }
      const token = await newToken(data_login, 3)
      console.log('token', token)

      return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);

    } else {
      return res.status(400).redirect(`${CLIENT_URL}/auth?token=none`);
    }
  } catch (error) {
    return res.status(400).redirect(`${CLIENT_URL}/auth?token=none`);
  }
});

module.exports = router;
