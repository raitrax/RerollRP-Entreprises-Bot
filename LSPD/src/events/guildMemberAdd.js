const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		console.warn(`New Member Joined --- id: ${member.id}\n--- name: ${member.displayName}`);
		//check si bien embauché LSPD

		if (member.roles.cache.has(process.env.LSPD_ROLE_ID)) {
			try {
				member = await member.roles.add(process.env.LSPD_ROLE_ID);
				member = await member.roles.add(process.env.CADET_ROLE_ID);
			}
			catch (err) {
				console.error(err);
				return;
			}
		}
		if (member.roles.cache.has(process.env.SAMS_ROLE_ID)) {
			try {
				member = await member.roles.add(process.env.SAMS_ROLE_ID);
			}
			catch (err) {
				console.error(err);
				return;
			}
		}
		//cas joueur non traité par les exeptions
		console.log("joueur non répertorié dans une entreprise");
		//cas utilisateur non joueur ajouté au serveur
		console.log("cette personne n'est pas un joueur");
	},
};
