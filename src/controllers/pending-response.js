const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const { waitingApproveStatus } = require("../config/utils");
const { decodeToken } = require("../integrations/jwt");
const { message } = require("../messages");

router.get('/:id', async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) {     
      const { id } = req.params;
      const user = await userSchema.findById(id);
      if (!user) return res.status(404).json({ error: message.formExpert.failure });
      user.status = waitingApproveStatus;
      await user.save();
      return res.status(200).json({ message: message.formExpert.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;