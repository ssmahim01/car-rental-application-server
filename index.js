const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ybs8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");

    const carCollection = client.db("carsDB").collection("cars");

    app.get("/cars", async(req, res) => {
      const findData = carCollection.find();
      const convertToArray = await findData.toArray();
      res.send(convertToArray);
    });

    app.post("/cars", async(req, res) => {
      const carsData = req.body;
      // console.log(carsData);

      const insertResult = await carCollection.insertOne(carsData);
      res.send(insertResult);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car rental server is running...");
});

app.listen(port, () => {
  console.log(`The Car rental server is running on Port: ${port}`);
});