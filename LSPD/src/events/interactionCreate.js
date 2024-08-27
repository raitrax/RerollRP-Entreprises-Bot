const { Events, DiscordAPIError, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isButton()) {
			const [commandName, customId] = interaction.customId.split("|");
			const command = interaction.client.commands.get(commandName);
			const member = interaction.member;
			if (command) {
				await command.buttonClicked(interaction, customId);
			} else {
				if (interaction.customId === "lead") {
					await interaction
						.deferReply({ ephemeral: true })
						.catch((e) => console.error(e));

					if (member.roles.cache.has(process.env.SERVICE_LEAD_ROLE_ID)) {
						interaction.guild.roles
							.fetch(process.env.SERVICE_LEAD_ROLE_ID)
							.then((role) => member.roles.remove(role))
							.catch(console.error());
						const DebServiceEmbed = new EmbedBuilder()
							.setColor(Colors.White)
							.setAuthor({ name: `Système Iris - ${new Date()}` })
							.setDescription(`Vous n'êtes plus la centrale`);
						await interaction.editReply({
							embeds: [DebServiceEmbed],
							ephemeral: true,
						});
					} else {
						interaction.guild.roles
							.fetch(process.env.SERVICE_LEAD_ROLE_ID)
							.then((role) => member.roles.add(role))
							.catch(console.error());
						const FinServiceEmbed = new EmbedBuilder()
							.setColor(Colors.White)
							.setAuthor({ name: `Système Iris - ${new Date()}` })
							.setDescription(`Vous êtes la centrale`);
						await interaction.editReply({
							embeds: [FinServiceEmbed],
							ephemeral: true,
						});
					}
				}
				if (interaction.customId === "astreinte") {
					await interaction
						.deferReply({ ephemeral: true })
						.catch((e) => console.error(e));

					if (member.roles.cache.has(process.env.ASTREINTE_ROLE_ID)) {
						interaction.guild.roles
							.fetch(process.env.ASTREINTE_ROLE_ID)
							.then((role) => member.roles.remove(role))
							.catch(console.error());
						const DebServiceEmbed = new EmbedBuilder()
							.setColor(Colors.Grey)
							.setAuthor({ name: `Système Iris - ${new Date()}` })
							.setDescription(`Vous n'êtes plus en astreinte`);
						await interaction.editReply({
							embeds: [DebServiceEmbed],
							ephemeral: true,
						});
					} else {
						interaction.guild.roles
							.fetch(process.env.ASTREINTE_ROLE_ID)
							.then((role) => member.roles.add(role))
							.catch(console.error());
						const FinServiceEmbed = new EmbedBuilder()
							.setColor(Colors.Grey)
							.setAuthor({ name: `Système Iris - ${new Date()}` })
							.setDescription(`Vous êtes en astreinte`);
						await interaction.editReply({
							embeds: [FinServiceEmbed],
							ephemeral: true,
						});
					}
				}
			}
		}

		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
			return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`,
			);
			return;
		}
		try {
			if (interaction.isAutocomplete()) {
				await command.autoComplete(interaction);
			} else {
				await command.execute(interaction);
			}
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			if (error instanceof DiscordAPIError && error.code === 10062) {
				return;
			}
			if (interaction.deferred) {
				await interaction.editReply({
					content: "J'ai rencontré une erreur en exécutant cette commande...",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "J'ai rencontré une erreur en exécutant cette commande...",
					ephemeral: true,
				});
			}
		}
	},
};
