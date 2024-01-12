const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();

const rolesRouter = require('./routes/roles');
const statusRouter = require('./routes/status');

app.use(cors({
	origin: 'https://reroll-rp.fr/',
}));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
	const token = req.headers.authorization ? req.headers.authorization.replace(/^Bot\s+/, '') : '';

	if (token !== process.env.API_BOT_TOKEN) {
		return res.status(401).send();
	}

	next();
});

app.use('/role', rolesRouter);
app.use('/status', statusRouter);


app.get('*', (req, res) => {
	res.sendStatus(404).end();
});

const loadDashboard = (client) => {
	app.myClient = client;
	app.listen(process.env.APP_PORT, '127.0.0.1', () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
};

module.exports = { loadDashboard };
