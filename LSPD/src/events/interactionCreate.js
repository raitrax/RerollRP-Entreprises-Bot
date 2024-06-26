const { Events, DiscordAPIError, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      const [commandName, customId] = interaction.customId.split('|');
      const command = interaction.client.commands.get(commandName);
      const member = interaction.member;
      /*if (!command) {
        console.error(`No command matching ${commandName} was found.`);
        return;
      }*/
      if (command) {
        // Exécuter la fonction associée à la commande
        await command.buttonClicked(interaction, customId);
      } else {
        if (interaction.customId === "service") {
          await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));

          if (member.roles.cache.has(process.env.SERVICE_ROLE_ID)) {
            await member.roles.remove(process.env.SERVICE_ROLE_ID);
            let FinServiceEmbed = new EmbedBuilder()
              .setColor(Colors.Yellow)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Fin de service :  **${member.nickname}**`)
            await interaction.editReply({ embeds: [FinServiceEmbed], ephemeral: true });
          } else {
            await member.roles.add(process.env.SERVICE_ROLE_ID);
            let DebServiceEmbed = new EmbedBuilder()
              .setColor(Colors.Yellow)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Prise de service : **${member.nickname}**`)

            await interaction.editReply({ embeds: [DebServiceEmbed], ephemeral: true });
          }
        }
        if (interaction.customId === "lead") {
          await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));

          if (member.roles.cache.has(process.env.SERVICE_LEAD_ROLE_ID)) {
            interaction.guild.roles.fetch(process.env.SERVICE_LEAD_ROLE_ID)
              .then(role => member.roles.remove(role))
              .catch(console.error())
            let DebServiceEmbed = new EmbedBuilder()
              .setColor(Colors.White)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Vous n'êtes plus la centrale`)
            await interaction.editReply({ embeds: [DebServiceEmbed], ephemeral: true });
          } else {
            interaction.guild.roles.fetch(process.env.SERVICE_LEAD_ROLE_ID)
              .then(role => member.roles.add(role))
              .catch(console.error())
            let FinServiceEmbed = new EmbedBuilder()
              .setColor(Colors.White)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Vous êtes la centrale`)
            await interaction.editReply({ embeds: [FinServiceEmbed], ephemeral: true });
          }
        }
        if (interaction.customId === "astreinte") {
          await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));

          if (member.roles.cache.has(process.env.ASTREINTE_ROLE_ID)) {
            interaction.guild.roles.fetch(process.env.ASTREINTE_ROLE_ID)
              .then(role => member.roles.remove(role))
              .catch(console.error())
            let DebServiceEmbed = new EmbedBuilder()
              .setColor(Colors.Grey)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Vous n'êtes plus en astreinte`)
            await interaction.editReply({ embeds: [DebServiceEmbed], ephemeral: true });
          } else {
            interaction.guild.roles.fetch(process.env.ASTREINTE_ROLE_ID)
              .then(role => member.roles.add(role))
              .catch(console.error())
            let FinServiceEmbed = new EmbedBuilder()
              .setColor(Colors.Grey)
              .setAuthor({ name: `Système Iris - ${new Date()}` })
              .setDescription(`Vous êtes en astreinte`)
            await interaction.editReply({ embeds: [FinServiceEmbed], ephemeral: true });
          }
        }
      }
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
