const express = require("express");
const port = 5001;

const app = express();
app.use(express.json());

const userRouter = require("./Routes/userRouter");
app.use("/users", userRouter);

const productRouter =require ("./Routes/productRouter");
app.use("/products",productRouter);


const orderRouter = require("./Routes/orderRouter")
app.use("/order",orderRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});