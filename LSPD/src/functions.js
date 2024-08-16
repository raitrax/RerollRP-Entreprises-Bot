const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  sorter: async function (list) {
    let listTXT = "";
    if (list !== null) {
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
  },
  listService: async function (PDSChannel, usersWithRole) {
    const listLead = [];
    const listCap = [];
    const listLtn = [];
    const listInsp = [];
    const listSC = [];
    const listSgt = [];
    const listOffSup = [];
    const listOff = [];
    const listCdt = [];

    let listTXTLead = "";
    let listTXTHG = "";
    let listTXTCap = "";
    let listTXTLtn = "";
    let listTXTInsp = "";
    let listTXTSC = "";
    let listTXTSgt = "";
    let listTXTOffSup = "";
    let listTXTOff = "";
    let listTXTCdt = "";
    // let listTXTAgents = "";
    let compteurAgents = 0;
    let compteurHG = 0;
    let compteurInsp = 0;
    let compteurSC = 0;
    let compteurSgt = 0;
    let compteurOffSup = 0;
    let compteurOff = 0;
    let compteurTotal = 0;

    const arrayGradeID = JSON.parse(process.env.LISTE_GRADE_ID);
    const obj = [];
    for (const gradeID of arrayGradeID) {
      obj.push({ roleid: gradeID, listgrad: [], compteur: 0 });
    }

    for (const user of usersWithRole) {
      const info = user[1];
      if (info.user !== null) {
        const regex = /[0-9]+/;
        const input = info.nickname;
        const match = regex.exec(input);
        let matric = 100;
        if (match !== null) {
          matric = match[0];
        }
        const temp = `- <@${info.user.id}>\n`;

        const isCap = info._roles.includes(process.env.CAP_ROLE_ID);
        const isLtn = info._roles.includes(process.env.LTN_ROLE_ID);
        const isInsp = info._roles.includes(process.env.INSP_ROLE_ID);
        const isSC = info._roles.includes(process.env.SGTCF_ROLE_ID);
        const isSgt = info._roles.includes(process.env.SGT_ROLE_ID);
        const isOffSup = info._roles.includes(process.env.OFF_SUP_ROLE_ID);
        const isOff = info._roles.includes(process.env.OFF_ROLE_ID);
        const isCdt = info._roles.includes(process.env.CAD_ROLE_ID);
        const isLead = info._roles.includes(process.env.SERVICE_LEAD_ROLE_ID);
        const agentEnService = { label: "", mat: 0 };
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
          case isInsp:
            compteurInsp = compteurInsp + 1;
            listInsp.push(agentEnService);
            break;
          case isSC:
            compteurSC = compteurSC + 1;
            listSC.push(agentEnService);
            break;
          case isSgt:
            compteurSgt = compteurSgt + 1;
            listSgt.push(agentEnService);
            break;
          case isOffSup:
            compteurOffSup = compteurOffSup + 1;
            listOffSup.push(agentEnService);
            break;
          case isOff:
            compteurOff = compteurOff + 1;
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

    listTXTLead = await module.exports.sorter(listLead);
    listTXTCap = await module.exports.sorter(listCap);
    listTXTLtn = await module.exports.sorter(listLtn);
    listTXTInsp = await module.exports.sorter(listInsp);
    listTXTSC = await module.exports.sorter(listSC);
    listTXTSgt = await module.exports.sorter(listSgt);
    listTXTOffSup = await module.exports.sorter(listOffSup);
    listTXTOff = await module.exports.sorter(listOff);
    listTXTCdt = await module.exports.sorter(listCdt);

    listTXTHG = listTXTCap + listTXTLtn;
    // listTXTAgents = listTXTInsp + listTXTSC + listTXTSgt + listTXTOffSup + listTXTOff + listTXTCdt;

    if (listTXTLead === "") {
      listTXTLead = "Aucun";
    }
    if (listTXTHG === "") {
      listTXTHG = "Aucun";
    }
    if (listTXTInsp === "") {
      listTXTInsp = "Aucun";
    }
    if (listTXTSC === "") {
      listTXTSC = "Aucun";
    }
    if (listTXTSgt === "") {
      listTXTSgt = "Aucun";
    }
    if (listTXTOffSup === "") {
      listTXTOffSup = "Aucun";
    }
    if (listTXTOff === "") {
      listTXTOff = "Aucun";
    }
    if (listTXTCdt === "") {
      listTXTCdt = "Aucun";
    }

    const embed = new EmbedBuilder()
      .setColor("#EFFF00")
      .setAuthor({ name: `Système Iris` })
      .setTitle("Liste des personnes en services");
    //.setDescription(`Pour indiquer que vous participer à l'opération, appuyer sur le bouton "Opération"`)
    embed.addFields({ name: `Lead`, value: `${listTXTLead}`, inline: true });
    embed.addFields({
      name: `HG (${compteurHG})`,
      value: `${listTXTHG}`,
      inline: true,
    });
    embed.addFields({
      name: `Inspecteur (${compteurInsp})`,
      value: `${listTXTInsp}`,
      inline: true,
    });
    embed.addFields({
      name: `Sergent Chef (${compteurSC})`,
      value: `${listTXTSC}`,
      inline: true,
    });
    embed.addFields({
      name: `Sergent (${compteurSgt})`,
      value: `${listTXTSgt}`,
      inline: true,
    });
    embed.addFields({
      name: `Officier Superviseur (${compteurOffSup})`,
      value: `${listTXTOffSup}`,
      inline: true,
    });
    embed.addFields({
      name: `Officier (${compteurOff})`,
      value: `${listTXTOff}`,
      inline: true,
    });
    embed.addFields({
      name: `Cadet (${compteurAgents})`,
      value: `${listTXTCdt}`,
      inline: true,
    });
    embed.addFields({
      name: `Total en service`,
      value: `${compteurTotal}`,
      inline: false,
    });

    let msgfind = false;
    await PDSChannel.messages.fetch().then(async (msg) => {
      ///console.log(msg);

      msg.forEach(async (m) => {
        if (m === null) {
          return;
        }
        m.embeds.forEach(async (embedSearch) => {
          if (embedSearch.title === "Liste des personnes en services") {
            m.edit({ embeds: [embed], ephemeral: false });
            msgfind = true;
          }
        });
      });
    });
    if (!msgfind) {
      PDSChannel.send({ embeds: [embed], ephemeral: false });
    }
  },
};
