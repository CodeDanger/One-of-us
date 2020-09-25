const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const premium = new db.table("premium");

module.exports = {
  name: "login",
  aliases: ["lg"],
  admin:"true",
  args:["Serial key"],
  description: "Login this guild as premium",
  async execute(msg,args) {

    let embedmain = new MessageEmbed();

    if ( args.length<1 )
    {
        
    embedmain.setTitle("One Of Us Help | Error")
    .setDescription("Please enter the serial key")
    .setColor("#FF0000");

    embedmain.setTimestamp();

    return msg.channel.send(embedmain).catch(console.error);

    }

    if( !premium.get(  args[0]  ) || (premium.get(  args[0]  ) && premium.get(  args[0]  ).guild != "empty" ) )
    {
                
    embedmain.setTitle("One Of Us Help | Error")
    .setDescription("Serial not valid please try again")
    .setColor("#FF0000");

    embedmain.setTimestamp();

    return msg.channel.send(embedmain).catch(console.error);

    } 

    premium.set(  args[0]  , {guild: msg.guild.id} );

      embedmain.setTitle("One Of Us premium | change")
      .setDescription(msg.guild.name)
      .setColor("#00FF00")
      .addField(
        '**Serial activated**',
        '`` Now you can have unlimited rooms and so on ``',
        true
      );
    embedmain.setTimestamp();

    return msg.channel.send(embedmain).catch(console.error);
  }
};
