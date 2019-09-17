const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123456",
    database: "work-list"
  }
});
db.select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 3001, () => {
  console.log("app is running on port 3001");
});

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then(user => {
      res.json(user);
    })
    .catch(err => res.status(400).json("unable to get users"));
});

app.post("/", (req, res) => {
  const { name, tel, operation, payment, barber, para, date } = req.body;
  if (
    !tel ||
    name.length < 3 ||
    !operation ||
    tel.length < 11 ||
    payment === "ödeme yöntemi" ||
    !payment ||
    !barber ||
    barber === "kuaför"
  ) {
    return res.status(402).json("incorrect from submission");
  }
  db("users")
    .returning("*")
    .insert({
      name: name,
      tel: tel,
      operation: operation,
      payment: payment,
      barber: barber,
      para: para,
      date: date
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to register"));
});
app.delete("/:id", (req, res) => {
  db.select("*")
    .from("users")
    .where({ id: req.params.id })
    .del()
    .then(user => {
      res.json(user);
    })
    .catch(err => res.status(400).json("unable to get users"));
});
