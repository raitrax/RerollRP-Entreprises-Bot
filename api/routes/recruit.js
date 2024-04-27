const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post("/", async (req, res) => {
	let discordId = req.body.discordId;

});

module.exports = router;
