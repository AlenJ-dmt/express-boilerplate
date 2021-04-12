const express = require("express");
require("dotenv").config();
const path = require("path");
const WheelService = require("./wheel-service");
const xss = require("xss");

const wheelRouter = express.Router();
const jsonParser = express.json();

const serializedWheel = (wheel) => ({
  id: wheel.id,
  invoice: xss(wheel.invoice),
  salesperson: xss(wheel.salesperson),
  quantity: xss(wheel.quantity),
  description: xss(wheel.descriptions),
  created: wheel.created,
  eta: wheel.eta,
  phone: wheel.phone,
  isready: wheel.isready,
  completedby: wheel.completedby
});

wheelRouter.route("/isready").post(jsonParser, (req, res, next) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = require("twilio")(accountSid, authToken);

  console.log(req.body);

  const { number, textMessage } = req.body;

  client.messages
    .create({
      body: textMessage,
      from: "+12816998939",
      to: number,
    })
    .then((message) => console.log(message))
    .catch((err) => {
      console.log(err);
    });
  next();
});

wheelRouter.route("/all").get((req, res, next) => {
  TiresService.getAllTires(req.app.get("db"))
    .then((tires) => {
      res.json(tires.map(serializedTire));
    })
    .catch(next);
});

wheelRouter.route("/search").get((req, res, next) => {
  const { invoice } = req.query;

  if (invoice) {
    WheelService.getByInvoiceNum(req.app.get("db"), invoice)
      .then((wRepair) => {
        res.json(wRepair.map(serializedWheel));
      })
      .catch(next);
  } else {
    res.send("Missing argument");
    next();
  }
});

wheelRouter.route("/searchByDate").get((req, res, next) => {
  const { pickedDate } = req.query;

  if (pickedDate) {
    WheelService.getByDate(req.app.get("db"), pickedDate)
      .then((wRepair) => {
        res.json(wRepair.map(serializedWheel));
      })
      .catch(next);
  } else {
    res.send("Missing argument");
    next();
  }
});

wheelRouter.route("/addwr").post(jsonParser, (req, res, next) => {
  const {
    salesperson,
    invoice,
    quantity,
    descriptions,
    eta,
    phone,
    isready,
    created,
    completedby
  } = req.body;
  const newRepair = {
    salesperson,
    invoice,
    quantity,
    descriptions,
    eta,
    phone,
    isready,
    created,
    completedby
  };

  for (const [key, value] of Object.entries(newRepair))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  WheelService.insertRepair(req.app.get("db"), newRepair)
    .then((repair) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${repair.id}`))
        .json(serializedWheel(repair));
    })
    .catch(next);
});

module.exports = wheelRouter;
