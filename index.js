const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvnsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
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

        const addCraftCollection = client.db('craftDB').collection('craftCat')

        app.get('/addcraft', async (req, res) => {
            const cursor = addCraftCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/addcraft', async (req, res) => {
            const addNewCat = req.body
            console.log(addNewCat)
            const result = await addCraftCollection.insertOne(addNewCat)
            res.send(result)
        })


        //mycardlist get

        app.get('/myCart/:email', async (req, res) => {

            const result = await addCraftCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })
        // app.patch('/addcraft', async (req, res) => {
        //     const user = req.body

        //     const filter = { email: user.email }
        //     const result = await addCraftCollection.find({ filter: filter })
        //     res.send(result)
        // })
        //delete
        // app.get('/addcraft/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await addCraftCollection.deleteOne(query)
        //     res.send(result)
        // })

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
    res.send('Wooden Art & Craft Server')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})