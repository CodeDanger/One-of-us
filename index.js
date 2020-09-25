/**
 * Module Imports
 */
require('dotenv').config({path: __dirname + '/.env'})

const { Client, Collection, DiscordAPIError , MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX, PERMISSION, GUILD, AVATAR } = require("./config.json");
const TOKEN = process.env['TOKEN'] ;
const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const db = require("quick.db");
const prefixs = new db.table("prefixs");

const { fixArgs } = require("./includes/argsChecker.js");
const { Console } = require("console");

/**
 * Client Events
 */
client.on("ready",async () => {
  console.log(`${client.user.username} ready!`);
  await client.user.setAvatar(AVATAR);
  await client.user.setActivity(`${client.guilds.cache.size} servers`,{type :"WATCHING"});
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  let gprefix = prefixs.get(`guild_${message.guild.id}`) ? prefixs.get(`guild_${message.guild.id}`) : PREFIX;
  
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(gprefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
  // check for private guild cmd

  if(command.private && command.private=="true"){

    if(parseInt(GUILD)!=message.guild.id){
      return false;
    }

  }

  // check for admin

  if (command.admin && command.admin == "true" && !message.member.permissions.has( PERMISSION ) && (message.guild.ownerID!=message.author.id) ){
    let adminsOnly = new MessageEmbed()
    .setTitle("One Of Us Help | Error")
    .setDescription("This command for admins only")
    .setColor("#FF0000");

    adminsOnly.setTimestamp();

    return message.channel.send(adminsOnly).catch(console.error);
  }

  args = await fixArgs(command,args);

  if (!args){
    let helpEmbed = new MessageEmbed()
    .setTitle("One Of Us Error")
    .setDescription("One Of Us Help | Error | Bad arguments")
    .setColor("#FF0000");

      helpEmbed.addField(
        `**${gprefix}${command.name} ${command.args ? `[${command.args}]` : ""}**`,
        `**${command.aliases ? `(${command.aliases})` : ""}** ${command.description}`,
        true
      );

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});
