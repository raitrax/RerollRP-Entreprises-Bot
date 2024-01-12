const { Events, DiscordAPIError } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isButton()) {
			const [commandName, customId] = interaction.customId.split('|');
			const command = interaction.client.commands.get(commandName);
			if (!command) {
				console.error(`No command matching ${commandName} was found.`);
				return;
			}
			await command.buttonClicked(interaction, customId);
		}

		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			if (interaction.isAutocomplete()) {
				await command.autoComplete(interaction);
			}
			else {
				console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered ${interaction.commandName} ${interaction.options.getSubcommandGroup(false) || ''} ${interaction.options.getSubcommand(false) || ''}`);
				await command.execute(interaction);
			}
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			if (error instanceof DiscordAPIError && error.code === 10062) {
				return;
			}
			if (interaction.deferred) {
				await interaction.editReply({ content: 'J\'ai rencontré une erreur en exécutant cette commande...', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'J\'ai rencontré une erreur en exécutant cette commande...', ephemeral: true });
			}
		}
	},
};
