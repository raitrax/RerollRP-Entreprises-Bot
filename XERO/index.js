const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, DiscordAPIError, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'src', 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const cronsPath = path.join(__dirname, 'src', 'crons');
const cronsFiles = fs.readdirSync(cronsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  console.log('commands:', command.data.name);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
  else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  console.log('events:', event.name);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    client.on(event.name, (...args) => {
      try {
        event.execute(...args);
      }
      catch (error) {
        if (error instanceof DiscordAPIError && error.code === 10062) {
          console.error('Interaction inconnue: ', error.url);
        }
        else {
          console.error(error);
        }
      }
    });
  }
}

client.login(process.env.DISCORD_TOKEN).then(() => {

});
