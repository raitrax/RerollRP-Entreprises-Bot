const express = require('express');
require('dotenv').config();
const router = express.Router();
const { User } = require('../../dbObjects');

router.post('/add', async (req, res) => {
	let discordId = req.body.discordId;
	const steamId = req.body.steamId;
	const roleId = req.body.roleId;
	let guild, member;

	if (!discordId && !steamId) {
		res.status(400).json({ error: 'Missing parameter discordId or steamId' });
		console.warn('Role add - Missing parameter discordId or steamId');
		return;
	}

	if (!roleId) {
		res.status(400).json({ error: 'Missing parameter roleId' });
		console.warn('Role add - Missing parameter roleId');
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

	if (steamId) {
		const user = await User.findOne({ where: { license: steamId } });

		if (!user) {
			res.status(400).json({ error: 'No user found with this steamId' });
			console.warn('Role add - No user found with this steamId');
			return;
		}
		discordId = user.discord_id;
	}

	try {
		member = await guild.members.fetch({ user: discordId, force: true });
	}
	catch (err) {
		res.status(500).json({ error: 'Error fetching member', errMsg: err });
		console.error(err);
		return;
	}

	if (member.roles.cache.some(r => r.id === roleId)) {
		res.status(200).json({ msg: 'User already has the role' });
		return;
	}

	try {
		member = await member.roles.add(roleId);
	}
	catch (err) {
		res.status(500).json({ error: 'Error setting role', errMsg: err });
		console.error(err);
		return;
	}

	if (member.roles.cache.some(r => r.id === roleId)) {
		res.status(200).json({ msg: 'Role added to user' });
		console.log(`Role ${roleId} added to ${member.displayName} - ${member.id}`);
		return;
	}

	res.status(500).json({ error: 'Something went wrong' });
	console.warn('Role add - Something went wrong');
	return;
});

router.post('/remove', async (req, res) => {
	let discordId = req.body.discordId;
	const steamId = req.body.steamId;
	const roleId = req.body.roleId;
	let guild, member;

	if (!discordId && !steamId) {
		res.status(400).json({ error: 'Missing parameter discordId or steamId' });
		console.warn('Role remove - Missing parameter discordId or steamId');
		return;
	}

	if (!roleId) {
		res.status(400).json({ error: 'Missing parameter role' });
		console.warn('Role remove - Missing parameter roleId');
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

	if (steamId) {
		const user = await User.findOne({ where: { license: steamId } });

		if (!user) {
			res.status(400).json({ error: 'No user found with this steamId' });
			console.warn('Role remove - No user found with this steamId');
			return;
		}
		discordId = user.discord_id;
	}

	try {
		member = await guild.members.fetch({ user: discordId, force: true });
	}
	catch (err) {
		res.status(500).json({ error: 'Error fetching member', errMsg: err });
		console.error(err);
		return;
	}

	if (!member.roles.cache.some(r => r.id === roleId)) {
		res.status(200).json({ msg: 'User already do not have the role' });
		return;
	}

	try {
		member = await member.roles.remove(roleId);
	}
	catch (err) {
		res.status(500).json({ error: 'Error while removing role', errMsg: err });
		console.error(err);
		return;
	}

	if (!member.roles.cache.some(r => r.id === roleId)) {
		res.status(200).json({ msg: 'Role removed from user' });
		console.log(`Role ${roleId} removed from ${member.displayName} - ${member.id}`);
		return;
	}

	res.status(500).json({ error: 'Something went wrong' });
	console.warn('Role remove - Something went wrong');
	return;
});

module.exports = router;
