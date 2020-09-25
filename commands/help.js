const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const prefixs = new db.table("prefixs");
const {GUILD} = require("../config.json");

module.exports = {
  name: "help",
  aliases: ["h"],
  admin:"false",
  description: "Display all commands and descriptions",
  async execute(message) {
    let commands = message.client.commands.array();
    let gprefix = prefixs.get(`guild_${message.guild.id}`) ? prefixs.get(`guild_${message.guild.id}`) : message.client.prefix;

    let helpEmbed = new MessageEmbed()
      .setTitle("One Of Us Help")
      .setDescription("List of all commands")
      .setColor("#F8AA2A");

    if (message.guild.id != parseInt( GUILD )){
      commands = commands.filter ( function(cmd)
      {
              return ( (cmd.private==null || cmd.private=='false' )  );
      });
    }
    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${gprefix}${cmd.name} ${cmd.args ? `[${cmd.args}]` : ""}**`,
        `**${cmd.aliases ? `(${cmd.aliases})` : ""}** ${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
