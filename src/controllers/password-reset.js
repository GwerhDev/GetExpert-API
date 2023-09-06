const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const bcrypt = require("bcrypt");
const { decodeToken } = require("../integrations/jwt");
const { message } = require("../messages");

router.patch('/:id', async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const { id } = req.params;
    const { newPassword } = req.body;
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data === id) {
      const salt = await bcrypt.genSalt();
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      await userSchema.findByIdAndUpdate(id, { password: newHashedPassword }, { new: true });
      return res.status(200).json({ message: message.database.success });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;