const { MessageEmbed }=require("discord.js");
const { GUILD,KILLED } = require("../config.json");
const db = require("quick.db");
const premium = new db.table("premium");
const win = new db.table("win");
let games = [];
let pending = [];
async function getWinnerId(ta) {
    var max = 0 ;
    var id = false ;
    for(const [tid,val] of Object.entries(ta) )
    {
        if (val>max)
        {
            id = tid ;

        }else if(val == max && max!=0){
            return false;
        
        }
    }
    return id
}


module.exports = {

    async stopGame(msg){
        
        let endmsg = new MessageEmbed()
        .setTitle("One Of Us Game | Status")
        .setDescription(msg.guild.name)
        .setColor("#F8AA2A")
        .addField(
        '**Game Stopped**',
        '```'+msg.author.tag+'``` stopped the game',
        false
        ).
        setTimestamp();
        await games[msg.guild.id].main_channel.send(endmsg).catch(console.error);
 
        for(const element of games[msg.guild.id].rooms.values()){
            await element.delete().catch(err=>msg.reply(err.message));
        }

        games[msg.guild.id] = null;
    },

    async getPendingUsers(sid){
        return pending[sid];
    },

    async addPendingUser(sid,id){
        if (!pending[sid]){
            pending[sid] = [];
        }
        pending[sid].push(id);
    },
    async resetPending(sid){
        pending[sid] = [];
    },
    
    async endGame(msg){

        let sid = msg.guild.id;
        let winner = {tag:"No One",id:false};

        if(games[sid].points.size!=0){
            winner = await getWinnerId(games[sid].points);
            winner = msg.guild.members.cache.get(winner).user;
        }

        let endmsg = new MessageEmbed()
        .setTitle("One Of Us Game | Status")
        .setDescription(msg.guild.name)
        .setColor("#00FF00")
        .addField(
        '**Game finished**',
        ' The winner is```'+winner.tag+'```',
        false
        ).
        setTimestamp();
        await games[sid].main_channel.send(endmsg).catch(console.error);
 
        for(const element of games[sid].rooms.values()){
            await element.delete().catch(err=>msg.reply(err.message));
        }

        if(winner.id && winner.id != false )
        {
            await win.set( winner.id , {score:( win.get(winner.id)&&win.get(winner.id)|| 0 ) +1 });
        }

        games[sid] = null;
        
        delete(winner);
        delete(sid);
        delete(endmsg);

    },
    async startNewRound(msg)
    {

        if ( games[msg.guild.id].round == games[msg.guild.id].max_rounds ){

            return await module.exports.endGame( msg ) ;
        
        }
        
        var kid = games[msg.guild.id].killer;
        var sid = msg.guild.id;

        var newkiller = games[sid].players[Math.floor(Math.random() * games[sid].players.length)];
        
        games[sid].killer = newkiller ; 

        await msg.guild.members.cache.get(newkiller).send("You are the killer");

        delete( newkiller );

        games[sid].remain = games[sid].players.length;
        
        games[sid].dead = [];

        games[sid].round = games[sid].round + 1 ;
        

        let newround = new MessageEmbed()
        .setTitle("One Of Us Game | Status")
        .setDescription(msg.guild.name)
        .setColor("#F8AA2A")
        .addField(
        '**Round '+(games[sid].round)+' Started**',
        ' The killer was ```'+msg.guild.members.cache.get(kid).user.tag+'```',
        false
        ).
        setTimestamp();
        await games[sid].main_channel.send(newround).catch(console.error);
        
        delete( sid );
        delete( kid );
    },
    async isKillingChannel(sid,channel){
        return games[sid].rooms.includes(channel);
    },
    async isPlayer(sid,pid)
    {
        return games[sid].players.includes(pid)
    },
    async isMainChannel(sid,channel)
    {
        return games[sid].main_channel==channel;
    },
    async isKiller(sid,pid)
    {
        return games[sid].killer==pid;
    },
    async givePoint(sid,pid)
    {
        games[sid].points[pid]=games[sid].points[pid]&&(games[sid].points[pid]+1) || 1;
    },
    async getRunningPlayer(sid)
    {
        return games[sid].players;
    },
    async isPlayerLive(sid,pid)
    {
        return !games[sid].dead.includes(pid);
    },
    async killPlayer(datmsg,pid,without){
        
        var msg = datmsg;
        
        var kid = msg.author.id;
        var sid = msg.guild.id;

        games[sid].remain = games[sid].remain-1;
        games[sid].dead.push(pid);
        let killmsg = new MessageEmbed()
        .setTitle("One Of Us Game | Status")
        .setDescription(msg.guild.name)
        .setColor("#F8AA2A")
        .addField(
        '**Player Died**',
        '```'+msg.guild.members.cache.get(pid).user.tag+'```',
        false
        )
        .setImage(KILLED)
        .setTimestamp();
        await msg.channel.send(killmsg).catch(console.error);
        
        if(games[sid].remain==1){
            if(!without || without==null ){
                games[sid].points[kid] = games[sid].points[kid] && (games[sid].points[kid]+1) || 1;
            }
            await module.exports.startNewRound(msg);
        }
        delete( kid );
        delete( sid );
        return true;
    },

    async setExpose(sid,status)
    {
        games[sid].isexposing = status ;
    },

    async getExpose(sid)
    {
        return games[sid].isexposing ;
    },

    async createGame( msg , rooms , rounds )
    {
        var roo = [];
        var arrpermission = [
            {
                id: msg.guild.id,
                deny: ['VIEW_CHANNEL','SEND_MESSAGES'],
            },
          
        ];
        pending[msg.guild.id].forEach(element => {
            arrpermission.push(    
                {
                    id:element,
                    allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                    deny: ['MANAGE_MESSAGES','ATTACH_FILES','SEND_TTS_MESSAGES'],
                }
            );            
        });

        roo[0] = await msg.guild.channels.create("One-of-us-competition", {
            type: 'category',
            position: 0,
            permissionOverwrites: arrpermission
          });
          

        delete(arrpermission);

        for (let index = 1; index <= rooms; index++) {
            roo[index] = await msg.guild.channels.create("kill-room-#"+index, {
                type : 'text',
                parent : roo[0].id
            });
        }

        delete( rooms );

        var tkiller = pending[msg.guild.id][Math.floor(Math.random() * pending[msg.guild.id].length)];
        games[msg.guild.id] = {
            runing : true,
            starter : msg.author.tag,
            round : 1 ,
            max_rounds : rounds,
            main_channel : msg.channel,
            players : pending[msg.guild.id],
            killer : tkiller,
            points :[],
            isexposing : false,
            remain : pending[msg.guild.id].length,
            dead : [],
            rooms : roo
        };

        await msg.guild.members.cache.get(tkiller).send("You are the killer");

        delete( pending[msg.guild.id] );

        delete(tkiller);
        
        return games[msg.guild.id];
    },

    async isPremium(id)
    {
        if(id==parseInt(GUILD)) return true;

        premium.all().forEach(element => {
            if( element.guild == toString(id))
            return true;
        });
        return false;
    },
    async getGameMainChannel(id){
        return (games[id] && games[id].main_channel!=null && games[id].main_channel) || false ;
    },
    async isGameRuning( id ){
        return (games[id] && games[id].runing!=null && games[id].runing) || false ;
    },
    
    async getStarter( id ){
        return (games[id] &&  games[id].starter!=null && games[id].starter) || false ;
    },
    async startGame(msg,rooms,rounds)
    {
        let startmsg = new MessageEmbed(); 

        if (await module.exports.isGameRuning(msg.guild.id)) {
            
            startmsg.setTitle("One Of Us Error | Start")
            .setDescription(msg.guild.name)
            .setColor("#FF0000")
            .addField(
              '**Game already running**',
              'by ``'+ await module.exports.getStarter(msg.guild.id)+'``',
              true
            );
            startmsg.setTimestamp();

            return await msg.channel.send(startmsg).catch(console.error) ;
        }

        return await module.exports.createGame(msg,rooms,rounds);        

    }

}