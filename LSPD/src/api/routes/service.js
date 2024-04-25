const express = require('express');
require('dotenv').config();
const router = express.Router();
const { Client, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let onDuty = req.body.onDuty;
    let guild, member;
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Channel] });
    let suiviChannel = client.channels.cache.get(process.env.PDS_CHANNEL_ID);

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Service - Missing parameter discordId');
        return;
    }
    if (onDuty == null) {
        res.status(400).json({ error: 'Missing parameter onDuty' });
        console.warn('Service - Missing parameter onDuty');
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
    if (onDuty) {
        if (member.roles.cache.has(process.env.SERVICE_ROLE_ID)) {
            console.log(`${member.nickname} à déjà le rôle Service`)
            res.status(200).json({ msg: `${member.nickname} is already in service` });
            console.log(`${member.nickname} is already in service`);
        } else {
            await member.roles.add(process.env.SERVICE_ROLE_ID).then(console.log(`Ajout du rôle Service pour ${member.nickname}`));

            let DebServiceEmbed = new EmbedBuilder()
                .setAuthor({ name: `Système Iris` })
                .setDescription(`Prise de service : **${member.nickname}**`)
            await suiviChannel.send({ embeds: [DebServiceEmbed], ephemera: false });
            /**/

            res.status(200).json({ msg: `${member.nickname} is now in service` });
            console.log(`${member.nickname} is now in service`);
        }
    }
    else {
        await member.roles.remove(process.env.SERVICE_ROLE_ID).then(console.log(`Retrait du rôle Service pour ${member.nickname}`));

        let FinServiceEmbed = new EmbedBuilder()
            .setAuthor({ name: `Système Iris` })
            .setDescription(`Fin de service :  **${member.nickname}**`)
        await suiviChannel.send({ embeds: [FinServiceEmbed], ephemeral: false });
        /**/
        res.status(200).json({ msg: `${member.nickname} is now out of service` });
        console.log(`${member.nickname} is now out of service`);
    }
});

module.exports = router;
