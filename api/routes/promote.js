const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let newGrade = req.body.newGrade;
    let oldGrade = req.body.oldGrade;

    if (!discordId || !newGrade || !oldGrade) {
        res.status(400).json({ error: 'Missing parameter discordId or newGrade or oldGrade' });
        console.warn('Recruit - Missing parameter discordId or newGrade or oldGrade');
        return;
    }

});

module.exports = router;

