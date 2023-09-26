const express = require("express");
const router = express.Router();

const {createProduct,getProducts, getOneProduct, deleteProduct, updateProduct, 
    outOfStock, sortByPrice, searchByName, filterProductType} = require("../Controller/products");

router.route('/create').post(createProduct);
router.route('/').get(getProducts);
router.route('/getproduct/:id').get(getOneProduct);
router.route('/deleteproduct/:id').delete(deleteProduct);
router.route('/updateproduct/:id').put(updateProduct);
router.route('/outofstock').get(outOfStock);
router.route('/sort').get(sortByPrice);
router.route('/search').get(searchByName);
router.route('/filter').get(filterProductType);


module.exports = router;