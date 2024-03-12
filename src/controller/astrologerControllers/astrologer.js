const Astrologer = require('../../model/astrologerModel/acharyaModel');
const User = require('../../model/userModel/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.createOrLoginAstrologer = async (req, res) => {
  try {
      const { name, email, phone, password, astrologerType, gender, bio, experience } = req.body;

      // Check if the astrologer already exists
      const existingAstrologer = await Astrologer.findOne({ email });
      if (existingAstrologer) {
          return res.status(409).json({ error: 'Astrologer already exists. Please proceed to login.' });
      }

      // Create a new astrologer instance
      const astrologer = new Astrologer({
          name,
          email,
          phone,
          password,
          astrologerType,
          gender,
          bio,
          experience
      });

      await astrologer.save();
      res.status(201).json({ message: 'Astrologer created successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

   // Controller for getting all astrologers
   exports.getAllAstrologers = async (req, res) => {
    try {
        const astrologers = await Astrologer.find();
        res.status(200).json(astrologers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

   //--------------------------- Controller for getting a single astrologer by ID-------------------------------//
  
// Controller for getting an astrologer by name
exports.getAstrologerByName = async (req, res) => {
    const astrologerName = req.params.name;

    try {
        // Find the astrologer by name
        const astrologer = await Astrologer.findOne({ name: astrologerName });
        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer not found' });
        }

        res.status(200).json(astrologer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  exports.followAstrologer = async (req, res) => {
    const { astrologerId } = req.params;
    const { userId } = req.body;
  
    try {
      // Find the astrologer by ID
      const astrologer = await Astrologer.findById(astrologerId);
      if (!astrologer) {
        return res.status(404).json({ message: 'Astrologer not found' });
      }
  
      // Check if the user is already following the astrologer
      if (astrologer.followers.includes(userId)) {
        return res.status(400).json({ message: 'User is already following this astrologer' });
      }
  
      // Add the user to the list of followers
      astrologer.followers.push(userId);
      await astrologer.save();
  
      res.status(200).json({ message: 'User is now following the astrologer' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
  // Controller for updating an astrologer by ID
  exports.updateAstrologerById = async (req, res) => {
    try {
      const astrologer = await Astrologer.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!astrologer) {
        return res.status(404).json({ message: 'Astrologer not found' });
      }
      res.status(200).json(astrologer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller for deleting an astrologer by ID
  exports.deleteAstrologerById = async (req, res) => {
    try {
      const astrologer = await Astrologer.findByIdAndDelete(req.params.id);
      if (!astrologer) {
        return res.status(404).json({ message: 'Astrologer not found' });
      }
      res.status(200).json({ message: 'Astrologer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controller for connecting a user to an astrologer
  // exports.connectUserToAstrologer = async (req, res) => {
  //   try {
  //     const { astrologerId, userId } = req.body;
  
  //     // Find the astrologer by ID
  //     const astrologer = await Astrologer.findById(astrologerId);
  //     if (!astrologer) {
  //       return res.status(404).json({ message: 'Astrologer not found' });
  //     }
  
  //     // Find the user by ID
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     // Check if the user is already connected to the astrologer
  //     if (astrologer.connectedUsers.includes(userId)) {
  //       return res.status(400).json({ message: 'User is already connected to the astrologer' });
  //     }
  
  //     // Connect the user to the astrologer
  //     astrologer.connectedUsers.push(userId);
  //     await astrologer.save();
  
  //     res.status(200).json({ message: 'User connected to astrologer successfully' });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  exports.connectUserToAstrologer = async (req, res) => {
    try {
        const { astrologerId, userId } = req.body;

        // Find the astrologer by ID
        const astrologer = await Astrologer.findById(astrologerId);
        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already connected to the astrologer
        if (astrologer.connectedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User is already connected to this astrologer' });
        }

        // Connect the user to the astrologer
        astrologer.connectedUsers.push(userId);
        await astrologer.save();

        res.status(200).json({ message: 'User connected to astrologer successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
  // Controller for astrologer login
  // exports. login= async (req, res) => {
  //   const { email, password } = req.body;
  
  //   try {
  //     // Check if the astrologer exists
  //     const astrologer = await Astrologer.findOne({ email });
  //     if (!astrologer) {
  //       return res.status(401).json({ message: 'Invalid email or password' });
  //     }
  
  //     // Compare passwords
  //     const isPasswordValid = await bcrypt.compare(password, astrologer.password);
  //     if (!isPasswordValid) {
  //       return res.status(401).json({ message: 'Invalid email or password' });
  //     }
  
  //     // Generate JWT token
  //     const token = jwt.sign({ id: astrologer._id, email: astrologer.email }, 'your_secret_key', { expiresIn: '1h' });
  
  //     res.status(200).json({ token });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };


  exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the astrologer exists
        const astrologer = await Astrologer.findOne({ email });
        if (!astrologer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, astrologer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update online status to true
        astrologer.online = true;
        await astrologer.save();

        // Generate Access Token with expiration of 30 days
        const accessToken = jwt.sign({ id: astrologer._id, email: astrologer.email }, 'your_access_secret_key', { expiresIn: '30d' });

        // Generate Refresh Token with expiration of 60 days
        const refreshToken = jwt.sign({ id: astrologer._id }, 'your_refresh_secret_key', { expiresIn: '10s' });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the astrologer by email
        const astrologer = await Astrologer.findOne({ email });
        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer not found' });
        }

        // Update online status to false
        astrologer.online = false;
        await astrologer.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
