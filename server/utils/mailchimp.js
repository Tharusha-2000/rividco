const axios = require("axios");

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // Example: us19
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

const subscribeToNewsletter = async (email) => {
  const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  try {
    const response = await axios.post(
      url,
      {
        email_address: email,
        status: "subscribed",
      },
      {
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || "Error" };
  }
};

module.exports =  subscribeToNewsletter ;
