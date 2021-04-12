const accountSid = "AC8f3a24d4b31abb819e428871dec42422";
const authToken = "7a6631018adf9b5f6db4fd16d74c92ad";
const client = require("twilio")(accountSid, authToken);


console.log("oing")

client.messages
  .create({
    body: "this is a TEst",
    from: "+12816998939",
    to: "+17135321900",
  })
  .then((message) => console.log(message.sid));
