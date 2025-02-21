const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_SEAVENTURE}:${process.env.SECRET_KEY}@cluster0.oapnwos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const touristSpotCollection = client
      .db("SEAventureDb")
      .collection("touristSpots");
    const defaultSpotCollection = client
      .db("SEAventureDb")
      .collection("defaultSpots");

    app.get("/touristSpots", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for heme default

    app.get("/defultTouristSpots", async (req, res) => {
      const cursor = defaultSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for view details page

    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.post("/touristSpots", async (req, res) => {
      const newToutistSpot = req.body;
      console.log(newToutistSpot);
      const result = await touristSpotCollection.insertOne(newToutistSpot);
      res.send(result);
    });

    // update
    app.put("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body
      console.log('vfk')
      const spot = {
        $set: {
          image: updatedSpot.image,
          tourists_spot_name: updatedSpot.tourists_spot_name,
          country_name: updatedSpot.country_name,
          location: updatedSpot.location,
          short_description: updatedSpot.short_description,
          average_cost: updatedSpot.average_cost,
          seasonality: updatedSpot.seasonality,
          travel_time: updatedSpot.travel_time,
          total_visitors_per_year: updatedSpot.total_visitors_per_year,
        },
      };
      const result = await  touristSpotCollection.updateOne(filter, spot, options)
      res.send(result)
     
    });

    // delete operation

    app.delete("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("sea adventure is running");
});

app.listen(port, () => {
  console.log(`sea adventure server is running on port: ${port}`);
});
