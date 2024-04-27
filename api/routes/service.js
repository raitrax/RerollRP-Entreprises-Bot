const express = require('express');
require('dotenv').config();
const router = express.Router();
const { EmbedBuilder, Colors } = require('discord.js');

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let onDuty = req.body.onDuty;

});

module.exports = router;
