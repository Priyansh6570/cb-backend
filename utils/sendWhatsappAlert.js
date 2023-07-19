import twilio from 'twilio';
const sendWhatsappAlert = async (to, message) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      contentSid: process.env.TWILIO_CONTENT_SID,
      from: `whatsapp:${process.env.TWILIO_MOBILE_NUMBER}`,
      contentVariables: JSON.stringify({
        1: message.userName,
        2: message.userOrderName,
        3: message.userOrderMobile,
        4: message.carYear,
        5: message.carMake,
        6: message.carModel,
        7: message.carPrice.toString(),
        8: message.carFuel,
        9: message.carTransmission,
        10: message.carDetailsUrl
      }),
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: `whatsapp:${to}`,
    });

    console.log('WhatsApp message sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp message:');
  }
};

export default sendWhatsappAlert;



