const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Fire - Missing parameter discordId');
        return;
    }

    return;
});
module.exports = router;
