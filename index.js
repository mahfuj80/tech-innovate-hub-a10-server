const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const cartCollection = client.db('brandDB').collection('cart');

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

    // Create A single Data To products dataset
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // Create A single Product to cart datasets
    app.post('/cart', async (req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    });

    // Get all Cart Products form database
    app.get('/cart', async (req, res) => {
      const cartProducts = await cartCollection.find().toArray();
      res.send(cartProducts);
    });

    // Get products by brand name

    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = {
        brandName: brand,
      };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // get single Product using _id

    app.get('/update-products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // update single Product

    app.put('/update-products/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: data.name,
          description: data.description,
          image: data.image,
          brandName: data.brandName,
          type: data.type,
          price: data.price,
          rating: data.rating,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        updatedData,
        options
      );

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
