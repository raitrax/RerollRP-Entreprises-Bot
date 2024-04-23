const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let newGrade = req.body.newGrade;
    let oldGrade = req.body.oldGrade;
    let guild, member, roleToAdd, roleToRemove;

    if (!discordId) {
        res.status(400).json({ error: 'Missing parameter discordId' });
        console.warn('Recruit - Missing parameter discordId');
        return;
    }
    if (!newGrade) {
        res.status(400).json({ error: 'Missing parameter newGrade' });
        console.warn('Recruit - Missing parameter newGrade');
        return;
    }
    if (!oldGrade) {
        res.status(400).json({ error: 'Missing parameter newGrade' });
        console.warn('Recruit - Missing parameter newGrade');
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

    try {
        let roleToRemove;
        switch (grade) {
            case "Capitaine":
                roleToRemove = process.env.CAP_ROLE_ID;
                break;
            case "Lieutenant":
                roleToRemove = process.env.LTN_ROLE_ID;
                break;
            case "Sergent Chef":
                roleToRemove = process.env.SGTCF_ROLE_ID;
                break;
            case "Sergent":
                roleToRemove = process.env.SGT_ROLE_ID;
                break;
            case "Officier":
                roleToRemove = process.env.OFF_ROLE_ID;
                break;
            case "Cadet":
                roleToRemove = process.env.CAP_ROLE_ID;
                break;
            default:
                break;
        }

    } catch (error) {
        res.status(500).json({ error: 'Error finding roles', errMsg: err });
        console.error(err);
        return;
    }

    try {
        getRole(oldGrade, roleToRemove);
    } catch (err) {
        res.status(500).json({ error: 'Error removing role', errMsg: err });
        console.error(err);
        return;
    }

    try {
        getRole(oldGrade, roleToAdd);

    } catch (err) {
        res.status(500).json({ error: 'Error adding role', errMsg: err });
        console.error(err);
        return;
    }

    res.status(200).json({ msg: 'User has been added to the job' });
    console.log(`<${member.displayName} - ${member.id}> has been added to the job ${jobName}`);
    return;
});

module.exports = router;
function getRole(grade, role) {
    switch (grade) {
        case "Capitaine":
            role = process.env.CAP_ROLE_ID;
            break;
        case "Lieutenant":
            role = process.env.LTN_ROLE_ID;
            break;
        case "Sergent Chef":
            role = process.env.SGTCF_ROLE_ID;
            break;
        case "Sergent":
            role = process.env.SGT_ROLE_ID;
            break;
        case "Officier":
            role = process.env.OFF_ROLE_ID;
            break;
        case "Cadet":
            role = process.env.CAP_ROLE_ID;
            break;
        default:
            break;
    }
} 