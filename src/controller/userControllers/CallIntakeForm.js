const Call = require('../../model/userModel/CallIntakeForm');


//Create a new call
const createCall = async (req, res) => {
  try {
    const call = new Call(req.body);
    await call.save();
    res.status(201).send(call);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all calls
const getAllCalls = async (req, res) => {
  try {
    const calls = await Call.find();
    res.send(calls);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get call by ID
const getCallById = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) {
      return res.status(404).send();
    }
    res.send(call);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports={
  createCall,
  getAllCalls,
  getCallById
}
