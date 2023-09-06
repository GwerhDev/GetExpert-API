const express = require("express");
const router = express.Router();
const userSchema = require("../models/User");
const experienceSchema = require("../models/Experience");
const expertiseSchema = require("../models/Expertise");
const educationSchema = require("../models/Education");
const evidenceSchema = require("../models/Evidence");
const networkSchema = require("../models/Network");
const { decodeToken } = require("../integrations/jwt");
const { message } = require("../messages");

router.patch('/:id', async (req, res) => {
    try {
        const bearerToken = req.headers.authorization.split(' ')[1];
        const verifiedToken = await decodeToken(bearerToken);
        const { id } = req.params;
        if((verifiedToken.data.isExpert || verifiedToken.data.status !== inactiveStatus) && verifiedToken.data._id === id) {  
            const { body } = req;
            const user = await userSchema.findById(id);
            if (!user) return res.status(404).json({ error: message.database.usernotfound });
            if (user.isExpert) {
                const educationData = {
                    career: null,
                    institution: null,
                    country: null,
                    since: null,
                    until: null
                };

                const experienceData = {
                    position: null,
                    company: null,
                    country: null,
                    since: null,
                    until: null
                };

                const expertiseData = {
                    area: null,
                    name: null,
                    bio: null
                };

                const networkData = {
                    linkedin: null,
                    twitter: null,
                    instagram: null,
                    medium: null
                };

                const evidenceData = {
                    photo: null,
                    type: null,
                    media: null,
                    title: null,
                    description: null,
                    url: null
                };
                
                const expertise = body.expertise[0]?._id ? 
                                  await expertiseSchema.findById(body.expertise[0]?._id) 
                                  : 
                                  await expertiseSchema.create(expertiseData);

                const network = body.network[0]?._id ? 
                                await networkSchema.findById(body.network[0]?._id) 
                                : 
                                await networkSchema.create(networkData);

                const evidence = [];
                const experience = [];
                const education = [];

                if(body.education?.length) {
                    for(let i in body.education) {
                        education.push(body.education[i]?._id ? 
                            await educationSchema.findById(body.education[i]?._id) 
                            : 
                            await educationSchema.create(educationData));
                    }
                }
                
                if(body.experience?.length) {
                    for(let i in body.experience) {
                        experience.push(body.experience[i]?._id ? 
                            await experienceSchema.findById(body.experience[i]?._id) 
                            : 
                            await experienceSchema.create(experienceData));
                    }
                }

                if(body.evidence?.length) {
                    for(let i in body.evidence) {
                        evidence.push(body.evidence[i]?._id ? 
                            await evidenceSchema.findById(body.evidence[i]?._id) 
                            : 
                            await evidenceSchema.create(evidenceData));
                    }
                }
                
                user.phone = body.phone;
                user.network = network._id;
                user.username = body.username;
                user.expertise = expertise._id;
                user.profilePic = body.profilePic;
                user.media = body.media?.map(e => e._id);
                user.region = body.region?.map(e => e._id);
                user.commune = body.commune?.map(e => e._id);
                user.profession = body.profession?.map(e => e._id);
                user.institution = body.institution?.map(e => e._id);
                user.evidence = evidence?.map(e => e._id);
                user.education = education?.map(e => e._id);
                user.experience = experience?.map(e => e._id);
                            
                expertise.area = body.expertise[0]?.area?.map(e => e._id);
                expertise.name = body.expertise[0]?.name;
                expertise.bio = body.expertise[0]?.bio;

                network.instagram = body.network[0]?.instagram;
                network.linkedin = body.network[0]?.linkedin;
                network.twitter = body.network[0]?.twitter;
                network.medium = body.network[0]?.medium;

                for(let i in body.education) {
                    education[i].institution = body.education[i]?.institution;
                    education[i].country = body.education[i]?.country;
                    education[i].career = body.education[i]?.career;
                    education[i].since = body.education[i]?.since;
                    education[i].until = body.education[i]?.until;
                }

                for(let i in body.experience) {
                    experience[i].company = body.experience[i]?.company;
                    experience[i].position = body.experience[i]?.position;
                    experience[i].country = body.experience[i]?.country;
                    experience[i].since = body.experience[i]?.since;
                    experience[i].until = body.experience[i]?.until;
                }

                for(let i in body.evidence) {
                    evidence[i].description = body.evidence[i]?.description;
                    evidence[i].photo = body.evidence[i]?.photo;
                    evidence[i].media = body.evidence[i]?.media;
                    evidence[i].title = body.evidence[i]?.title;
                    evidence[i].type = body.evidence[i]?.type;
                    evidence[i].url = body.evidence[i]?.url;
                }

                await user.save();
                await expertise.save();
                await network.save();

                experience.map(async(e) => await experienceSchema.findOneAndUpdate(
                    { _id: e._id },
                    { $set: e },
                    { new: true }
                ));

                education.map(async(e) => await educationSchema.findOneAndUpdate(
                    { _id: e._id },
                    { $set: e },
                    { new: true }
                ));
                evidence.map(async(e) => await evidenceSchema.findOneAndUpdate(
                    { _id: e._id },
                    { $set: e },
                    { new: true }
                ));

                return res.status(200).json({ message: message.database.expert.updatesuccess });
                
            } else {
                user.profilePic = body.profilePic;
                user.username = body.username;
                user.commune = body.commune;
                user.region = body.region;
                user.phone = body.phone;
                user.media = body.media;
                await user.save();

                return res.status(200).send({ message: message.data.user.updatesuccess });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
