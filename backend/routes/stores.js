const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        console.log("Store Created Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/', async (req, res) => {
    try {
        console.log("Stores Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/my-store', async (req, res) => {
    try {
        console.log("My Store Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/my-store/ratings', async (req, res) => {
    try {
        console.log("My Store Ratings Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

module.exports = router;

