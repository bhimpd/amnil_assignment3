const express = require("express");
const app = express();
const port = 5005;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load the product file
const fs = require("fs");
const productFilePath = "./products.json";

// Once loaded, read the product file
function getProducts() {
  const productData = fs.readFileSync(productFilePath);
  return JSON.parse(productData);
}

//then write the product data...
function updateProducts(products) {
  fs.writeFileSync(productFilePath, JSON.stringify(products, null, 2));
}

// Performing CRUD OPERATION for the products

//creating the product details and adding to json file...
app.post("/products", (req, res) => {
  console.log(req.body);
  const { id, name, price, quantity, product_type } = req.body;
  if (!id || !name || !price || !quantity || !product_type) {
    return res.status(400).json({ error: "Please fill all the details..." });
  }
  const products = getProducts();
  const newProduct = { id, name, price, quantity, product_type };
  products.push(newProduct);
  updateProducts(products);
  return res.status(200).json({ success: "Product added successfully..." });
});

//reading the products details
app.get("/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// Reading individual product details
app.get("/products/:id", (req, res) => {
  const products = getProducts();
  const productId = parseInt(req.params.id);

  // Use find() to search for the product by id
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res
      .status(404)
      .json({ error: `Product id no ${productId} not found...` });
  }

  res.json(product);
});

// updating the products details by specific id
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, quantity, product_type } = req.body;
  if (!name || !price || !quantity || !product_type) {
    return res
      .status(400)
      .json({ error: "Please fill the missing details..." });
  }
  const products = getProducts();
  const product = products.find((product) => product.id === productId);
  if (!product) {
    return res
      .status(404)
      .json({ error: `Product id no ${productId} not found...` });
  }

  product.name = name;
  product.price = price;
  product.quantity = quantity;
  product.product_type = product_type;
  updateProducts(products);
  return res
    .status(200)
    .json({ success: `Product  ID no.${productId} updated successfully...` });
});

//deleting the product details by id...

app.delete("/products/:id", (req, res) => {
  const products = getProducts();
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex === -1) {
    return res
      .status(404)
      .json({ error: `Product id no ${productId} not found...` });
  }

  // Remove the product from the products array using splice
  products.splice(productIndex, 1);

  updateProducts(products);

  return res
    .status(201)
    .json({ message: `Product id no ${productId} deleted successfully...` });
});


// Find out of stock products
app.get("/outofstock", (req, res) => {
  const products = getProducts();

  const outOfStockProducts = products.filter((product) => product.quantity < 5);

  if (outOfStockProducts.length === 0) {
    return res.json({ message: "No out-of-stock products found." });
  }

  res.json(outOfStockProducts);
});



// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
