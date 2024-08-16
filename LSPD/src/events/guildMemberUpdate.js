const { Events, ActivityType } = require("discord.js");
require("dotenv").config();
const functions = require("../functions");

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(newMember, oldMember) {
    const addedRoles = oldMember.roles.cache.filter(
      (role) => !newMember.roles.cache.has(role.id),
    );
    if (addedRoles.size > 0) {
      if (process.env.LISTE_GRADE.includes(addedRoles.map((r) => r.name))) {
        //const effectifChannel = newMember.client.channels.cache.get(process.env.EFFECTIF_CHANNEL_ID);
        //await effectifLspd(effectifChannel, newMember.client, process.env.LISTE_GRADE);
      }
    }

    // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
    const removedRoles = newMember.roles.cache.filter(
      (role) => !oldMember.roles.cache.has(role.id),
    );
    if (removedRoles.size > 0) {
      if (process.env.LISTE_GRADE.includes(removedRoles.map((r) => r.name))) {
        //const effectifChannel = oldMember.client.channels.cache.get(process.env.EFFECTIF_CHANNEL_ID);
        //await effectifLspd(effectifChannel, oldMember.client, process.env.LISTE_GRADE);
      }
    }

    if (
      newMember.roles.cache.has(process.env.SERVICE_ROLE_ID) ||
      oldMember.roles.cache.has(process.env.SERVICE_ROLE_ID)
    ) {
      let txtActivity;
      let countPDS;
      // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
      const removedRoles = oldMember.roles.cache.filter(
        (role) => !newMember.roles.cache.has(role.id),
      );
      if (removedRoles.size > 0) {
        countPDS = oldMember.roles.cache.get(
          process.env.SERVICE_ROLE_ID,
        ).members;
      }

      // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
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
      const PDSChannel = newMember.client.channels.cache.get(
        process.env.PDS_CHANNEL_ID,
      );

      const usersWithRole = guild.roles.cache.get(
        process.env.SERVICE_ROLE_ID,
      ).members;
      await functions.listService(PDSChannel, usersWithRole);
      newMember.client.user.setActivity({
        name: txtActivity,
        type: ActivityType.Custom,
      });
    }
  },
};
