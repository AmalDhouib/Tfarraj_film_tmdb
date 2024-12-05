const userModel = require("./userModel");

const createUserDBService = async (userDetails) => {
  try {
    const userModelData = new userModel();
    userModelData.email = userDetails.email; // Store only the email

    // Save the user to the database using async/await
    await userModelData.save();
    console.log("Database Save Success:", userModelData);
    return true;
  } catch (error) {
    console.error("Database Save Error:", error);
    return false;
  }
};

module.exports = { createUserDBService };
