const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.id;
    let guild, member;

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Recruit - Missing parameter discordId');
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
    //add all permission to the user by fetching data from the reroll database

    res.status(200).json({ msg: 'User has been added to the job' });
    console.log(`<${member.displayName} - ${member.id}> has been added to the job ${jobName}`);
    return;
});

module.exports = router;
