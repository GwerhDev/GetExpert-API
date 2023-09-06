const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const passport = require("passport");
const { CLIENT_URL } = require("../config/config");
const { message } = require("../messages");
const { newToken } = require("../integrations/jwt");
const { loginLinkedin } = require("../integrations/linkedin");

passport.use('login-linkedin', loginLinkedin)

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('login-linkedin', { state: '200' }));

router.get('/callback', passport.authenticate('login-linkedin', {
  successRedirect: '/auth/user/linkedin/login/success',
  failureRedirect: '/auth/user/linkedin/login/failure'
}));

router.get('/failure', (req, res) => {
  return res.status(400).redirect(`${CLIENT_URL}`);
});

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;
    const userExist = await userSchema.findOne({ email: user.email });

    if (userExist) {
      const { _id, status, isExpert } = userExist;
      const data_login = { _id: _id.toString(), status, isExpert }
      const token = await newToken(data_login, 3);
      console.log('token', token);

      return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);

    } else {
      return res.status(400).redirect(`${CLIENT_URL}/auth?token=none`);
    }

  } catch (error) {
    return res.status(400).redirect(`${CLIENT_URL}/auth?token=none`);
  }
});

module.exports = router;
