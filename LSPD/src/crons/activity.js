const cron = require("node-cron");
require("dotenv").config();
const { Collection, ChannelType } = require("discord.js");

const categoriesToMonitor = new Collection();
categoriesToMonitor.set(process.env.ARCHIVE_CATEGORY, "Archive");
categoriesToMonitor.set(
  process.env.ARCHIVE_COLD_CATEGORY,
  "Archive Cold Cases",
);

const deleteInactiveChannels = async (client) => {
  const guilds = client.guilds.cache;

  guilds.forEach(async (guild) => {
    categoriesToMonitor.forEach(async (categoryName, categoryId) => {
      const category = guild.channels.cache.get(categoryId);
      if (!category) return; // La catégorie n'existe pas sur ce serveur

      const channels = category.children.cache;
      channels.forEach(async (channel) => {
        if (channel.type === ChannelType.GuildText) {
          const lastMessage = await channel.messages
            .fetch({ limit: 1 })
            .catch(console.error);
          const lastMessageArray = lastMessage.map((member) => member);
          if (lastMessageArray) {
            if (
              lastMessageArray[0] &&
              lastMessageArray[0].createdTimestamp <
                Date.now() - 30 * 24 * 60 * 60 * 1000
            ) {
              try {
                await channel.delete();
                console.log(
                  `Channel ${channel.name} deleted in category ${categoryName}`,
                );
              } catch (error) {
                console.error(
                  `Could not delete channel ${channel.name} in category ${categoryName}: ${error}`,
                );
              }
            }
          }
        }
      });
    });
  });
};

module.exports = {
  initCron(client) {
    cron.schedule(
      "0 6 * * *",
      async function () {
        deleteInactiveChannels(client);
      },
      {
        timezone: "Europe/Paris",
      },
    );
  },
};
