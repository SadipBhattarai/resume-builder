const nodemailer = require("nodemailer");
const events = require("events");

const mailEvents = new events.EventEmitter();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify(function (error, sucess) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email server is ready");
  }
});

const sendEmail = async ({ to, subject, message }) => {
  return await transporter.sendMail({
    from: `"HireWire" <no-reply@hirewire.com>`,
    to,
    subject,
    html: message,
  });
};

mailEvents.on("sendEmail", async ( to, subject, message ) => {
    await sendEmail({ to, subject, message });
  });
module.exports = { sendEmail, mailEvents };
