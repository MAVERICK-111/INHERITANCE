const welcomeMessage = (req, res) => {
    res.json({ message: "Welcome to the SocialApp API" });
  };
  
  module.exports = { welcomeMessage };  