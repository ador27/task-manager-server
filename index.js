const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u0mhcvk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("task-manager").collection("tasks");


        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            console.log('adding new task', newTask);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
    }

    finally {

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Task Manager Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});

