// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const createApiRouter = require('./routes/api');

const app = express();
const PORT = 3000; // backend will run on http://localhost:3000

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("Request URL:", req.url);
    console.log("Method:", req.method);
    console.log("Time:", new Date());
    next();
});

// 1) MongoDB connection
const uri = 'mongodb+srv://LavishaB:87iJp5I4ZRz2Uvr8@cluster0.xcknfis.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);



async function startServer() {
  try {
    // connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    // name of the database and collection you created in Atlas
    const db = client.db("afterSchoolLessons");
    const lessonsCollection = db.collection("lessons");
    const ordersCollection = db.collection("orders");

    // use the router, give it our db
    const apiRouter = createApiRouter(db);
    app.use('/api', apiRouter);

    // -- Routes --

    GET lessons
    app.get("/lessons", async (req, res) => {
        const lessons = await lessonsCollection.find({}).toArray(); // get all documents in lessons
        res.json(lessons);
    })

    //POST an order 
    app.post("/order", async (req, res) => {
        const order = req.body; // order data send from frontend
        await ordersCollection.insertOne(order); // send that order into order Collection
        res.json({ message: "Order saved!", order}); // responds
    })

    //PUT - updates dataBase Spaces
    app.put("/lesson/:id/decrease", async (req, res) => {
        const id = req.params.id;
        await lessonsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { space: -1} } //decreases spaces field by 1 
        );
        res.json({ message: "Spaces decreased"});
    });

    //PUT - removes a lesson from cart or cancels order
    app.put("/lesson/:id/increase", async (req, res) => {
        const id = req.params.id;
        await lessonsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { space: 1} } // spaces increased by 1
        );
        res.json({ message: "Spaces increades"});
    })

    //Start server
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

startServer();
