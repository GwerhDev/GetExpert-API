const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const { activeStatus, inactiveStatus } = require("../config/utils");
const { decodeToken } = require("../integrations/jwt");
const { pageDefault, limitDefault } = require("../config/consts");

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || pageDefault;
    const responsesLimit = req.query.limit || limitDefault;
    const responsesSkip = (page - 1) * responsesLimit;
    const validatedExpert = { isExpert: true, status: activeStatus };
    const userFilter =  { username: 1, profilePic: 1, profession: 1, media: 1, region: 1, commune: 1 };
    const expertiseFilter = { name: 1 };

    const totalUsers = await userSchema.countDocuments(validatedExpert, userFilter);
    const totalPages = Math.ceil(totalUsers / responsesLimit);
    
    const users = await userSchema.find(validatedExpert, userFilter)
                                  .populate('expertise', expertiseFilter)
                                  .sort({ username: 1 })
                                  .skip(responsesSkip)
                                  .limit(responsesLimit);
    res.status(200).json({users, totalPages});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) {
      const { id } = req.params;
      const validatedExpert = { _id: id };
      const userFilter =  { username: 1, profilePic: 1, profession: 1, media: 1, region: 1, commune: 1, status: 1, email: 1 };

      const users = await userSchema.findOne(validatedExpert, userFilter)
                                    .populate('education')
                                    .populate('experience')
                                    .populate({ path: 'expertise', populate: { path: 'area'}})
                                    .populate('network')
                                    .populate('evidence');
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/getfiltered", async (req, res) => {
  try {
    const page = req.query.page || pageDefault;
    const responsesLimit = req.query.limit || limitDefault;
    const responsesSkip = (page - 1) * responsesLimit;
    const { name, expertise, region, commune, media, mode } = req.body;
    const regexName = new RegExp(name, 'i');
    const userFilter = { username: 1, profilePic: 1, profession: 1, media: 1, region: 1, commune: 1 };
    const expertiseFilter = { name: 1, bio: 1, area: 1 };
    const filter = { 
      isExpert: true, 
      status: activeStatus,
      username: name?.length? regexName : { $ne: null },
      media: media?.length? media : { $ne: null },
      region: region?.length? region : { $ne: null },
      commune: commune?.length? commune : { $ne: null },
    };
    const totalUsers = await userSchema.countDocuments(filter, userFilter);

    const totalPages = Math.ceil(totalUsers / responsesLimit);

    let users = await userSchema
                .find(filter, userFilter)
                .sort({ username: 1 })
                .populate("expertise", expertiseFilter)
                .skip(responsesSkip)
                .limit(responsesLimit);
    
    res.status(200).json({users, totalPages});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;