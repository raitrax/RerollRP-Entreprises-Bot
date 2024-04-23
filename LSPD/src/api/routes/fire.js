const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let guild, member, msgAnnonce;

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Fire - Missing parameter discordId');
        return;
    }

    try {
        guild = await req.app.myClient.guilds.fetch(process.env.GUILD_ID);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching guild', errMsg: err });
        console.error(err);
        return;
    }

    try {
        member = await guild.members.fetch({ user: discordId, force: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching member', errMsg: err });
        console.error(err);
        return;
    }

    const memberRole = await checkMemberRoles(member, process.env.LISTE_GRADE_ID);
    if (memberRole) {
        console.log(`Member has role: ${memberRole.name}`);
    } else {
        console.log('Member does not have any of the specified roles');
        res.status(500).json({ error: 'Error member does not have any of the specified roles', errMsg: err });
        console.error(err);
        return;
    }

    msgAnnonce = `:arrow_left: ${memberRole.name} **${member.displayName}** ne fait plus partie de l'effectif`;
    const annonceChannel = await interaction.client.channels.cache.get(process.env.ANNONCE_CHANNEL_ID);
    await annonceChannel.send({ content: msgAnnonce, ephemeral: false });

    res.status(200).json({ msg: `<${member.displayName} - ${member.id}> has been fired from the job` });
    console.log(`<${member.displayName} - ${member.id}> has been added to the job ${jobName}`);
    return;
});

async function checkMemberRoles(member, roleIDs) {
    const guildRoles = member.guild.roles.cache;

    const hasRole = guildRoles.some(role => roleIDs.includes(role.id));
    if (hasRole) {
        for (const role of member.roles.cache) {
            if (roleIDs.includes(role.id)) {
                await member.roles.remove(role.id).then(console.log(`Retrait du rôle ${role.name} pour ${Member.nickname}`));
            }
        }
    }
    await member.roles.add(process.env.VAC_ROLE_ID).then(console.log(`Ajout du rôle Vacances pour ${Member.nickname}`));
    return null; // Member doesn't have any of the specified roles
}

module.exports = router;
