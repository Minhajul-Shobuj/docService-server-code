const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.2qgak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('DocService');
        const userCollection=database.collection('users');
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

               //post user
               app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await userCollection.insertOne(user);
                res.json(result);
            });
    
            //get user data
            app.get('/users', async (req, res) => {
                const query = {};
                const cursor = userCollection.find(query);
                const users = await cursor.toArray();
                res.json(users);
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
app.get('/appoinments/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await docAppoCollection.find(query).toArray();
    res.json(result);
});
app.get('/testOrders/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await testOrdersCollection.find(query).toArray();
    res.json(result);
});
//delete orders
app.delete('/deleteOrder/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await testOrdersCollection.deleteOne(query);
    res.json(result);
})
app.delete('/deleteOrder/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await docAppoCollection.deleteOne(query);
    res.json(result);
})
//admin
app.get('/users/:email', async (req, res) => {
    const userEmail = req.params.email
    const query = { email: userEmail }
    const result = await userCollection.findOne(query)
    let isAdmin = false;
    if (result?.role == "admin") {
        isAdmin = true
    }
    res.json({ admin: isAdmin })

})

    }
    finally {
        // await client.close
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('docService server is running')
});
app.listen(port, (req, res) => {
    console.log(`listening to port ${port}`)
});