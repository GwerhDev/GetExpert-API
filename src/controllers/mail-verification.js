const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const { message } = require("../messages");
const { inactiveStatus, activeStatus } = require("../config/utils");

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userSchema.findById(id);
    if (user && user.isExpert) {
      user.status = inactiveStatus;
      await user.save();
      return res.status(200).send({ msg: message.decodedToken.success });
    } else if(user && !user.isExpert) {
      user.status = activeStatus;
      await user.save();
      return res.status(200).send({ msg: message.decodedToken.success });
    }
    return res.status(400).send({ msg: message.decodedToken.failure });
  } catch (error) {
    return res.send({ msg: error.message });
  };
});

module.exports = router;
