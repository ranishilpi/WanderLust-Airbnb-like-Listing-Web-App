//const express = require('express');
//const app = express();
const initdata = require('./data.js');
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
   .then(() => {
     console.log('Connected to DB');
   })
   .catch((err) => {
     console.log(err);
 });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: '69350f5c76d876c8e6865337',
    }));
    
    await Listing.insertMany(initdata.data);
    console.log("Database Initialized with Data");
};

initDB();