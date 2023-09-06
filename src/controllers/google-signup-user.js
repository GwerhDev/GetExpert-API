const express = require("express");
const router = express.Router();
const passport = require("passport");
const userSchema = require("../models/User");
const { signupGoogleUser } = require("../integrations/google");
const { message } = require("../messages");
const { newToken } = require("../integrations/jwt");
const { CLIENT_URL } = require("../config/config");
const { defaultPassword, activeStatus } = require("../config/utils");

passport.use('signup-google-user', signupGoogleUser);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('signup-google-user', { state: '200' }));

router.get('/callback', passport.authenticate('signup-google-user', {
  successRedirect: '/auth/user/google/signup/success',
  failureRedirect: '/auth/user/google/signup/failure'
}));

router.get('/failure', (req, res) => {
  return res.status(400).redirect(`${CLIENT_URL}/user/register`);
});

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;
    const existingUser = await userSchema.findOne({ email: user.email });

    if (existingUser) {
      const errorToken = { error: true, isExpert: false, msg: message.signup.existinguser }
      const token = await newToken(errorToken, 3);
      return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);
    }

    const userData = {
      username: user.name,
      password: defaultPassword,
      email: user.email,
      phone: null,
      region: null,
      commune: null,
      profilePic: user.photo ?? null,
      status: activeStatus,
      isExpert: false,
    };

    const newUser = new userSchema(userData);
    await newUser.save()

    const populatedUser = await userSchema.findById(newUser._id);
  
    const tokenData = {
      _id: populatedUser._id,
      username: populatedUser.username,
      email: populatedUser.email,
      status: populatedUser.status,
      isExpert: populatedUser.isExpert,
    };
    
    const token = await newToken(tokenData, 3);

    return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);

  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
