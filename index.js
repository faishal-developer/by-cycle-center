const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000
const fileUpload = require('express-fileupload')

//middleWares
app.use(cors())
app.use(express.json())
app.use(fileUpload())

console.log(process.env.DB_PASS, process.env.DB_USER);
const uri = `mongodb+srv://ass12:iwl4SabFlkpnMve0@cluster0.yaqej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("by_cycle_center");
        const cycles = database.collection("by_cycles");
        const reviews = database.collection("reviews");
        const users = database.collection("users");
        const orders = database.collection("orders");

        app.get("/bycycles", async (req, res) => {
            const cursor = cycles.find({});
            const result = await cursor.toArray()
            res.json(result);
        })
        app.post("/bycycles", async (req, res) => {
            const product = req.body;
            const image = req.files.image;
            const imageData = image.data;
            const encodePic = imageData.toString('base64')
            const imageBuffer = Buffer.from(encodePic, 'base64')
            product.image = imageBuffer;
            const result = await cycles.insertOne(product)
            res.json(result);
        })
        app.get("/orders", async (req, res) => {
            const cursor = orders.find({});
            const result = await cursor.toArray()
            res.json(result);
        })
        app.delete("/orders", async (req, res) => {
            let id = req.body.id
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            res.json(result)
        })
        app.post("/getOrders", async (req, res) => {
            const email = req.body.email
            const query = { email }
            const cursor = orders.find(query);
            const result = await cursor.toArray()
            res.json(result);
        })
        app.get("/bycycles/:productId", async (req, res) => {
            const cycleId = ObjectId(req.params.productId);
            const query = { _id: cycleId };
            const result = await cycles.findOne(query);
            res.json(result)
        })
        app.get("/reviews", async (req, res) => {
            const cursor = reviews.find({});
            const result = await cursor.toArray()
            res.json(result);
        })
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviews.insertOne(review)
            res.json(result);
        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await users.insertOne(user);
            res.json(result);
        })
        app.put("/users", async (req, res) => {
            const email = req.body.email;
            console.log(email, 'working');
            const filter = { email };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };

            const result = await users.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        app.put("/orders", async (req, res) => {
            const id = req.body.id
            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: 'shipted'
                },
            };
            const result = await orders.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await users.findOne(query);
            res.json(result);
        })
        app.post("/orders", async (req, res) => {
            const orderedByUser = req.body;
            const result = await orders.insertOne(orderedByUser);
            res.json(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening`)
})