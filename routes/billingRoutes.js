const keys = require("../config/keys");
const stripe = require("stripe")("sk_test_WL0EomqEunqCt0H6D1t16Spn00J5HegIr6");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.post("/api/stripe", (req, res) => {
    app.post("/api/stripe", requireLogin, async (req, res) => {
      const charge = await stripe.charges.create({
        amount: 500,
        currency: "usd",
        description: "$5 for 5 credits",
        source: req.body.id
      });

      req.user.credits += 5;
      const user = await req.user.save();

      res.send(user);
    });
  });
};
