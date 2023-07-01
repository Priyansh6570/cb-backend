import twilio from 'twilio';
// Function to send a WhatsApp message
const sendWhatsappAlert = async (to, message) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_MOBILE_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    console.log('WhatsApp message sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

export default sendWhatsappAlert;



