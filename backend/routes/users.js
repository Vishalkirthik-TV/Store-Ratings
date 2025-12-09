const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log("User Created Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/', async (req, res) => {
    try {
        console.log("Users Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log("User Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

router.get('/stats/dashboard', async (req, res) => {
    try {
        console.log("Dashboard Stats Fetched Successfully");
    } catch (error) {
        console.log("Failed")
    }
});

module.exports = router;
