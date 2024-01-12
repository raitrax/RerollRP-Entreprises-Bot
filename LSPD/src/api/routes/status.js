const express = require('express');
const router = express.Router();
require('dotenv').config();
const { StatusMsg } = require('../../dbObjects');
const { MessageManager, EmbedBuilder, Colors, AttachmentBuilder } = require('discord.js');

/**
 * status: ['start', 'error', 'reboot']
 * if reboot, time: [0-9]+ in minutes
 */
router.post('/', async (req, res) => {
	const status = req.body.status;
	const time = req.body.time;

	if (!status) {
		res.status(400).json({ error: 'Missing parameter status' });
		console.warn('Status : Missing parameter status');
		return;
	}

	if (!['start', 'error', 'reboot'].includes(status)) {
		res.status(400).json({ error: 'Status must be either \'start\', \'error\' or \'reboot\'' });
		console.warn('Status : Status must be either \'start\', \'error\' or \'reboot\'');
		return;
	}

	const existing_statusmsg = await StatusMsg.findOne();

	const messageManager = new MessageManager(await req.app.myClient.channels.fetch(process.env.STATUS_CHANNEL_ID));
	let image;
	const files = [];
	if (status === 'reboot') {
		files.push(new AttachmentBuilder('./src/assets/eclair-reroll.gif'));
		image = 'attachment://eclair-reroll.gif';
	}
	else if (status === 'error') {
		files.push(new AttachmentBuilder('./src/assets/reroll_off.png'));
		image = 'attachment://reroll_off.png';
	}
	else {
		files.push(new AttachmentBuilder('./src/assets/reroll.png'));
		image = 'attachment://reroll.png';
	}

	if (!existing_statusmsg) {
		const message = await messageManager.channel.send({ embeds: [getStatusEmbed(status, time, image)], files: files });

		await StatusMsg.upsert({
			id_message: message.id,
		});
	}
	else {
		try {
			const statusmsg_to_delete = await messageManager.fetch({ message: existing_statusmsg.id_message });
			await statusmsg_to_delete.delete();
		}
		catch (error) {
			console.error(error);
		}

		const message = await messageManager.channel.send({ embeds: [getStatusEmbed(status, time, image)], files: files });

		await existing_statusmsg.update({
			id_message: message.id,
		});
	}

	res.json({});
	res.status(200);
	console.log(`Status : ${status} message sent`);
});

module.exports = router;

const getStatusEmbed = (status, time, image) => {
	if (status === 'reboot') {
		return new EmbedBuilder()
			.setColor(Colors.Yellow)
			.setTitle('Le serveur va bientôt redémarrer')
			.setDescription(time && time > 0 ? `La tempête arrive dans **${time}** minutes!` : 'Le redémarrage est imminent!')
			.setThumbnail(image)
			.setTimestamp(new Date());
	}

	if (status === 'error') {
		return new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Le serveur vient de crash')
			.setDescription('Veuillez patienter, nos équipes sont dessus!')
			.setThumbnail(image)
			.setTimestamp(new Date());
	}

	return new EmbedBuilder()
		.setColor(Colors.Green)
		.setTitle('Le serveur est opérationnel!')
		.setDescription('Bon jeu!')
		.setThumbnail(image)
		.setTimestamp(new Date());
};