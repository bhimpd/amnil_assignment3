const express = require("express");
const router = express.Router();

const {getOrders,getOneOrder,addToCart} = require("../Controller/order");

router.route("/getorder").get(getOrders);

router.route("/getorder/:id").get(getOneOrder);

router.route("/addtocart").post(addToCart);




module.exports= router;

