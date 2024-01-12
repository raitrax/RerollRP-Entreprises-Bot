const { Events, ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(newMember, oldMember) {
		if (newMember.roles.cache.has(process.env.SERVICE_ROLE_ID) || oldMember.roles.cache.has(process.env.SERVICE_ROLE_ID)) {
			let txtActivity;
			// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
			const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
			let countPDS;
			if (removedRoles.size > 0) {
				countPDS = oldMember.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
			}

			// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
			const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
			if (addedRoles.size > 0) {
				countPDS = newMember.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
			}
			if (countPDS != null) {
				txtActivity = `${countPDS.size} personne(s) en service`

			} else {
				txtActivity = `0 personne(s) en service`

			}
			console.log(txtActivity);
			newMember.client.user.setActivity({ name: txtActivity, type: ActivityType.Custom });
		}
		const effectifChannel = newMember.client.channels.cache.get(process.env.COMPTA_CHANNEL_ID);
		const listeGrade = process.env.LISTE_GRADE;
		await effectifLspd(effectifChannel, newMember.client, listeGrade);


	},
};
const effectifLspd = async (effectifChannel, client, listeGrade) => {
	await EffectifChannel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});
	// Obtenir la guilde actuelle
	const guild = client.guilds.cache.get(process.env.GUILD_ID);
	await guild.members.fetch();
	// Obtenir la liste des rôles de la guilde
	const roles = guild.roles.cache;
	//console.log(roles);
	let effectifTXT = "```md";
	for (const role of roles) {
		if (listeGrade.includes(role[1].name)) {
			//console.log(role[1].name);
			const members = role[1].members.map(m => m)
			effectifTXT += `\n${role[1].name} :\n`;
			console.log(role[1].name.length)
			for (let index = 0; index < role[1].name.length + 2; index++) {
				effectifTXT += `=`;
			}
			effectifTXT += `\n`;
			for (const member of members) {
				effectifTXT += `- ${member.nickname}\n`;
			}
		}
	}
	effectifTXT += "```";

	await effectifChannel.send(effectifTXT);
	console.log(effectifTXT);
};