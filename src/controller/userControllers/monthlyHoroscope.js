const axios = require('axios');


const getMonthlyHoroscope = async (req, res) => {
  try {
    const sign = 'aries'; // Replace with the desired zodiac sign
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const clientId = 'ea7f6198-0189-4af5-8031-352b7ce1eb0b';
    const clientSecret = '8y5xe4KjDg3GLuZ8XRObCQmTU7ZYV5g0i9NfLKgL';

    const head = await axios.post('https://api.prokerala.com/token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const headerr = `${head.token_type} ${head.access_token}`;

    const config = {
      headers: {
        Authorization: headerr,
        'Content-Type': 'application/json',
      },
    };

    const data = await axios.get(
      `https://api.prokerala.com/v2/horoscope/monthly?sign=${sign}&start_date=${firstDayOfMonth.toISOString()}&end_date=${lastDayOfMonth.toISOString()}`,
      config
    );

    // Save monthly horoscope data to MongoDB or handle it as needed
    // ...

    res.send({ data: data.data.data });
  } catch (error) {
    console.error('Error fetching and handling monthly horoscope:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getMonthlyHoroscope,
};
