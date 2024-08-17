const { Events, ActivityType } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(newMember, oldMember) {
    if (
      newMember.roles.cache.has(process.env.SERVICE_ROLE_ID) ||
      oldMember.roles.cache.has(process.env.SERVICE_ROLE_ID)
    ) {
      let txtActivity;
      let countPDS;
      const removedRoles = oldMember.roles.cache.filter(
        (role) => !newMember.roles.cache.has(role.id),
      );
      if (removedRoles.size > 0) {
        countPDS = oldMember.roles.cache.get(
          process.env.SERVICE_ROLE_ID,
        ).members;
      }

      const addedRoles = newMember.roles.cache.filter(
        (role) => !oldMember.roles.cache.has(role.id),
      );
      if (addedRoles.size > 0) {
        countPDS = newMember.roles.cache.get(
          process.env.SERVICE_ROLE_ID,
        ).members;
      }
      if (countPDS) {
        txtActivity = `${countPDS.size} personne(s) en service`;
      } else {
        txtActivity = `0 personne(s) en service`;
      }

      const guild = newMember.client.guilds.cache.get(process.env.GUILD_ID); // puppets server id
      await guild.members.fetch();
      newMember.client.user.setActivity({
        name: txtActivity,
        type: ActivityType.Custom,
      });
    }
  },
};
