const express = require('express');
require('dotenv').config();
const router = express.Router();

router.post("/", async (req, res) => {
	let discordId = req.body.discordId;
	let guild, member, msgAnnonce;

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

	const headers = {
		Authorization: `Bearer ${process.env.API_REROLL_TOKEN}`,
	};
	const response = await fetch(`https://api.reroll-rp.fr/v2/character/${member.id}`, {
		headers,
	});
	try {
		const character = await response.json();
		if (character.error) {
			if (character.error.code == 404) {
				res.status(404).json({ error: 'Error fetching character', errMsg: character.error });
				console.log(`recruit fetchData - Joueur ${member.displayName} (${member.id}) non trouvé!`);
				return;
			}
		}

		msgAnnonce = `:new: Bienvenue : ${character.grade} **${character.CharacterName}**`;
		const annonceChannel = await req.app.myClient.channels.cache.get(process.env.ANNONCE_CHANNEL_ID);
		await annonceChannel.send({ content: msgAnnonce, ephemeral: false });

		res.status(200).json({ msg: 'User has been added to the job' });
		console.log(`<${member.displayName}> - <${member.id}> has been added to the job ${jobName}`);
		return;
	}
	catch (error) {
		console.error(error);
		return interaction.editReply({ content: 'Veuillez réessayer plus tard', ephemeral: true });
	}
});

module.exports = router;
