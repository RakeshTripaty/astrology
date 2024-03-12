 const axios = require('axios');

const dailyHoroscope = async (req, res) => {
  try {
    const sign = 'aries';
    const date = new Date().toISOString();

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

    const horoscopeData = await axios.get(
      `https://api.prokerala.com/v2/horoscope/daily?sign=${sign}&datetime=${date}`,
      config
    );

    // Save horoscope data to MongoDB or handle it as needed
    // ...

    res.send({ data: horoscopeData.data.data });
  } catch (error) {
    console.error('Error fetching and handling horoscope data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  dailyHoroscope,
};


// const dailyHoroscope = async (req, res) => {
//   try {
//     const currentDate = new Date().toISOString();
    
//     const clientId = 'ea7f6198-0189-4af5-8031-352b7ce1eb0b';
//     const clientSecret = '8y5xe4KjDg3GLuZ8XRObCQmTU7ZYV5g0i9NfLKgL';

//     const tokenResponse = await axios.post('https://api.prokerala.com/token', {
//       grant_type: 'client_credentials',
//       client_id: clientId,
//       client_secret: clientSecret,
//     });

//     const { token_type, access_token } = tokenResponse.data;

//     const config = {
//       headers: {
//         Authorization: `${token_type} ${access_token}`,
//         'Content-Type': 'application/json',
//       },
//     };

//     const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

//     const horoscopeData = {};

//     for (const sign of zodiacSigns) {
//       const data = await axios.get(
//         `https://api.prokerala.com/v2/horoscope/daily?sign=${sign}&datetime=${currentDate}`,
//         config
//       );

//       // Save horoscope data to MongoDB or handle it as needed
//       // ...

//       horoscopeData[sign] = data.data.data;
//     }

//     res.send({ data: horoscopeData });
//   } catch (error) {
//     console.error('Error fetching and handling horoscope data:', error.message);
//     if (error.response) {
//       console.error('Response status:', error.response.status);
//       console.error('Response data:', error.response.data);
//     }
//     res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
//   }
// };
// module.exports = {
//   dailyHoroscope,
// };