const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");

    const carCollection = client.db("carsDB").collection("cars");

    app.get("/cars", async (req, res) => {
      const findData = carCollection.find();
      const convertToArray = await findData.toArray();
      res.send(convertToArray);
    });

    app.get("/car/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      const findResult = await carCollection.findOne(query);
      res.send(findResult);
    });

    app.get("/my-cars", async (req, res) => {
      const { email, sortType } = req.query;
      const query = { "userDetails.email": email };
      let sorted = {};
      if (sortType == "Date Added: Newest First") {
        sorted = { dateAdded: -1 };
      }
      if (sortType == "Date Added: Oldest First") {
        sorted = { dateAdded: 1 };
      }
      if (sortType == "Price: Lowest First") {
        sorted = { price: 1 };
      }
      if (sortType == "Price: Highest First") {
        sorted = { price: -1 };
      }

      const findData = carCollection.find(query).sort(sorted);
      const convertToArray = await findData.toArray();
      res.send(convertToArray);
    });

    app.get("/available-cars", async (req, res) => {
     const {sortType, search} = req.query;
     let searchTerm = {};

    //  if(search === "")

      let sorted = {};
      if (sortType == "Date Added: Newest First") {
        sorted = { dateAdded: -1 };
      }
      if (sortType == "Date Added: Oldest First") {
        sorted = { dateAdded: 1 };
      }
      if (sortType == "Price: Lowest First") {
        sorted = { price: 1 };
      }
      if (sortType == "Price: Highest First") {
        sorted = { price: -1 };
      }

      const findData = carCollection.find().sort(sorted);
      const convertToArray = await findData.toArray();
      res.send(convertToArray);
    });

    app.post("/cars", async (req, res) => {
      const carsData = req.body;
      // console.log(carsData);

      const insertResult = await carCollection.insertOne(carsData);
      res.send(insertResult);
    });

    app.patch("/update-car/:id", async (req, res) => {
      const carInfo = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updateInfo = {
        $set: {
          model: carInfo?.model,
          price: carInfo?.price,
          availability: carInfo?.availability,
          registrationNumber: carInfo?.registrationNumber,
          features: carInfo?.features,
          description: carInfo?.description,
          image: carInfo?.image,
          location: carInfo?.location,
        },
      };

      const updateResult = await carCollection.updateOne(query, updateInfo);

      res.send(updateResult);
    });

    app.delete("/delete-car/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      const deleteResult = await carCollection.deleteOne(query);
      res.send(deleteResult);
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
