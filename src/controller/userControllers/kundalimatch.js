const axios = require('axios');
//const KundaliMatch = require('../../model/userModel/kundaliMatch'); // Replace with the actual path to your model

const OpenCageGeocode = require('opencage-api-client');
const { BoyKundli, GirlKundli, KundaliMatch } = require("../../model/userModel/kundaliMatch");

const createKundliBoysGirls = async (req, res) => {
  const {
    boy_name,
    boys_id,
    boy_gender,
    boy_date_of_birth,
    boy_time_of_birth,
    boy_place,
  } = req.body;
  const {
    girl_name,
    girls_id,
    girl_gender,
    girl_date_of_birth,
    girl_time_of_birth,
    girl_place,
  } = req.body;

  if (
    !boy_name ||
    !boys_id ||
    !boy_gender ||
    !boy_date_of_birth ||
    !boy_time_of_birth ||
    !boy_place ||
    !girl_name ||
    !girls_id ||
    !girl_gender ||
    !girl_date_of_birth ||
    !girl_time_of_birth ||
    !girl_place
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const boy = await BoyKundli.create({
      name: boy_name,
      gender: boy_gender,
      date_of_birth: new Date(boy_date_of_birth),
      time_of_birth: boy_time_of_birth,
      place: boy_place,
    });

    const girl = await GirlKundli.create({
      name: girl_name,
      gender: girl_gender,
      date_of_birth: new Date(girl_date_of_birth),
      time_of_birth: girl_time_of_birth,
      place: girl_place,
    });

    const head = await axios.post("https://api.prokerala.com/token", {
      grant_type: "client_credentials",
      client_id: "ea7f6198-0189-4af5-8031-352b7ce1eb0b",
      client_secret: "8y5xe4KjDg3GLuZ8XRObCQmTU7ZYV5g0i9NfLKgL",
    });

    const headerr = `${head.data.token_type} ${head.data.access_token}`;

    const config = {
      headers: {
        Authorization: headerr,
        "Content-Type": "application/json",
      },
    };

    const ayanamsa = 1;

    const formattedBoyDOB = boy.date_of_birth.toISOString();
    const formattedGirlDOB = girl.date_of_birth.toISOString();

    const data = await axios.get(
      `https://api.prokerala.com/v2/astrology/kundli-matching?ayanamsa=${ayanamsa}&girl_coordinates=${girl.place}&girl_dob=${formattedGirlDOB}&boy_coordinates=${boy.place}&boy_dob=${formattedBoyDOB}`,
      config
    );

    const matchScore = data.data.guna_milan.total_points;

    const match = await KundaliMatch.create({
      boy_id: boys_id,
      girl_id: girls_id,
      match_score: matchScore,
    });

    return res.status(200).json({
      score: matchScore,
      message: data.data.message,
      data: data.data,
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      return res.status(500).json({ error: "No response received from external service" });
    } else {
      return res.status(500).json({ error: "An internal error occurred" });
    }
  }
};

module.exports = {
  createKundliBoysGirls,
};

// const geocodeAddress = async (address) => {
//   try {
//     const response = await OpenCageGeocode.geocode({ q: address });
//     if (response && response.results && response.results.length > 0) {
//       const { lat, lng } = response.results[0].geometry;
//       return `${lat.toFixed(2)},${lng.toFixed(2)}`;
//     } else {
//       console.error(`No results found for the address: ${address}`);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error geocoding address:", error.message);
//     return null;
//   }
// };

// const createKundliBoysGirls = async (req, res) => {
//   const {
//     boy_name,
//     boys_id,
//     boy_gender,
//     boy_date_of_birth,
//     boy_time_of_birth,
//     boy_place,
//   } = req.body;
//   const {
//     girl_name,
//     girls_id,
//     girl_gender,
//     girl_date_of_birth,
//     girl_time_of_birth,
//     girl_place,
//   } = req.body;

//   if (
//     !boy_name ||
//     !boys_id ||
//     !boy_gender ||
//     !boy_date_of_birth ||
//     !boy_time_of_birth ||
//     !boy_place ||
//     !girl_name ||
//     !girls_id ||
//     !girl_gender ||
//     !girl_date_of_birth ||
//     !girl_time_of_birth ||
//     !girl_place
//   ) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const boy = await BoyKundli.create({
//       name: boy_name,
//       gender: boy_gender,
//       date_of_birth: new Date(boy_date_of_birth),
//       time_of_birth: boy_time_of_birth,
//       place: boy_place,
//     });

//     const girl = await GirlKundli.create({
//       name: girl_name,
//       gender: girl_gender,
//       date_of_birth: new Date(girl_date_of_birth),
//       time_of_birth: girl_time_of_birth,
//       place: girl_place,
//     });

//     const boy_coordinates = await geocodeAddress(boy.place);
//     const girl_coordinates = await geocodeAddress(girl.place);

//     if (!boy_coordinates || !girl_coordinates) {
//       return res.status(400).json({ error: "Failed to geocode one or more places" });
//     }

//     const head = await axios.post("https://api.prokerala.com/token", {
//       grant_type: "client_credentials",
//       client_id: "ea7f6198-0189-4af5-8031-352b7ce1eb0b",
//       client_secret: "8y5xe4KjDg3GLuZ8XRObCQmTU7ZYV5g0i9NfLKgL",
//     });

//     const headerr = `${head.data.token_type} ${head.data.access_token}`;

//     const config = {
//       headers: {
//         Authorization: headerr,
//         "Content-Type": "application/json",
//       },
//     };

//     const ayanamsa = 1;

//     const formattedBoyDOB = boy.date_of_birth.toISOString();
//     const formattedGirlDOB = girl.date_of_birth.toISOString();

//     const data = await axios.get(
//       `https://api.prokerala.com/v2/astrology/kundli-matching?ayanamsa=${ayanamsa}&girl_coordinates=${girl_coordinates}&girl_dob=${formattedGirlDOB}&boy_coordinates=${boy_coordinates}&boy_dob=${formattedBoyDOB}`,
//       config
//     );

//     const matchScore = data.data && data.data.guna_milan ? data.data.guna_milan.total_points : null;

//     if (matchScore !== null) {
//       const match = await KundaliMatch.create({
//         boy_id: boys_id,
//         girl_id: girls_id,
//         match_score: matchScore,
//       });

//       return res.status(200).json({
//         score: matchScore,
//         message: data.data.message,
//         data: data.data,
//       });
//     } else {
//       console.error("total_points property not found in the API response");
//       return res.status(500).json({ error: "Unexpected response from ProKerala API" });
//     }
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       return res.status(error.response.status).json({ error: error.response.data });
//     } else if (error.request) {
//       return res.status(500).json({ error: "No response received from external service" });
//     } else {
//       return res.status(500).json({ error: "An internal error occurred" });
//     }
//   }
// };

// module.exports = {
//   createKundliBoysGirls,
// };
