const express = require("express");
const router = express.Router();

const { usersList , singleUser,createUser,deleteUser,updateUser }  = require("../Controller/users");


 router.route('/').get(usersList)
 router.route('/:id').get(singleUser)
 router.route('/create').post(createUser)

 router.route('/delete/:id').delete(deleteUser)
 router.route('/update/:id').put(updateUser)

 module.exports = router;