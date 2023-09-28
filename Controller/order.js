const orders = require("../JsonData/order.json");
const cart = require("../JsonData/cart.json");
const products = require("../JsonData/product.json");

const fs = require("fs");
const path = require("path");

// const pathToOrders = path.join(__dirname, "../JsonData/orders.json");
const pathToCart = path.join(__dirname, "../JsonData/cart.json");

// function updateOrderData(order){
//     fs.writeFileSync(pathToCart,JSON.stringify(order,null,2,))
// }

exports.getOrders = (req, res) => {
  res.status(200).send(orders);
};

exports.getOneOrder = (req, res) => {
  const orderid = parseInt(req.params.id);

  const orderID = orders.find((order) => orderid === order.id);

  if (!orderID) {
    res.status(404).json({ error: "order not found...." });
  }
  res.json(orderID);
};

exports.addToCart = (req, res) => {
    const newCart = req.body;
    const cartAlreadyPresent = cart.find(
      (cartItem) => cartItem.user_id === newCart.user_id
    );
  
    //if cart already present, update the cart else create a new cart
    if (cartAlreadyPresent) {
      const presentcartIndex = cart.indexOf(cartAlreadyPresent);
  
      // Loop through items in the newCart and update quantity or add new items
      cartAlreadyPresent.items.forEach((element) => {
        const alreadyPresentItemIndex = cartAlreadyPresent.items.findIndex(
          (itemid) => itemid.id === element.id
        );
  
        if (alreadyPresentItemIndex !== -1) {
          cartAlreadyPresent.items[alreadyPresentItemIndex].quantity +=
            element.quantity;
        } else {
          // Item doesn't exist, add it to the cart
          cartAlreadyPresent.items.push(element);
        }
      });
  
      //calculating the total price of the products in the cart
      cartAlreadyPresent.total_price = cartAlreadyPresent.items.reduce(
        (acc, item) => {
          const product = products.find((product) => product.id === item.id);
          return acc + product.price * item.quantity;
        },
        0
      );
  
      cart[presentcartIndex] = cartAlreadyPresent;
  
      fs.writeFile(pathToCart, JSON.stringify(cart, null, 2), 'utf8', (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Internal server error');
        }
        return res.status(200).send(cartAlreadyPresent);
      });
    } else {
      cart.push(newCart);
  
      const index = cart.indexOf(newCart);
      const userCart = cart[index];
  
      //calculating the total price of the products in the cart
      userCart.total_price = (
        userCart.items.reduce((acc, item) => {
          const product = products.find((product) => product.id === item.id);
          return acc + product.price * item.quantity;
        }, 0)
      ).toFixed(2);
  
      cart[index] = userCart;
  
      fs.writeFile(pathToCart, JSON.stringify(cart, null, 2), 'utf8', (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Internal server error');
        }
        res.status(201).send(newCart);
      });
    }
  };
  