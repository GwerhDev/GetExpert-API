const express = require("express");
const router = express.Router();
const { CLIENT_URL } = require("../config/config");
const { inactiveStatus, defaultPassword } = require("../config/utils");
const { message } = require("../messages");
const { newToken } = require("../integrations/jwt");
const { signupLinkedinExpert } = require("../integrations/linkedin");

const userSchema = require("../models/User");
const educationSchema = require("../models/Education");
const experienceSchema = require("../models/Experience");
const expertiseSchema = require("../models/Expertise");
const networkSchema = require("../models/Network");
const evidenceSchema = require("../models/Evidence");
const passport = require("passport");

passport.use('signup-linkedin-expert', signupLinkedinExpert);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('signup-linkedin-expert', { state: '200' }));

router.get('/callback', passport.authenticate('signup-linkedin-expert', {
  successRedirect: `/auth/expert/linkedin/signup/success`,
  failureRedirect: `/auth/expert/linkedin/signup/failure`
}));

router.get('/failure', (req, res) => {
  return res.status(400).redirect(`${CLIENT_URL}/expert/register`);
});

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;
    const existingUser = await userSchema.findOne({ email: user.email });
    
    if (existingUser) {
      const errorToken = { error: true, isExpert: true, msg: message.signup.existinguser }
      const token = await newToken(errorToken, 3);
      return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);
    }

    const educationData = {
      career: null,
      institution: null,
      country: null,
      since: null,
      until: null,
    };

    const experienceData = {
      position: null,
      company: null,
      country: null,
      since: null,
      until: null,
    };

    const expertiseData = {
      area: null,
      name: null,
      bio: null
    };

    const networkData = {
      linkedin: null,
      twitter: null,
      instagram: null,
      medium: null
    };

    const evidenceData = {
      photo: null,
      type: null,
      media: null,
      title: null,
      description: null,
      url: null
    };

    const userData = {
      username: user.displayName,
      password: defaultPassword,
      email: user.email,
      phone: null,
      region: null,
      commune: null,
      profilePic: user.pictureUrl ?? null,
      profession: null,
      institution: null,
      media: null,
      status: inactiveStatus,
      isExpert: true,
    };

    const newEducation = await educationSchema.create(educationData);
    const newExperience = await experienceSchema.create(experienceData);
    const newExpertise = await expertiseSchema.create(expertiseData);
    const newNetwork = await networkSchema.create(networkData);
    const newEvidence = await evidenceSchema.create(evidenceData);

    userData.education = newEducation._id;
    userData.experience = newExperience._id;
    userData.expertise = newExpertise._id;
    userData.network = newNetwork._id;
    userData.evidence = newEvidence._id;

    const newUser = new userSchema(userData);
    await newUser.save()

    const populatedUser = await userSchema
    .findById(newUser._id)
    .populate('education')
    .populate('experience')
    .populate('expertise')
    .populate('network')
    .populate('evidence');
  
    const tokenData = {
      _id: populatedUser._id,
      username: populatedUser.username,
      email: populatedUser.email,
      status: populatedUser.status,
      isExpert: populatedUser.isExpert,
    };
  
    const token = await newToken(tokenData, 3);
    console.log(token);

    return res.status(200).redirect(`${CLIENT_URL}/auth?token=${token}`);

  } catch (error) {
    return res.status(400).send('error');
  }
});

module.exports = router;
