const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const areaSchema = require("../models/Area");
const mediaSchema = require("../models/Media");
const regionSchema = require("../models/Region");
const communeSchema = require("../models/Commune");
const companySchema = require("../models/Company");
const professionSchema = require("../models/Profession");
const institutionSchema = require("../models/Institution");
const { message } = require("../messages");
const { waitingApproveStatus, superAdminStatus, activeStatus, inactiveStatus } = require("../config/utils");
const { decodeToken } = require("../integrations/jwt");
const e = require("express");
const { media, region, commune, company, profession, institution, area } = require("../config/lists");
const { limitDefault, pageDefault } = require("../config/consts");

router.get("/get-waiting-approve-experts", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const page = req.query.page || pageDefault;
      const responsesLimit = req.query.limit || limitDefault;
      const responsesSkip = (page - 1) * responsesLimit;
      const userFilter =  { username: 1, profilePic: 1, profession: 1, media: 1, region: 1, commune: 1 };
      const pendingExperts = await userSchema.find({ isExpert: true, status: waitingApproveStatus }, userFilter)
                                             .sort({ username: 1 })
  /*                                            .skip(responsesSkip)
                                             .limit(responsesLimit); */
      return res.status(200).send({ pendingExperts });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.patch("/approve-expert", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const { expertId } = req.body;
      await userSchema.findByIdAndUpdate(expertId, { status: activeStatus }, { new: true });
      return res.status(200).send({ message: message.approveExpert.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.patch("/reject-expert", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const { expertId } = req.body;
      await userSchema.findByIdAndUpdate(expertId, { status: inactiveStatus }, { new: true });
      return res.status(200).send({ message: message.rejectExpert.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.post("/add-item-to-list", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const {schema, value} = req.body;
      if(schema === area) {
        await areaSchema.create({ name: value });
      } else if(schema === media) {
        await mediaSchema.create({ name: value });
      } else if(schema === region) {
        await regionSchema.create({ name: value });
      } else if(schema === company) {
        await companySchema.create({ name: value });
      } else if(schema === profession) {
        await professionSchema.create({ name: value });
      } else if(schema === institution) {
        await institutionSchema.create({ name: value });
      }
      return res.status(200).send({ message: message.addItemToList.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.post("/add-commune-to-list/", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const { regionId, value } = req.body;
      const commune = await communeSchema.create({ name: value });
      await regionSchema.findByIdAndUpdate(regionId, { $push: { commune: commune._id } }, { new: true });
      return res.status(200).send({ message: message.addItemToList.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


router.delete("/remove-commune-from-list/:_id", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const { _id } = req.params;
      await communeSchema.findByIdAndDelete(_id);
      await regionSchema.updateMany({}, { $pull: { commune: _id } }, { new: true });
      return res.status(200).send({ message: message.removeItemFromList.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.delete("/remove-item-from-list/:schema/:_id", async (req, res) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verifiedToken = await decodeToken(bearerToken);
    if(verifiedToken.data.status === superAdminStatus) {
      const {schema, _id} = req.params;
      if(schema === area) {
        await areaSchema.findByIdAndDelete(_id);
      } else if(schema === media) {
        await mediaSchema.findByIdAndDelete(_id);
      } else if(schema === region) {
        await regionSchema.findByIdAndDelete(_id);
      } else if(schema === company) {
        await companySchema.findByIdAndDelete(_id);
      } else if(schema === profession) {
        await professionSchema.findByIdAndDelete(_id);
      } else if(schema === institution) {
        await institutionSchema.findByIdAndDelete(_id);
      }
      return res.status(200).send({ message: message.removeItemFromList.success });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;