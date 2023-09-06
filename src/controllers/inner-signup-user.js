const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const bcrypt = require("bcrypt");
const { sendEmailVerification } = require("../integrations/sendGrid");
const { message } = require("../messages");
const { waitingEmailStatus, activeStatus, inactiveStatus } = require("../config/utils");

router.post('/', async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await userSchema.findOne({ email: user.email });

    if (existingUser) {
      const errorToken = { error: true, isExpert: false, msg: message.signup.existinguser }
      return res.status(200).send({errorToken});
    }

    const userData = {
      username: user.username,
      password: user.password,
      email: user.email,
      phone: user.phone,
      status: waitingEmailStatus,
      isExpert: false
    };

    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(user.password, salt);

    const newUser = new userSchema(userData);
    await newUser.save();

    const tokenData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      status: newUser.status,
      isExpert: newUser.isExpert,
    };

    const sendedEmail = await sendEmailVerification(tokenData, 'auth');
    console.log(sendedEmail);
    
    const response = { msg: message.emailVerification.success };
    return res.status(200).send(response);

  } catch (error) {
    return res.status(400).send(error);
  };
});

module.exports = router;