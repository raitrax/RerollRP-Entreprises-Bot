const { Events, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');
const { json } = require('sequelize');
require('dotenv').config();

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(newMember, oldMember) {

		const addedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
		if (addedRoles.size > 0) {
			if (process.env.LISTE_GRADE.includes(addedRoles.map(r => r.name))) {
				console.log(`The roles ${addedRoles.map(r => r.name)} was choosen add`);
				const effectifChannel = newMember.client.channels.cache.get(process.env.EFFECTIF_CHANNEL_ID);
				//await effectifLspd(effectifChannel, newMember.client, process.env.LISTE_GRADE);
			}
			console.log(`The roles ${addedRoles.map(r => r.name)} were added from ${oldMember.displayName}.`);

		}

		// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
		const removedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
		if (removedRoles.size > 0) {
			if (process.env.LISTE_GRADE.includes(removedRoles.map(r => r.name))) {
				console.log(`The roles ${removedRoles.map(r => r.name)} was choosen remove`);
				const effectifChannel = oldMember.client.channels.cache.get(process.env.EFFECTIF_CHANNEL_ID);
				//await effectifLspd(effectifChannel, oldMember.client, process.env.LISTE_GRADE);
			}
			console.log(`The roles ${removedRoles.map(r => r.name)} were removed to ${newMember.displayName}.`);

		}

		if (newMember.roles.cache.has(process.env.SERVICE_ROLE_ID) || oldMember.roles.cache.has(process.env.SERVICE_ROLE_ID)) {
			let txtActivity;
			let currentMember;
			let countPDS;
			// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
			const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
			if (removedRoles.size > 0) {
				countPDS = oldMember.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
				currentMember = oldMember;
			}

			// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
			const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
			if (addedRoles.size > 0) {
				countPDS = newMember.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
				currentMember = newMember;
			}
			if (countPDS != null) {
				txtActivity = `${countPDS.size} personne(s) en service`

			} else {
				txtActivity = `0 personne(s) en service`
			}
			console.log(txtActivity);

			const PDSChannel = currentMember.client.channels.cache.get(process.env.PDS_CHANNEL_ID);
			const guild = currentMember.client.guilds.cache.get(process.env.GUILD_ID); // puppets server id
			await guild.members.fetch();
			const usersWithRole = guild.roles.cache.get(process.env.SERVICE_ROLE_ID).members;
			//await listService(PDSChannel, usersWithRole);

			currentMember.client.user.setActivity({ name: txtActivity, type: ActivityType.Custom });
		}
	},
};
const effectifLspd = async (effectifChannel, client, listeGrade) => {
	await effectifChannel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});
	// Obtenir la guilde actuelle
	const guild = client.guilds.cache.get(process.env.GUILD_ID);
	await guild.members.fetch();
	// Obtenir la liste des rôles de la guilde
	const roles = guild.roles.cache;
	//console.log(roles);
	let effectifTXT = "```md";
	for (const role of roles) {
		if (listeGrade.includes(role[1].name)) {
			//console.log(role[1].name);
			const members = role[1].members.map(m => m)
			effectifTXT += `\n${role[1].name} :\n`;
			console.log(role[1].name.length)
			for (let index = 0; index < role[1].name.length + 2; index++) {
				effectifTXT += `=`;
			}
			effectifTXT += `\n`;
			for (const member of members) {
				effectifTXT += `- ${member.nickname}\n`;
			}
		}
	}
	effectifTXT += "```";

	await effectifChannel.send(effectifTXT);
	//console.log(effectifTXT);
};

