const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const sender_email_id = process.env.email_id;
const oAuth_client = process.env.oAuth_client;
const oAuth_secret = process.env.oAuth_secret;
const oAuth_refresh_token = process.env.oAuth_refresh_token;
const redirect_uri = process.env.redirect_uri;

const oAuth2Client = new google.auth.OAuth2(
  oAuth_client,
  oAuth_secret,
  redirect_uri
);
oAuth2Client.setCredentials({ refresh_token: oAuth_refresh_token });

const sendMail = async (emailId, subject, body) => {
  return new Promise(async (resolve, reject) => {
    const access_token = await oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: sender_email_id, // generated ethereal user
        clientId: oAuth_client,
        clientSecret: oAuth_secret,
        refreshToken: oAuth_refresh_token,
        accessToken: access_token,
      },
    });
    transporter
      .sendMail({
        from: sender_email_id, // sender address
        to: emailId, // list of receivers
        subject: subject, // Subject line
        html: body, // plain text body
      })
      .then((res) => {
        return resolve({
          ok: true,
          message: "email sent",
        });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports = sendMail;
