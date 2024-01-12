const { Events, ActivityType } = require('discord.js');
require('dotenv').config();
const path = require('path');
const { loadDashboard } = require(path.join(__dirname, '../api/main'));

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		let txtActivity;
		const guild = client.guilds.cache.get(process.env.GUILD_ID); // puppets server id
		await guild.members.fetch();
		const countPDS = guild.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
		if (countPDS != null) {
			txtActivity = `${countPDS.size} personne(s) en service`
		}
		else {
			txtActivity = `0 personne(s) en service`

		}
		console.log(txtActivity);
		client.user.setActivity({ name: txtActivity, type: ActivityType.Custom });

		console.log(`Ready! Logged in as ${client.user.tag}`);
		loadDashboard(client);
	},
};