const listService = async (PDSChannel, usersWithRole) => {
	let listLead = [];
	let listCap = [];
	let listLtn = [];
	let listSC = [];
	let listSgt = [];
	let listOff = [];
	let listCdt = [];

	let listTXTLead = "";
	let listTXTHG = "";
	let listTXTCap = "";
	let listTXTLtn = "";
	let listTXTSC = "";
	let listTXTSgt = "";
	let listTXTOff = "";
	let listTXTCdt = "";
	let listTXTAgents = "";
	let compteurAgents = 0;
	let compteurHG = 0;
	let compteurTotal = 0;

	let arrayGradeID = JSON.parse(process.env.LISTE_GRADE_ID)
	let obj = [];
	for (const gradeID of arrayGradeID) {
		console.log(gradeID);
		obj.push({ roleid: gradeID, listgrad: [], compteur: 0 });
	}
	console.log(obj);

	for (const user of usersWithRole) {
		for (const info of user) {
			if (info.user != null) {
				const regex = /[0-9]+/;
				const input = info.nickname;
				const match = regex.exec(input);
				let matric = 100;
				if (match != null) {
					matric = match[0];
				}

				let temp = `- <@${info.user.id}>\n`;
				console.log(temp);
				//console.log(info._roles);



				const isCap = info._roles.includes(process.env.CAP_ROLE_ID);
				const isLtn = info._roles.includes(process.env.LTN_ROLE_ID);
				const isSC = info._roles.includes(process.env.SGTCF_ROLE_ID);
				const isSgt = info._roles.includes(process.env.SGT_ROLE_ID);
				const isOff = info._roles.includes(process.env.OFF_ROLE_ID);
				const isCdt = info._roles.includes(process.env.CAD_ROLE_ID);
				const isLead = info._roles.includes(process.env.SERVICE_LEAD_ROLE_ID);
				let agentEnService = { label: "", mat: 0 };
				agentEnService.label = temp;
				agentEnService.mat = matric;
				compteurTotal = compteurTotal + 1;
				for (const t of obj) {
					if (info._roles.includes(t.roleid)) {
						t.listgrad.push(agentEnService);
						t.compteur++;
					}
				}
				switch (true) {
					case isLead:
						listLead.push(agentEnService);
						break;
					case isCap:
						compteurHG = compteurHG + 1;
						listCap.push(agentEnService);
						break;
					case isLtn:
						compteurHG = compteurHG + 1;
						listLtn.push(agentEnService);
						break;
					case isSC:
						compteurAgents = compteurAgents + 1;
						listSC.push(agentEnService);
						break;
					case isSgt:
						compteurAgents = compteurAgents + 1;
						listSgt.push(agentEnService);
						break;
					case isOff:
						compteurAgents = compteurAgents + 1;
						listOff.push(agentEnService);
						break;
					case isCdt:
					default:
						compteurAgents = compteurAgents + 1;
						listCdt.push(agentEnService);
						break;
				}
			}
		}
	}

	console.log(listCap);
	listTXTLead = await sorter(listLead);
	listTXTCap = await sorter(listCap);
	listTXTLtn = await sorter(listLtn);
	listTXTSC = await sorter(listSC);
	listTXTSgt = await sorter(listSgt);
	listTXTOff = await sorter(listOff);
	listTXTCdt = await sorter(listCdt);

	console.log(listTXTCap);

	listTXTHG = listTXTCap + listTXTLtn;
	listTXTAgents = listTXTSC + listTXTSgt + listTXTOff + listTXTCdt;

	if (listTXTLead == "") {
		listTXTLead = "Aucun";
	}
	if (listTXTHG == "") {
		listTXTHG = "Aucun";
	}
	if (listTXTAgents == "") {
		listTXTAgents = "Aucun";
	}

	const embed = new EmbedBuilder()
		.setColor("#EFFF00")
		.setAuthor({ name: `Système Iris` })
		.setTitle('Liste des personnes en services')
		//.setDescription(`Pour indiquer que vous participer à l'opération, appuyer sur le bouton "Opération"`)
		.addFields([
			{ name: `Lead`, value: '' + listTXTLead + '', inline: true },
			{ name: `HG (${compteurHG})`, value: '' + listTXTHG + '', inline: true },
			{ name: `Agents (${compteurAgents})`, value: '' + listTXTAgents + '', inline: false },
			{ name: `Total en service`, value: '' + compteurTotal + '', inline: false }
		])
	let msgfind = false;
	await PDSChannel.messages.fetch().then(async msg => {
		///console.log(msg);

		msg.forEach(async (m) => {
			if (m == null) {
				return;
			}
			m.embeds.forEach(async embedSearch => {
				if (embedSearch.title == "Liste des personnes en services") {
					m.edit({ embeds: [embed], ephemeral: false });
					msgfind = true;
				}
			})
		});
	});
	if (!msgfind) {
		PDSChannel.send({ embeds: [embed], ephemeral: false });

	}
}
const sorter = async (list) => {
	let listTXT = "";
	if (list != []) {
		const sortedlist = list.sort((a, b) => {
			if (a.mat !== b.mat) {
				return a.mat - b.mat;
			}
			return a.label.localeCompare(b.label);
		});
		for (const l of sortedlist) {
			listTXT += l.label;
		}
	}
	return listTXT;
}