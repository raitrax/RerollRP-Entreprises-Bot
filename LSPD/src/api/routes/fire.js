const express = require('express');
require('dotenv').config();
const router = express.Router();
const { Client, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');


router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let guild, member, msgAnnonce;
    const annonceChannel = await req.app.myClient.channels.cache.get(process.env.PDS_CHANNEL_ID);

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

    member.roles.cache.forEach(role => {
        if (role.id != guild.roles.everyone.id) {
            member.roles.remove(role).then(console.log(`Retrait du rôle ${role.name} pour ${member.nickname}`));
        }
    });
    await member.roles.add(process.env.VAC_ROLE_ID).then(console.log(`Ajout du rôle Vacances pour ${member.nickname}`));
    console.log(`<${process.env.VAC_ROLE_ID}> has been added`);

    msgAnnonce = `:arrow_left: **${member.displayName}** ne fait plus partie de l'effectif`;

    await annonceChannel.send({ content: msgAnnonce, ephemeral: false });

    res.status(200).json({ msg: `<${member.displayName} - ${member.id}> has been fired from the job` });
    console.log(`<${member.displayName} - ${member.id}> has been fired from the job`);
    return;
});
module.exports = router;
