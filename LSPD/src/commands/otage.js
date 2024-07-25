const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
require('dotenv').config();
const { User_Roles } = require('../dbObjects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otage')
    .setDescription('Forcer la fin de service. Limite : Cadet+')
    .addUserOption(option => option.setName('target').setDescription(`L'agent à FDS`).setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));
    const member = interaction.options.getMember('target');

    const user = await User_Roles.findAll({ where: { discord_id: member.id } });
    console.log(user.length);
    if (user.length > 0) {
      user.forEach(async (role) => {
        await member.roles.add(role.role_id);
      })
      await User_Roles.destroy({ where: { discord_id: member.id } });
      return await interaction.editReply({ content: `Accès rendu pour <@${member.id}>`, ephemeral: false });
    } else {
      await member.roles.cache.forEach(async (role) => {
        if (role.id !== interaction.member.guild.roles.everyone.id || role.id !== process.env.SERVICE_ROLE_ID) {
          if (!member.roles.cache.has(role.id)) {
            console.info(`${member.nickname} n'a pas le rôle ${role.name}`);
          } else {
            try {
              await User_Roles.create({
                discord_id: member.id,
                role_id: role.id,
              });
              await member.roles.remove(role);
              console.info(`Retrait du rôle ${role.name} pour ${member.nickname}`);
              return await interaction.editReply({ content: `Accès retiré pour <@${member.id}>`, ephemeral: false });
            } catch (error) {
              console.error(error);
            }
          }
        }
      });
    }



  },
};