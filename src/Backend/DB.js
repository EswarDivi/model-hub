const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.REACT_APP_MONGODB_URL);

mongoose.connect(process.env.REACT_APP_MONGODB_URL)
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed');
    });

const userDetailsSchema = new mongoose.Schema({
    usertokenid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: "https://www.gravatar.com/avatar/default?d=identicon"
    },
});

const modelDetailsSchema = new mongoose.Schema({
    modeltokenid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    modelname: {
        type: String,
        required: true
    },
    modeldescription: {
        type: String,
        required: true
    },
    modelmodality: {
        type: String,
        required: true
    },
    modeltype: {
        type: String,
        required: true
    },
    s3_url: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});



const userDB = mongoose.model("Auth", userDetailsSchema);
const modelDB = mongoose.model("Model", modelDetailsSchema);

module.exports = { userDB, modelDB };