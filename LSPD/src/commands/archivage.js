const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archivage")
    .setDescription(`Archivage d'un channel. Limite : ltn+`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("normal")
        .setDescription("Transfert le dossier dans la catégorie Archives")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(`Channel à assigner pour l'opération`)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("garder")
        .setDescription(
          "Transfert le dossier dans la catégorie Archives à garder",
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(`Channel à assigner pour l'opération`)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("coldcases")
        .setDescription(
          "Transfert le dossier dans la catégorie Archives cold cases",
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(`Channel à assigner pour l'opération`)
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    await interaction
      .deferReply({ ephemeral: true })
      .catch((e) => console.error(e));
    const Channel = interaction.options.getChannel("channel");
    let idArchives;
    if (interaction.options.getSubcommand() === "normal") {
      idArchives = process.env.ARCHIVE_CATEGORY;
    } else if (interaction.options.getSubcommand() === "garder") {
      idArchives = process.env.ARCHIVE_GARDER_CATEGORY;
    } else if (interaction.options.getSubcommand() === "coldcases") {
      idArchives = process.env.ARCHIVE_COLD_CATEGORY;
    }
    if (idArchives) {
      const category = interaction.guild.channels.cache.find(
        (c) => c.id === idArchives && c.type === ChannelType.GuildCategory,
      );
      if (!category)
        return interaction.editReply({
          content: "Catégorie non trouvée",
          ephemeral: true,
        });
      // Déplacer le canal dans la nouvelle catégorie
      await Channel.setParent(idArchives, { lockPermissions: false });
      await Channel.setPosition(0, { relative: false, parent: idArchives })
        .then(Channel.send({ content: "**Archivage**", ephemeral: false }))
        .catch(console.error);
      await interaction.editReply({
        content: "Archivage effectué!",
        ephemeral: true,
      });
    } else {
      await interaction.editReply({
        content: "Archivage impossible! Choisissez une autre catégorie!",
        ephemeral: true,
      });
    }
  },
};
