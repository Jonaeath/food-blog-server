const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
  },
});

async function run() {
  try {
    const foodsCollection = client.db("foodBlog").collection("foodItems");
    const userCollection = client.db("foodBlog").collection("users");
    const reviewCollection = client.db("foodBlog").collection("review");
    const cartCollection = client.db("foodBlog").collection("carts");

    // Users Related API
    app.post("/users", async(req,res)=>{
      const user = req.body;
               //Code for googleSignIn
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser) {
       return res.send({message: "user already exists"})
      }
                //-----End-------//
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    //  Display all users on dashboard
    app.get("/users", async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    // Admin role
    app.patch('/users/admin/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // Food Item related apis
    app.get("/foods", async (req, res) => {
      const result = await foodsCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

  // cart collection
  app.post("/carts", async(req,res)=>{
    const item = req.body;
    // console.log(item);
    const result = await cartCollection.insertOne(item);
    res.send(result);
  })

  app.get('/carts', async(req,res) =>{
    const email = req.query.email;
    if(!email){
      res.send([]);
    }
    const query = {email: email};
    const result = await cartCollection.find(query).toArray();
    res.send(result);
  })

  app.delete('/carts/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await cartCollection.deleteOne(query);
    res.send(result);
  })
  
  } finally {

  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Food server is running");
});

app.listen(port, () => console.log(`Food Server running on ${port}`));
