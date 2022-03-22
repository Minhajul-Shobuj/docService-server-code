const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.2qgak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('DocService');
        const doctorsCollection = database.collection('doctors');
        const testCollection = database.collection('tests');
        const docAppoCollection = database.collection('docAppo');
        const testOrdersCollection = database.collection('testOrders');
     
        //get doctors
        app.get('/doctors', async (req, res) => {
            const query = {};
            const cursor = doctorsCollection.find(query);
            const doctors = await cursor.toArray();
            res.json(doctors);
        });
        //get tests
        app.get('/tests', async (req, res) => {
            const query = {};
            const cursor = testCollection.find(query);
            const tests = await cursor.toArray();
            res.json(tests);
        });

//post test order
app.post('/testOrders', async (req, res) => {
    const order = req.body;
    const result = await testOrdersCollection.insertOne(order);
    res.json(result)
});
//post doctors appoinment
app.post('/appoinments', async (req, res) => {
    const order = req.body;
    const result = await docAppoCollection.insertOne(order);
    res.json(result)
});
//get tests Orders
app.get('/testOrders', async (req, res) => {
    const query = {};
    const cursor = testOrdersCollection.find(query);
    const testsOrders = await cursor.toArray();
    res.json(testsOrders);
});
//get appoinment Orders
app.get('/appoinments', async (req, res) => {
    const query = {};
    const cursor = docAppoCollection.find(query);
    const appoinments = await cursor.toArray();
    res.json(appoinments);
});
    }
    finally {
        // await client.close
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('docService server')
});
app.listen(port, (req, res) => {
    console.log(`listening to port ${port}`)
});