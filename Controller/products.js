const products = require("../JsonData/product.json");
const fs = require("fs");
const path = require("path");
const pathToProducts = path.join(__dirname, "../JsonData/product.json");

//to write the user data
function updateProducts(products) {
  fs.writeFileSync(pathToProducts, JSON.stringify(products, null, 2));
}

//creating the product details....
exports.createProduct = (req, res) => {
  const { id, name, price, quantity, product_type } = req.body;
  if (!id || !name || !price || !quantity || !product_type) {
    return res.status(400).json({ error: "Please fill all the details..." });
  }
  const newProduct = { id, name, price, quantity, product_type };
  products.push(newProduct);
  updateProducts(products);
  return res.status(200).json({ success: "Product added successfully..." });
};

//fetching all the product details...
exports.getProducts = (req, res) => {
  res.json(products);
};

//  fetching 1 product at a time using id
exports.getOneProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  // Use find() to search for the product by id
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res
      .status(404)
      .json({ error: `Product id no ${productId} not found...` });
  }

  res.json(product);
};

//deleting product details

exports.deleteProduct = (req, res) => {
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
};

//update the product  details...
exports.updateProduct = (req, res) => {
  const productId = parseInt(req.params.id);

  const { name, price, quantity, product_type } = req.body;
  if (!name || !price || !quantity || !product_type) {
    return res
      .status(400)
      .json({ error: "Please fill the missing details..." });
  }
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
};


//fetching out of stock products 
exports.outOfStock = (req,res)=>{
  const outOfStockProducts = products.filter((product) => product.quantity < 5);

  if (outOfStockProducts.length === 0) {
    return res.json({ message: "No out-of-stock products found." });
  }

  res.json(outOfStockProducts);
}

//sorting price in ascending...
exports.sortByPrice =(req,res)=>{

  products.sort((a, b) => a.price - b.price);

  res.json(products);
}

//searching by name 

exports.searchByName = (req, res) => {
  const query = req.query.q; // The search query
  if (!query) {
    return res.status(400).json({ error: "Please provide a search query..." });
  }

  const results = products.filter((product) => product.name.includes(query));

  if (results.length === 0) {
    return res.status(404).json({ error: `No products match your search...` });
  }

  res.json(results);
};

//filtering the product through product
exports.filterProductType = (req,res)=>{
  const productType = req.query.productType; // The product type to filter by
  if (!productType) {
    return res
      .status(400)
      .json({ error: "Please provide a product type to filter..." });
  }

  const filteredProducts = products.filter(
    (product) => product.product_type === productType
  );

  if (filteredProducts.length === 0) {
    return res
      .status(404)
      .json({ error: `No products found for product type ${productType}...` });
  }

  res.json(filteredProducts);
}


