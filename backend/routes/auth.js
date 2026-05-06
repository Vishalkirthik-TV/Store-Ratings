const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        console.log("Signed up Successfully")
    } catch (error) {
        console.log(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log("Logged in Successfully")
    } catch (error) {
        console.log(error)
    }
});

router.post('/update-password', async (req, res) => {
    try {
        console.log("Password updated Successfully")
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;

