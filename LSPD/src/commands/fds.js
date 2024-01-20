const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fds')
    .setDescription('Forcer la fin de service. Limite : Cadet+')
    .addUserOption(option => option.setName('target').setDescription(`L'agent à FDS`).setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));
    const member = interaction.options.getMember('target');
    console.log("member " + member);
    if (member.id == process.env.CLIENT_ID) {
      return interaction.editReply({ content: `<@${process.env.CLIENT_ID}> n'est pas un agent, VEUILLEZ CHOISIR LE BON TAG!`, ephemeral: true });
    }
    const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

    const nickName = interactionUser.nickname;
    let datetime = new Date();

    let membre = interaction.guild.members.cache.get(member.user.id);
    let FdsEmbed;
    let MpEmbed;
    if (membre.roles.cache.has(process.env.SERVICE_LEAD_ROLE_ID)) {
      membre.roles.remove(process.env.SERVICE_LEAD_ROLE_ID);
    }
    if (membre.roles.cache.has(process.env.SERVICE_ROLE_ID)) {

      membre.roles.remove(process.env.SERVICE_ROLE_ID);

      MpEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({ name: `Système Iris - ${datetime}` })
        .setTitle(`Bonjour ${membre.nickname},`)
        .setDescription(`Vous n'avez pas pris votre fin de service.\nMerci de penser à la prendre à l'avenir !`)
        .setFooter({ text: `Cordialement, ${nickName}` })
      membre.send({ embeds: [MpEmbed], ephemeral: false }).catch(error => {
        console.log(`Error : ${error} : Impossible de lui envoyer un message.`);
      });
      FdsEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({ name: `Système Iris - ${datetime}` })
        .setDescription(`Fin de service par ${nickName}:  **${member.nickname}**`)

      interaction.editReply({ embeds: [FdsEmbed], ephemeral: true });
      return logchannel.send({ embeds: [FdsEmbed], ephemeral: false });
    }
    else {
      FdsEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`${membre.nickname} n'est pas en service  - ${datetime}`)
        .setAuthor({ name: 'Système Iris' })
      return interaction.editReply({ embeds: [FdsEmbed], ephemeral: true });
    }
  },
};