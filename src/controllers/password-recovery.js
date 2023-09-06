const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const { passwordRecovery } = require("../integrations/sendGrid");
const { message } = require("../messages");

router.post('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: message.database.usernotfound });
    }
    await passwordRecovery(user)
    return res.status(200).send({ msg: message.passwordRecovery.success });
  } catch (error) {
    console.error(error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const { id } = req.params;
    const verifiedToken = await decodeToken(bearerToken);
    const user = await userSchema.findById(id);
    if(verifiedToken.data._id === id) {     
      user.password = data.password;
      await user.save();
      return user;
    }
  } catch (error) {
    console.error(error);  
  }
});

module.exports = router;