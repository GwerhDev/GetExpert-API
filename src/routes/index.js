const express = require('express');
const router = express.Router();

const formList = require('../controllers/form-list');
const pendingResponse = require('../controllers/pending-response');

const loginAdmin = require('../controllers/admin');

const loginInner = require('../controllers/inner-login');
const signupInnerUser = require('../controllers/inner-signup-user');
const signupInnerExpert = require('../controllers/inner-signup-expert');

const logInLinkedin = require('../controllers/linkedin-login');
const signUpLinkedinUser = require('../controllers/linkedin-signup-user');
const signUpLinkedinExpert = require('../controllers/linkedin-signup-expert');

const logInGoogle = require('../controllers/google-login');
const signUpGoogleUser = require('../controllers/google-signup-user');
const signUpGoogleExpert = require('../controllers/google-signup-expert');

const profileMe = require('../controllers/profile-me');
const profileUpdate = require('../controllers/profile-update');

const passwordReset = require('../controllers/password-reset');
const passwordRecovery = require('../controllers/password-recovery');
const mailVerification = require('../controllers/mail-verification');

const expert = require('../controllers/expert');

const contactRequest = require('../controllers/contact-request');

/*------------------------- FORMS ------------------------*/
router.use('/form-list', formList);

/*------------------------- ADMIN ------------------------*/
router.use('/admin', loginAdmin);

/*------------------------- AUTH -------------------------*/
router.use('/auth/user/inner/login', loginInner);
router.use('/auth/user/inner/signup', signupInnerUser);
router.use('/auth/expert/inner/signup', signupInnerExpert);

router.use('/auth/user/linkedin/login', logInLinkedin);
router.use('/auth/user/linkedin/signup', signUpLinkedinUser);
router.use('/auth/expert/linkedin/signup', signUpLinkedinExpert);

router.use('/auth/user/google/login', logInGoogle);
router.use('/auth/user/google/signup', signUpGoogleUser);
router.use('/auth/expert/google/signup', signUpGoogleExpert);

/*------------------------ ACCOUNT -----------------------*/
router.use('/account/profile-me', profileMe)
router.use('/account/profile-update', profileUpdate);

router.use('/account/mail-verification', mailVerification);
router.use('/account/password-recovery', passwordRecovery);
router.use('/account/password-reset', passwordReset);

router.use('/account/pending-response', pendingResponse);

/*--------------------- FILTER EXPERTS --------------------*/
router.use('/expert', expert);

/*------------------------- CONTACT -----------------------*/
router.use('/contact-request', contactRequest);

/*----------------------- VALIDATION ----------------------*/

module.exports = router;