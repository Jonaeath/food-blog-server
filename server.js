const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const port = process.env.PORT || 4000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.pg0dj0q.mongodb.net/?retryWrites=true&w=majority`;

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
    const foodsCollection = client.db("foodBlog").collection("foodItems");

    // Food Item related apis
    app.get('/foods', async (req, res) => {
        const result = await foodsCollection.find().toArray();
        res.send(result);
      });

    
  } finally {
    
  }
}
run().catch(console.dir);



app.get("/", async (req, res) => {
    res.send("Food server is running");
  });

app.listen(port, () => console.log(`Food Server running on ${port}`));
 