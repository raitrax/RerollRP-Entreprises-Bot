const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.id;
    let guild, member, msgAnnonce, grade;

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

    const memberRole = await checkMemberRoles(member.id, process.env.LISTE_GRADE_ID);
    if (memberRole) {
        console.log(`Member has role: ${memberRole.name}`);
    } else {
        console.log('Member does not have any of the specified roles');
    }



    msgAnnonce = `:arrow_left: ${memberRole.name} **${member.displayName}** ne fait plus partie de l'effectif`;
    const annonceChannel = await interaction.client.channels.cache.get(process.env.ANNONCE_CHANNEL_ID);
    await annonceChannel.send({ content: msgAnnonce, ephemeral: false });


    //add all permission to the user by fetching data from the reroll database

    res.status(200).json({ msg: 'User has been fired from the job' });
    console.log(`<${member.displayName} - ${member.id}> has been added to the job ${jobName}`);
    return;
});

async function checkMemberRoles(memberId, roleIDs) {
    const member = await guild.members.fetch(memberId);
    const guildRoles = member.guild.roles.cache;

    const hasRole = guildRoles.some(role => roleIDs.includes(role.id));
    if (hasRole) {
        for (const role of member.roles.cache) {
            if (roleIDs.includes(role.id)) {
                return role; // Return the role object or role.name
            }
        }
    }

    return null; // Member doesn't have any of the specified roles
}

module.exports = router;
