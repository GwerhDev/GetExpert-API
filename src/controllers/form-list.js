const express = require("express");
const router = express.Router();

const areaSchema = require("../models/Area");
const mediaSchema = require("../models/Media");
const regionSchema = require("../models/Region");
const communeSchema = require("../models/Commune");
const companySchema = require("../models/Company");
const professionSchema = require("../models/Profession");
const institutionSchema = require("../models/Institution");

const { modeList } = require("../forms/mode-list");
const { evidenceList } = require("../forms/evidence-list");
const { generateArrayID } = require("../utils/id-generator");

const listMode = generateArrayID(modeList);

router.get("/get-all-list", async (req, res) => {
  const listArea = await areaSchema.find();
  const listMedia = await mediaSchema.find();
  const listRegion = await regionSchema.find();
  const listCommune = await communeSchema.find();
  const listCompany = await companySchema.find();
  const listProfession = await professionSchema.find();
  const listInstitution = await institutionSchema.find();
  return res.send({ listMedia, listProfession, listInstitution, listCompany, listArea, listRegion, listCommune });
});
  
router.get("/filter", async (req, res) => {  
  const listArea = await areaSchema.find();
  const listMedia = await mediaSchema.find();
  const listRegion = await regionSchema.find();
  const listCommune = await communeSchema.find();
  const listProfession = await professionSchema.find();
  return res.send({ listRegion, listCommune, listMedia, listMode, listProfession, listArea });
});

router.get("/get-profession-list", async (req, res) => {
  const listProfession = await professionSchema.find();
  return res.send({ listProfession });
});

router.get("/get-institution-list", async (req, res) => {
  const listInstitution = await institutionSchema.find();
  return res.send({ listInstitution });
});

router.get("/get-company-list", async (req, res) => {
  const listCompany = await companySchema.find();
  return res.send({ listCompany });
});

router.get("/get-media-list", async (req, res) => {
  const listMedia = await mediaSchema.find();
  return res.send({ listMedia });
});

router.get("/get-area-list", async (req, res) => {
  const listArea = await areaSchema.find();
  return res.send({ listArea });
});

router.get("/get-evidence-list", async (req, res) => {
  return res.send({ evidenceList });
});

router.get("/expert-register/step1", async (req, res) => {
  const listMedia = await mediaSchema.find();
  const listProfession = await professionSchema.find();
  const listInstitution = await institutionSchema.find();
  return res.send({ listProfession, listInstitution, listMedia  });
});

router.get("/expert-register/step2", async (req, res) => {
  const listArea = await areaSchema.find();
  return res.send({ listArea });
});

router.get("/expert-register/step3", async (req, res) => {
  const listCompany = await companySchema.find();
  const listInstitution = await institutionSchema.find();
  return res.send({ listInstitution, listCompany });
});

router.get("/expert-register/step4", async (req, res) => {
  const listRegion = await regionSchema.find();
  const listCommune = await communeSchema.find();
  return res.send({ listRegion, listCommune });
});

router.get("/expert-register/step5", async (req, res) => {
  const listMedia = await mediaSchema.find();
  return res.send({ evidenceList, listMedia });
});

module.exports = router;