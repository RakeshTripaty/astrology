const Booking = require('../../model/userModel/BookPooja');
const schedule = require('node-schedule');
const User = require('../../model/userModel/userModel');
// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get bookings for a specific month
exports.getBookingsByMonth = async (req, res) => {
  const { month } = req.params;
  try {
    const bookings = await Booking.find({ month });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get distinct pooja names
exports.searchBookingsByPuja = async (req, res) => {
  const { pujaname } = req.params; // Retrieve the puja name from the route parameters
  try {
    const bookings = await Booking.find({ pooja: { $regex: new RegExp(pujaname, 'i') } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/// Search bookings by Acharya name
exports.searchBookingsByAcharya = async (req, res) => {
  const { Name } = req.params;
  try {
    const bookings = await Booking.find({ acharya: { $regex: new RegExp(Name, 'i') } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  


exports.bookNewPuja=async (req, res) => {
  try {
    const userId = req.body.user; // Assuming you have a valid user ID in the request body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { date, time, location, state, city, pinCode, acharya, pooja, bookingType } = req.body;

    const newBooking = new Booking({
      user: userId, // Associate the user ID with the booking
      date,
      time,
      location,
      state,
      city,
      pinCode,
      acharya,
      pooja,
      bookingType,
    });

    await newBooking.save();

    // Set a reminder one day before the puja date (only for offline bookings)
    if (bookingType === 'Offline') {
      const reminderDate = new Date(newBooking.date);
      reminderDate.setDate(reminderDate.getDate() - 1);

      const reminderJob = schedule.scheduleJob(reminderDate, function () {
        console.log(`Reminder: Your offline puja with ${acharya} is tomorrow at ${newBooking.time}!`);
        // You can customize this part to send notifications or emails to users
      });
    }

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

