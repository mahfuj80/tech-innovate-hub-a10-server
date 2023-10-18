const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
// 5V9Ey5UwHDG5an2h
// mahfujurrahman06627
const uri =
  'mongodb+srv://mahfujurrahman06627:5V9Ey5UwHDG5an2h@cluster0.qxr8hrc.mongodb.net/?retryWrites=true&w=majority';

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
    await client.connect();

    // databases
    const brandsCollection = client.db('brandDB').collection('brands');
    const bannersCollection = client.db('brandDB').collection('banners');
    const productsCollection = client.db('brandDB').collection('products');
    // get brands Name and Image
    app.get('/brands', async (req, res) => {
      const brands = await brandsCollection.find().toArray();
      res.send(brands);
    });

    // Get Brands Banners
    app.get('/banners', async (req, res) => {
      const brands = await bannersCollection.find().toArray();
      res.send(brands);
    });

    // Create A single Data To database
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Crud is running.....');
  res.send();
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
