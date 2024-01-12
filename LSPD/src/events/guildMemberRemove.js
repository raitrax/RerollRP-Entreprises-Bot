const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.GuildMemberRemove,
	execute(member) {
		console.warn(`Member with role player has left (or been kicked) from the server\n--- id: ${member.id}\n--- name: ${member.displayName}`);
	},
};
