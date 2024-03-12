const axios = require('axios');
const mongoose = require('mongoose');


const getDailyPanchang = async (req, res) => {
  try {
    const ayanamsa = 1;
    const coordinates = '10.214747,78.097626';
    const datetime = new Date().toISOString();
    const language = 'en';

    const response = await axios.post('https://api.prokerala.com/token', {
      grant_type: 'client_credentials',
      client_id: 'ea7f6198-0189-4af5-8031-352b7ce1eb0b',
      client_secret: '8y5xe4KjDg3GLuZ8XRObCQmTU7ZYV5g0i9NfLKgL',
    });

    const { token_type, access_token } = response.data;

    const config = {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    const panchangData = await axios.get(
      `https://api.prokerala.com/v2/astrology/panchang?ayanamsa=${ayanamsa}&coordinates=${coordinates}&datetime=${datetime}&la=${language}`,
      config
    );

    // Save panchang data directly to MongoDB
    const PanchangCollection = mongoose.connection.collection('panchang');

    await PanchangCollection.insertOne({
      ayanamsa,
      coordinates,
      datetime,
      language,
      data: panchangData.data.data,
    });

    res.send({ data: panchangData.data.data });
  } catch (error) {
    console.error('Error fetching and saving panchang data:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDailyPanchang,
};

