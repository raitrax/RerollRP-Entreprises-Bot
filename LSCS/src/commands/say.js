const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Dis ce qui doit l'être")
    .addStringOption((option) =>
      option.setName("input").setDescription("The input to echo back"),
    ),
  async execute(interaction) {
    await interaction
      .deferReply({ ephemeral: true })
      .catch((e) => console.error(e));
    const text = interaction.options.getString("input");
    interaction.channel.send(`${text}`);
    return interaction.editReply({
      content: `Message envoyé`,
      ephemeral: true,
    });
  },
};
