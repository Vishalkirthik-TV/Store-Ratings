const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        console.log("Rating Submitted");
    } catch (error) {
        console.log("Failed")
    }
});

router.put('/', async (req, res) => {
    try {
        console.log("Rating Updated");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/my-ratings', async (req, res) => {
    try {
        console.log("My Ratings Fetched");
    } catch (error) {
        console.log("Failed")
    }
});
module.exports = router;
