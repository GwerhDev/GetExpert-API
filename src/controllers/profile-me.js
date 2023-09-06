const express = require("express");
const { message } = require("../messages");
const { newToken, decodeToken } = require("../integrations/jwt");
const router = express.Router();
const userSchema = require("../models/User");
const { waitingEmailStatus } = require("../config/utils");

router.get('/:id', async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    const { id } = req.params;
    if((verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) && verifiedToken.data._id === id) {  
      const user = await userSchema.findOne({ _id: id });

      if (!user) return res.status(400).send({ msg: message.login.notexistinguser });
      if (user.status === waitingEmailStatus) return res.status(400).send({ msg: message.login.waitingemail });

      const { _id, username, email, phone, isExpert, status, profilePic } = user;
      if(!isExpert) {
        const data_login = { _id, username, email, isExpert, status, profilePic, phone };
        const token = await newToken(data_login, 3);
        return res.status(200).send({ token });
      } else {
        const populatedUser = await userSchema.findById(_id)
                                              .populate('media')
                                              .populate('region')
                                              .populate('commune')
                                              .populate('network')
                                              .populate('evidence')
                                              .populate('education')
                                              .populate('profession')
                                              .populate('experience')
                                              .populate('institution')
                                              .populate({ path: 'expertise', populate: { path: 'area'}});

        const tokenData = {
          _id: populatedUser._id,
          media: populatedUser.media,
          email: populatedUser.email,
          phone: populatedUser.phone,
          region: populatedUser.region,
          status: populatedUser.status,
          network: populatedUser.network,
          commune: populatedUser.commune,
          username: populatedUser.username,
          isExpert: populatedUser.isExpert,
          evidence: populatedUser.evidence,
          education: populatedUser.education,
          expertise: populatedUser.expertise,
          profilePic: populatedUser.profilePic,
          experience: populatedUser.experience,
          profession: populatedUser.profession,
          institution: populatedUser.institution,
        };

        const token = await newToken(tokenData, 3);
        return res.status(200).send({ token });
      }
    };
  } catch (error) {
    return res.status(400).send({ msg: message.login.failure });
  };
})

module.exports = router;