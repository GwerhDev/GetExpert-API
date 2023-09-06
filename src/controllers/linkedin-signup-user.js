const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const passport = require("passport");
const { CLIENT_URL } = require("../config/config");
const { defaultPassword, activeStatus } = require("../config/utils");
const { message } = require("../messages");
const { newToken } = require("../integrations/jwt");
const { signupLinkedinUser } = require("../integrations/linkedin");

passport.use('signup-linkedin-user', signupLinkedinUser);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('signup-linkedin-user', { state: '200' }));

router.get('/callback', passport.authenticate('signup-linkedin-user', {
  successRedirect: `/auth/user/linkedin/signup/success`,
  failureRedirect: `/auth/user/linkedin/signup/failure`
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
      username: user.displayName,
      password: defaultPassword,
      email: user.email,
      region: user.region,
      commune: user.commune,
      phone: user.phone,
      profilePic: user.pictureUrl ?? null,   
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
      phone: populatedUser.phone,
      region: populatedUser.region,
      commune: populatedUser.commune,
      profilePic: populatedUser.profilePic,
      status: populatedUser.status,
      isExpert: populatedUser.isExpert,
    };
  
    const token = await newToken(tokenData, 3);

    return res.status(200).redirect(`${CLIENT_URL}/user/register?token=${token}`);

  } catch (error) {
    return res.status(400).send('error');
  }

});

module.exports = router;
