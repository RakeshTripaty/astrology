const axios = require('axios');
const Kundli = require('../../model/userModel/freeKundali');

const generateKundli = async (req, res) => {
  try {
    // Extract required parameters from the request body
    const { name, gender, birthDate, birthPlace } = req.body;

    // Make a request to Prokerala API to generate Kundli
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

    const kundliResponse = await axios.post(
      'https://api.prokerala.com/v2/astrology/kundli',
      {
        name,
        gender,
        dob: birthDate,
        coordinates: birthPlace,
      },
      config
    );

    // Extract relevant data from kundliResponse and save it to MongoDB
    const kundliData = kundliResponse.data.data;

    // Save Kundli data to MongoDB
    const newKundli = new Kundli({
      name,
      gender,
      birthDate,
      birthPlace,
      astroDetails: {
        // You may need to customize this based on the structure of Prokerala's response
        planetPositions: kundliData.astro.planet_positions,
      },
    });

    await newKundli.save();

    // Send Kundli data in the response
    res.json(kundliData);
  } catch (error) {
    console.error('Error generating Kundli:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  generateKundli,
};
