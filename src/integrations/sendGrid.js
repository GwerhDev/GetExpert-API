const sgMail = require("@sendgrid/mail");
const {
  SENDGRID_API_KEY,
  CLIENT_URL,
  VERIFY_EMAIL_TEMPLATE,
  SENDGRID_SENDER_EMAIL,
  PASSWORD_RECOVERY_TEMPLATE,
  CONTACT_REQUEST_TEMPLATE,
} = require('../config/config');
const { newToken } = require('./jwt');

const sendEmailVerification = async (tokenData, route) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const token = await newToken(tokenData, 3);
  const link = `${CLIENT_URL}/${route}?token=${token}`;

  const msg = {
    to: tokenData.email,
    from: SENDGRID_SENDER_EMAIL,
    templateId: VERIFY_EMAIL_TEMPLATE,
    dynamic_template_data: {
      username: tokenData.username,
      subject: 'Verifica tu correo electrónico',
      link: link
    }
  };
  sgMail.send(msg);
  return { msg };
};

const passwordRecovery = async (user) => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const token = await newToken(user._id, 0.5)
  const link = `${CLIENT_URL}/account/password-recovery/${user._id}/${token}`;
  const msg = {
    to: user.email, 
    from: SENDGRID_SENDER_EMAIL,
    templateId: PASSWORD_RECOVERY_TEMPLATE,
    dynamic_template_data: {
      username: user.username,
      subject: 'Recuperación de contraseña',
      link: link
    }
  };
  sgMail.send(msg);
  return { msg };
};

const contactExpert = async (contact) => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: contact.expertEmail,
    from: SENDGRID_SENDER_EMAIL,
    templateId: CONTACT_REQUEST_TEMPLATE,
    dynamic_template_data: {
      subject: `${contact.requester} te ha enviado una solicitud de contacto`,
      name: contact.requester,
      email: contact.requesterEmail,
      phone: contact.phone,
      media: contact.media,
      format: contact.format,
      dayDate: contact.dayDate,
      hourDate: contact.hourDate,
      info: contact.info
    }
  };
  sgMail.send(msg);
  return { msg };
}

module.exports = {
  sendEmailVerification,
  passwordRecovery,
  contactExpert
};