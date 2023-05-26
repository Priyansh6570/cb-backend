// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_MOBILE_NUMBER;

// const client = twilio(accountSid, authToken);

// const sendWhatsappAlert = async (options) => {
//   try {
//     const message = await client.messages.create({
//       body: options.message,
//       from: 'whatsapp:+14155238886', // Use the Twilio number with the 'whatsapp:' prefix
//       to: options.phone,
//     });
//     return message;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default sendWhatsappAlert;
