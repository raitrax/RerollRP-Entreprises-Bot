const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archivage")
    .setDescription(`Archivage d'un channel.`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("normal")
        .setDescription("Transfert le dossier dans la catégorie Archives")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(`Channel à assigner pour l'opération`)
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option
            .setName("interne")
            .setDescription("Est-ce une affaire interne?")
            .setRequired(false),
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
    const Interne = interaction.options.getBoolean("interne");
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
      if (Interne) {
        await Channel.setParent(idArchives, { lockPermissions: false });
      } else {
        await Channel.setParent(idArchives, { lockPermissions: true });
      }
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
