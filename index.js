require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikrarq7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const roommatesCollection = client.db('roommatesBD').collection('roommates');
    const userCollection = client.db('roommatesBD').collection('users');
    // For Home Page - 6 available roommates
    app.get('/roommates/limited', async (req, res) => {
      const result = await roommatesCollection
        .find({ availability: 'available' })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // For BrowserListing - All roommates
    app.get('/roommates', async (req, res) => {
      const result = await roommatesCollection.find().toArray();
      res.send(result);
    });
    //delet

    // For Roommate Details - Single roommate by ID
    app.get('/roommates/:id', async (req, res) => {
      const id = req.params.id;
      const result = await roommatesCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Post method
    app.post('/roommates', async (req, res) => {
      const newRoommate = req.body;
      console.log(newRoommate);
      const result = await roommatesCollection.insertOne(newRoommate);
      res.send(result);
    });    
    //delete api
    app.delete('/roommates/:id',async (req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await roommatesCollection.deleteOne(query)
      res.send(result)
    })
    //update api 
    app.put('/roommates/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const option={upsert:true}
      const updatedMate=req.body
      const updatedDoc={
        $set:updatedMate
      }
      const result=await roommatesCollection.updateOne(filter,updatedDoc,option)
      res.send(result)
    })

    //get all users
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users', async (req, res) => {
      const { email, ...updates } = req.body;
    
      if (!email) {
        return res.status(400).json({ message: 'Email is required to update user.' });
      }
    
      const filter = { email: email };
      const updateDoc = {
        $set: updates
      };
    
      try {
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
      }
    });
    //post user

    app.post('/users', async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await userCollection.insertOne(userProfile);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});