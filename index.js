const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())
// e64shzhwHUcOVZWO
// Chocolate-Management

// Mongodb code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9irx2a.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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
        const chocolateCollection = client.db('ChocolateDB').collection('Chocolate')

        // get data or read
        app.get('/chocolates', async (req, res) => {
            const cursor = chocolateCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // loaded single data
        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(query)
            res.send(result)
        })
        // create data
        app.post('/chocolates', async (req, res) => {
            const newChocolate = req.body;
            const result = await chocolateCollection.insertOne(newChocolate)
            res.send(result)
        })
        // update data
        app.put('/chocolates/:id', async (req, res) => {
            const id = req.params.id
            const updatedChocolate = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const chocolate = {
                $set: {
                    name: updatedChocolate.name,
                    country: updatedChocolate.country,
                    category: updatedChocolate.category,
                    photo: updatedChocolate.photo
                }
            }
            const result = await chocolateCollection.updateOne(filter, chocolate, options)
            res.send(result)

        })
        // delete data
        app.delete('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Chocolate management is running")
})
app.listen(port, () => {
    console.log('chocolate management is running on the port', port);
})