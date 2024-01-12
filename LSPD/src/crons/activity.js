const cron = require('node-cron');
const { ActivityType } = require('discord.js');

module.exports = {
	initCron(client) {
		cron.schedule('* * * * *', async function () {
			const openDate = new Date(2023, 11, 8, 20, 0, 0).getTime();
			const now = new Date().getTime();

			if (now > openDate) {
				const response = await fetch('https://launcher.reroll-rp.fr/status/');
				const infoPlayers = await response.json();
				if (infoPlayers && typeof infoPlayers.nbPlayer !== 'undefined') {
					//client.user.setActivity({ name: `${infoPlayers.nbPlayer}/${infoPlayers.nbPlayerMax}, ${infoPlayers.queue} sur la route`, type: ActivityType.Custom });
				}
				// client.user.setActivity({ name: 'C\'est ouvert! 👀', type: ActivityType.Custom });
				return;
			}

			const interval = openDate - now;

			const activity = 'Ouverture dans ' +
				`${Math.floor(interval / 86400000)}J ` +
				`${Math.floor((interval / 3600000) % 24)}H ` +
				`${Math.floor((interval / 60000) % 60)}M`;

			client.user.setActivity({ name: `${activity}`, type: ActivityType.Custom });
		}, {
			timezone: 'Europe/Paris',
		});
	},
};
