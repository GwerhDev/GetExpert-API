const express = require("express");
const router = express.Router();
const { newToken, decodeToken } = require("../integrations/jwt");
const { contactExpert } = require("../integrations/sendGrid");
const userSchema = require("../models/User");
const requestSchema = require("../models/Request");
const { requestPendingStatus, inactiveStatus } = require("../config/utils");

router.get("/my-requests/:id", async (req, res) => {
  const bearerToken = req.headers.authorization.split(' ')[1];
  const verifiedToken = await decodeToken(bearerToken);
  const { id } = req.params.id;
  if((verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) && verifiedToken.data._id === id) {  
    const myRequests = await userSchema.findOne({ _id: id })
                                        .populate('request');
    return res.status(200).send(myRequests.request);
  }
});

router.post("/", async (req, res) => {
  const bearerToken = req.headers.authorization.split(' ')[1];
  const verifiedToken = await decodeToken(bearerToken);
  if(verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) {
    const { expertData, requestData } = req.body;
    const contact = {
      requester: requestData.username,
      requesterEmail: requestData.email,
      expertEmail: expertData.email,
      media: requestData.media,
      phone: requestData.phone,
      format: requestData.format,
      dayDate: requestData.dayDate,
      hourDate: requestData.hourDate,
      info: requestData.info,
    }

    const response = await contactExpert(contact);
    console.log(response);
    dataRequest = {
      idExpert: expertData.id,
      idRequester: requestData.id,
      media: requestData.media,
      phone: requestData.phone,
      format: requestData.format,
      dayDate: requestData.dayDate,
      hourDate: requestData.hourDate,
      info: requestData.info,
      status: requestPendingStatus,
    }

    const user = await userSchema.findOne({ _id: requestData.id });  
    const newRequest = await requestSchema.create(dataRequest);

    user.request = [...user.request, newRequest._id];
    await user.save();
    
    const tokenData = {
      idExpert: expertData.id,
      dayDate: requestData.dayDate,
      hourDate: requestData.hourDate,
      info: requestData.info,
    };

    const token = await newToken(tokenData);
    res.status(200).send({ token });
  }
});

module.exports = router;