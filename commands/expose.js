const { MessageEmbed } = require("discord.js");
const { isGameRuning ,isMainChannel ,isPlayer ,getExpose , isPlayerLive , setExpose , isKiller , getRunningPlayer , startNewRound , killPlayer, givePoint } = require("../includes/GameManager.js");
var msgTimers = [];

module.exports = {
  name: "expose",
  aliases: ["e"],
  admin:"false",
  description: "Order for emergancy meeting for expose killer",
  async  execute(msg,args) {

    if (await isGameRuning(msg.guild.id) && await isPlayer(msg.guild.id,msg.author.id) && await isPlayerLive(msg.guild.id,msg.author.id) )
    {
        let msgex = new MessageEmbed();

        if(!await isMainChannel( msg.guild.id,msg.channel ) )
        {

            msgex.setTitle("One Of Us Error Expose | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Please type command in the channel game start on``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgex).catch(console.error);
        }

        if(await getExpose(msg.guild.id)==true){

            msgex.setTitle("One Of Us Error Expose | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``There is already voting``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgex).catch(console.error);
        }

        if (!msg.mentions.users || !msg.mentions.users.size==1)
        {
            msgex.setTitle("One Of Us Error Expose | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Please mention the player``',
              true
            )
            .setTimestamp();
            return msg.channel.send(msgex).catch(console.error);
        }
        
       
        if(! await isPlayer(msg.guild.id,msg.mentions.users.first().id) )
        {
            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``Only players can be killed``',
              true
            )
            .setTimestamp();

            return msg.channel.send(msgkill).catch(console.error);
        }

        if( msg.author.id == msg.mentions.users.first().id )
        {
            msgkill.setTitle("One Of Us Error Kill | Game")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Error**',
              '``You Can not kill your self``',
              true
            )
            .setTimestamp();

            return msg.channel.send(msgkill).catch(console.error);
        }

        await setExpose(msg.guild.id,true);

        msgex.setTitle("One Of Us Expose | Game")
        .setDescription(msg.guild.name)
        .setColor("#F8AA2A")
        .addField(
          '**Exposing by '+msg.author.tag+'**',
          'the killer is ``'+msg.mentions.users.first().tag+'`` \n **Vote will end after 7 sec **',
          true
        )
        .setTimestamp();
        await msg.channel.send(msgex).then(async(remsg)=>{
            await remsg.react("✅");
            await remsg.react("❌");
    
            const filter = async (reaction, user)=>{return ((reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && await isPlayer(msg.guild.id,user.id));};
            await remsg.awaitReactions(filter, { time: 1000*7 })
            .then(async (collected) => {

                var okay = collected.filter( (reaction, user)=>{return reaction.emoji.name=='✅'; } ).size ; 
                var no = collected.filter( (reaction, user)=>{return reaction.emoji.name=='❌'; } ).size ; 

                msgex = new MessageEmbed();        
                if (okay>no){
    
                    await killPlayer(msg,msg.mentions.users.first().id,true);
    
                    if(await isKiller( msg.guild.id, msg.mentions.users.first().id ) )
                    {   

                      await givePoint(msg.guild.id,msg.author.id);

                        await msgex.setTitle("One Of Us Expose | Game")
                        .setDescription(msg.guild.name)
                        .setColor("#F8AA2A")
                        .addField(
                          '**Exposing vote accepted**',
                          '**'+msg.mentions.users.first().tag+' was the killer**',
                          true
                        )
                        .setTimestamp();
                        await msg.channel.send(msgex).catch(console.error);
                        await startNewRound(msg); 
    
                    }else{ //else wasn't killer
    
                    msgex.setTitle("One Of Us Expose | Game")
                    .setDescription(msg.guild.name)
                    .setColor("#F8AA2A")
                    .addField(
                      '**Exposing vote accepted**',
                      '**'+msg.mentions.users.first().tag+' was not the killer**',
                      true
                    )
                    .setTimestamp();
                    await msg.channel.send(msgex).catch(console.error);
    
                    }
                }else{// else rejected kick
                    msgex.setTitle("One Of Us Expose | Game")
                    .setDescription(msg.guild.name)
                    .setColor("#F8AA2A")
                    .addField(
                      '**Exposing vote rejected**',
                      '**No one gonna killed**',
                      true
                    )
                    .setTimestamp();
                    await msg.channel.send(msgex).catch(console.error);
                }            
                if(await isGameRuning(msg.guild.id)){

                  await setExpose(msg.guild.id,false);
                
                }

            })
            .catch(console.error);
    
    
        }).catch(console.error);
    
        }
    }

};
