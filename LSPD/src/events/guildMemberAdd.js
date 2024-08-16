const { Events, ThreadAutoArchiveDuration } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const headers = {
      Authorization: `Bearer ${process.env.API_REROLL_TOKEN}`,
    };
    let response;
    try {
      response = await fetch(
        `https://api.reroll-rp.fr/v2/character/discord/${member.id}`,
        {
          headers,
        },
      );
    } catch (error) {
      console.error(error);
      return;
    }
    const character = await response.json();
    if (character?.error?.code === 404) {
      console.error(`recruit fetchData - Joueur <@${member.id}> non trouvé!`);
      return false;
    }
    if (character.job.id === "lspd") {
      const channel = member.guild.channels.cache.find(
        (channel) => channel.id === process.env.FORMATION_CHANNEL_ID,
      );
      const thread = await channel.threads.create({
        name: `00 - ${character.charinfo.firstname} ${character.charinfo.lastname}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        reason: "Fiche Cadet",
      });
      thread.send("```Permis voiture```");
      thread.send("```Permis moto```");
      thread.send("```Permis PL```");
      thread.send("```Visite médicale```");
      thread.send("```Accueil et information de base```");
      thread.send("```Matériel obligatoire```");
      thread.send("```PPA```");
      thread.send("```Habilitation FAP```");
      thread.send("```Habilitation MP5```");
      thread.send("```Utilisation radio et code 10```");
      thread.send("```Base d'un contrôle```");
      thread.send("```Conduite```");
      thread.send("```Barrage routier```");
      thread.send("```Mise en cellule```");
      thread.send("```Formation Pit```");
      thread.send("```Simulation lincoln```");
    } else {
      console.error(
        `id: ${member.id}\n--- name: ${member.displayName} n'est pas au LSPD`,
      );
    }
  },
};
