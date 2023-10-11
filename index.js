const express = require('express');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();



app.listen(3000, ()=>{
    console.log(`Server is listening on port ${port}`);
})