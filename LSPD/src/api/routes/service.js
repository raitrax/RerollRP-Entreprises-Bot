const express = require('express');
require('dotenv').config();
const router = express.Router();
const { Client, EmbedBuilder } = require('discord.js');

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let onDuty = req.body.onDuty;
    let guild, member;
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Channel] });

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Service - Missing parameter discordId');
        return;
    }

    if (!onDuty) {
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
        let suiviChannel = client.channels.cache.get(process.env.PDS_CHANNEL_ID);
        if (member.roles.cache.has(EnServiceRole)) {
            console.log(`${member.nickname} à déjà le rôle ${role.name}`)
        } else {
            await member.roles.add(process.env.SERVICE_ROLE_ID).then(console.log(`Ajout du rôle Service pour ${member.nickname}`));
            /*
            let DebServiceEmbed = new EmbedBuilder()
                .setColor(colorGreen)
                .setAuthor({ name: `Système Iris` })
                .setDescription(`Prise de service : **${member.nickname}**`)
            await suiviChannel.send({ embeds: [DebServiceEmbed], ephemera: false });
            */

        }
    }
    else {
        await member.roles.remove(role.id).then(console.log(`Retrait du rôle ${role.name} pour ${member.nickname}`));
        /*
        let FinServiceEmbed = new EmbedBuilder()
            .setColor(colorRed)
            .setAuthor({ name: `Système Iris` })
            .setDescription(`Fin de service :  **${member.nickname}**`)
        await suiviChannel.send({ embeds: [FinServiceEmbed], ephemeral: false });
        */
    }
});

module.exports = router;
