const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const premium = new db.table("premium");

function generateHash(length=15) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQ&*()_+=/.RSTUVWXYZabcdefghijklmno@#$pqrstuvwxyz0123456789!%^,';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters[Math.floor(Math.random() * charactersLength)];
    }
    return result;
 }

 
 
module.exports = {
  name: "addkey",
  aliases: ["ak"],
  admin:"true",
  private:"true",
  description: "Create serial key for users of bot private just for owner",
  async execute(msg) {

    var key = '';
    do{
        key = generateHash();
    }
    while( premium.get(  key  ) );

    premium.set(  key  , {guild:"empty"} );


    let prefixEmbed = new MessageEmbed()
      .setTitle("One Of Us addKey | generate")
      .setDescription(msg.guild.name)
      .setColor("#00FF00")
      .addField(
        '**The generated key is**',
        '``'+key+'``',
        true
      );
    prefixEmbed.setTimestamp();

    return msg.author.send(prefixEmbed).catch(console.error);
  }
};
