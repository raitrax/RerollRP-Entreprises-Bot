const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post(`/`, async (req, res) => {
    let discordId = req.body.discordId;
    let newGrade = req.body.newGrade;
    let oldGrade = req.body.oldGrade;
    let guild, member, roleToAdd, roleToRemove;

    if (!discordId || !newGrade || !oldGrade) {
        res.status(400).json({ error: 'Missing parameter discordId or newGrade or oldGrade' });
        console.warn('Recruit - Missing parameter discordId or newGrade or oldGrade');
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
        roleToRemove = getRole(oldGrade)
        await member.roles.remove(roleToRemove).then(console.log(`Retrait du rôle ${oldGrade} pour ${member.nickname}`));
    } catch (err) {
        res.status(500).json({ error: 'Error removing role', errMsg: err });
        console.error(err);
        return;
    }

    try {
        roleToAdd = getRole(newGrade)
        await member.roles.add(roleToAdd).then(console.log(`Ajout du rôle ${newGrade} pour ${member.nickname}`));
    } catch (err) {
        res.status(500).json({ error: 'Error adding role', errMsg: err });
        console.error(err);
        return;
    }

    res.status(200).json({ msg: `${member.nickname} has been promoted` });
    console.log(`<${member.displayName} - ${member.id}> has been promoted ${oldGrade} > ${newGrade}`);
    return;
});
function getRole(grade) {
    let roleId;
    switch (grade) {
        case "Capitaine":
            roleId = process.env.CAP_ROLE_ID;
            break;
        case "Lieutenant":
            roleId = process.env.LTN_ROLE_ID;
            break;
        case "Sergent Chef":
            roleId = process.env.SGTCF_ROLE_ID;
            break;
        case "Sergent":
            roleId = process.env.SGT_ROLE_ID;
            break;
        case "Officier":
            roleId = process.env.OFF_ROLE_ID;
            break;
        case "Cadet":
            roleId = process.env.CAD_ROLE_ID;
            break;
        default:
            break;
    }
    return roleId;
}

module.exports = router;

