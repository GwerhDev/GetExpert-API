const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sendEmailVerification } = require("../integrations/sendGrid");
const { newToken } = require("../integrations/jwt");
const { message } = require("../messages");
const { waitingEmailStatus, inactiveStatus } = require("../config/utils");
const userSchema = require("../models/User");
const educationSchema = require("../models/Education");
const experienceSchema = require("../models/Experience");
const expertiseSchema = require("../models/Expertise");
const networkSchema = require("../models/Network");
const evidenceSchema = require("../models/Evidence");

router.post('/', async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await userSchema.findOne({ email: user.email });
    
    if (existingUser) {
      const errorToken = { error: true, isExpert: true, msg: message.signup.existinguser }
      return res.status(200).send({errorToken});
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
      username: user.username,
      password: user.password,
      email: user.email,
      phone: user.phone,
      region: null,
      commune: null,
      profilePic: null,
      profession: null,
      institution: null,
      media: null,
      status: waitingEmailStatus,
      isExpert: true
    };

    // checkFieldsNotEmpty (password, email, username, status, isExpert)

    const newEducation = await educationSchema.create(educationData);
    const newExperience = await experienceSchema.create(experienceData);
    const newExpertise = await expertiseSchema.create(expertiseData);
    const newNetwork = await networkSchema.create(networkData);
    const newEvidence = await evidenceSchema.create(evidenceData);

    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(user.password, salt);

    userData.education = newEducation._id;
    userData.experience = newExperience._id;
    userData.expertise = newExpertise._id;
    userData.network = newNetwork._id;
    userData.evidence = newEvidence._id;

    const newUser = new userSchema(userData);
    await newUser.save();

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

    const sendedEmail = await sendEmailVerification(tokenData, 'auth');
    console.log(sendedEmail);
    
    const response = { msg: message.emailVerification.success };
    return res.status(200).send(response);

  } catch (error) {
    return res.status(400).send({ msg: error });
  };
});

module.exports = router;