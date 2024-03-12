const LoginHours = require('../../model/astrologerModel/loginhour');
const Astrologer = require('../../model/astrologerModel/loginhour'); // Adjust this line based on your actual Astrologer model file path

// Insert login hours
exports.insertLoginHours = (req, res) => {
  const { astrologerId, fromDate, endDate } = req.body;

  const loginHours = new LoginHours({
    astrologer: astrologerId,
    fromDate: fromDate,
    endDate: endDate
  });

  loginHours.save()
    .then(() => {
      res.json({ message: 'Login hours inserted successfully' });
    })
    .catch(error => {
      console.error('Error inserting login hours:', error);
      res.status(500).json({ error: 'Failed to insert login hours' });
    });
};

// Get total active hours for each astrologer
exports.getTotalActiveHours = (req, res) => {
  LoginHours.aggregate([
    {
      $group: {
        _id: '$astrologer',
        totalHours: { $sum: { $subtract: ['$endDate', '$fromDate'] } }
      }
    }
  ])
  .then(result => {
    // Populate astrologer details
    return Astrologer.populate(result, { path: '_id', select: 'name email' });
  })
  .then(populatedResult => {
    res.json({ totalActiveHours: populatedResult });
  })
  .catch(error => {
    console.error('Error calculating total active hours:', error);
    res.status(500).json({ error: 'Failed to calculate total active hours' });
  });
};

// Get summary of login hours for each astrologer
exports.getSummaryLoginHours = (req, res) => {
  LoginHours.aggregate([
    {
      $group: {
        _id: '$astrologer',
        totalHours: { $sum: { $subtract: ['$endDate', '$fromDate'] } }
      }
    },
    {
      $project: {
        astrologer: '$_id',
        totalHours: 1,
        _id: 0
      }
    }
  ])
  .then(result => {
    // Populate astrologer details
    return Astrologer.populate(result, { path: 'astrologer', select: 'name email' });
  })
  .then(populatedResult => {
    res.json({ summary: populatedResult });
  })
  .catch(error => {
    console.error('Error getting summary of login hours:', error);
    res.status(500).json({ error: 'Failed to get summary of login hours' });
  });
};
