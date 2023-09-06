const express = require("express");
const router = express.Router();
const { newToken } = require("../integrations/jwt");
const { message } = require("../messages");
const userSchema = require("../models/User");
const bcrypt = require("bcrypt");
const { waitingEmailStatus } = require("../config/utils");

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const user = await userSchema.findOne({ email: data.email });
    if (!user) return res.status(400).send({ error: message.login.notexistinguser });
    if (user.status === waitingEmailStatus) return res.status(400).send({ error: message.login.waitingemail });

    if (data.password !== null && data.email !== null) {
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (passwordMatch) {
        const { _id, username, email, isExpert, status, phone } = user;
        const data_login = { _id: _id.toString(), username, email, isExpert, status, phone };
        const token = await newToken(data_login, 3);
        console.log("token", token)
        
        return res.status(200).send({ token });

      } else {
        return res.status(400).send({ error: message.login.credentialsfailure });
      };
    };

    return res.status(400).send({ error: message.login.failure });

  } catch (error) {
    return res.status(400).send({ msg: message.login.failure });
  };
});

module.exports = router;