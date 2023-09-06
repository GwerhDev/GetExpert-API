const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
const { LINKEDIN_KEY, LINKEDIN_SECRET, API_URL } = require("../config/config");

const loginLinkedin = new LinkedinStrategy({
  clientID: LINKEDIN_KEY,
  clientSecret: LINKEDIN_SECRET,
  callbackURL: `${API_URL}/auth/user/linkedin/login/callback`,
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try {
      const linkedinData = {
        displayName: profile.displayName,
        accessToken: accessToken,
        email: profile.emails[0].value,
        linkedinId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        headline: profile._json.headline,
        location: profile._json.location,
        industry: profile._json.industry,
        pictureUrl: profile.photos[3].value,
        publicProfileUrl: profile.profileUrl
      }
      return done(null, linkedinData)
    } catch (err) {
      return done(err);
    };
  });
});

const signupLinkedinUser = new LinkedinStrategy({
  clientID: LINKEDIN_KEY,
  clientSecret: LINKEDIN_SECRET,
  callbackURL: `${API_URL}/auth/user/linkedin/signup/callback`,
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      try {
        const linkedinData = {
          displayName: profile.displayName,
          accessToken: accessToken,
          email: profile.emails[0].value,
          linkedinId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          headline: profile._json.headline,
          location: profile._json.location,
          industry: profile._json.industry,
          pictureUrl: profile.photos[3].value,
          publicProfileUrl: profile.profileUrl
        }
  
        return done(null, linkedinData);
      } catch (err) {
        return done(err);
      };
    });
});

const signupLinkedinExpert = new LinkedinStrategy({
  clientID: LINKEDIN_KEY,
  clientSecret: LINKEDIN_SECRET,
  callbackURL: `${API_URL}/auth/expert/linkedin/signup/callback`,
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
  }, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try {
      const linkedinData = {
        displayName: profile.displayName,
        accessToken: accessToken,
        email: profile.emails[0].value,
        linkedinId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        headline: profile._json.headline,
        location: profile._json.location,
        industry: profile._json.industry,
        pictureUrl: profile.photos[3].value,
        publicProfileUrl: profile.profileUrl
      }

      return done(null, linkedinData);
    } catch (err) {
      return done(err);
    };
  });
});

module.exports = {
  loginLinkedin,
  signupLinkedinUser,
  signupLinkedinExpert
};
