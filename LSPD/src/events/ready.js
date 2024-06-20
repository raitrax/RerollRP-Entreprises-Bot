const { Events, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();
const path = require('path');
require('../scripts/deploy-commands')


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

    const channel = client.channels.cache.get(process.env.PDS_CHANNEL_ID);
    /*await channel.bulkDelete(99, true).catch(error => {
      console.error(error);
      channel.send({ content: 'Une erreur est survenue lors de la suppression des messages dans ce channel!', ephemeral: true });
    });*/
    await channel.send({ embeds: [getServiceRequestEmbed(channel)], components: [getServiceRequestButtons()] });

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

const getServiceRequestEmbed = (channel) => {

  return new EmbedBuilder()
    .setColor(Colors.Green)
    .setDescription(`Pour indiquer une prise / fin de service - Appuyer sur le bouton 🔴\n Pour prendre la centrale - Appuyez sur 🟢\n Pour se mettre en astreinte - Appuyez sur ⚫`)
    //.setDescription('Bon jeu!')
    .setAuthor({ name: 'Centrale LSPD' })
    .setTimestamp(new Date());

};

const getServiceRequestButtons = () => {
  return new ActionRowBuilder()
    .addComponents(
      // new ButtonBuilder()
      //   .setCustomId('service')
      //   .setLabel('Service')
      //   .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('lead')
        .setLabel('Lead')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('astreinte')
        .setLabel('Astreinte')
        .setStyle(ButtonStyle.Secondary)
    );
};

