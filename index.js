const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.nameOfUser}:${process.env.password}@inforsix.99t7qbt.mongodb.net/?appName=Inforsix`;

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


    const database = client.db("InforsixLimited");
    const serviceCollection = database.collection("services");

    // CRUD operations for Services 
    // Add services
    app.post("/services", async(req, res)=>{
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.json(result);
    });

    // Read Services
    app.get("/services", async(req, res) =>{
        const result = await serviceCollection.find().toArray();
        res.send(result);
    })

    // Delete Services
    app.delete("/services/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {
            _id : new ObjectId(id),
        }
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
    })

    // Update Services
    app.put("/services/:id", async(req, res)=>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert:true}
        console.log(data);
        const updateService = {
            $set:{
                name : data.name,
                lottieURL: data.lottieURL,
                details: data.details
            }
        };
        const result = await serviceCollection.updateOne(
            filter,
            updateService,
            options
        )
    })






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});