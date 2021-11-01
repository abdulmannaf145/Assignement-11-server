const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oukh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oukh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // Database make
    const database = client.db("TourDetails");
    // Collection
    const servicesDataCollection = database.collection("services");
    const usersDataCollection = database.collection("users");
    const usersServicesDataCollection = database.collection("usersServices");
    const bookingDataCollection = database.collection("booking");
    // creating  API
    app.get("/services", async (req, res) => {
      const cursor = servicesDataCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // creating single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesDataCollection.findOne(query);
      res.json(service);
    });
    // send service 
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesDataCollection.insertOne(service);
      console.log("hit the post api", service, result);
      res.json(result);
    });
    // service delete
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesDataCollection.deleteOne(query);
      res.json(result);
    });
    // creating  API
    app.get("/booking", async (req, res) => {
      const cursor = bookingDataCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // creating single service
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await bookingDataCollection.findOne(query);
      res.json(service);
    });
    // send service 
    app.post("/booking", async (req, res) => {
      const service = req.body;
      const result = await bookingDataCollection.insertOne(service);
      console.log("hit the post api", service, result);
      res.json(result);
    });
    // service delete
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingDataCollection.deleteOne(query);
      res.json(result);
    });
    // user add
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersDataCollection.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
    // creating user 
    app.get("/users", async (req, res) => {
      const cursor = usersDataCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // Getting Single Users
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersDataCollection.findOne(query);
      // console.log('load user with id: ', id);
      res.send(user);
    });
    // Users Delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersDataCollection.deleteOne(query);
      console.log("deleting user with id ", result);
      res.json(result);
    });
    // Users Update
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersDataCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
    });
    // Getting  User Services
    app.get("/usersServices", async (req, res) => {
      const cursor = usersServicesDataCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // create User Services
    app.post("/usersServices", async (req, res) => {
      const newUserService = req.body;
      const result = await usersServicesDataCollection.insertOne(newUserService);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
    // User Services  Delete
    app.delete("/usersServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersServicesDataCollection.deleteOne(query);
      console.log("deleting user Service with id ", result);
      res.json(result);
      //Users Update 
      app.put("/usersServices/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: updatedUser.name,
            email: updatedUser.email,
          },
        };
        const result = await usersServicesDataCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        console.log("updating", id);
        res.json(result);
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("All Are ");
});

app.listen(port, () => {
  console.log("listening on port", port);
});