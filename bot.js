// Load up the discord.js library
const Discord = require("discord.js");

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Serving ${client.guilds.size} servers || Bot By DzDev99`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers || Bot By DzDev99`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("message", message => {
    var prefix = "+";
 if (message.content === "+help") {
     message.channel.send('**تم ارسال رسالة في الخاص** :mailbox_with_mail: ');
  const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`
             ̲**B̲o̲t  ̲B̲y  ̲$̲D̲z̲D̲e̲v̲9̲9̲#̲9̲0̲7̲8̲**
+ping ➾ سرعة اتصالك بالانترنت
+about ➾ يعطيك يعطيك روابط التواصل الاجتماعي لصانع البوت
+kick ➾ معلومات عن السيرفر
+ban ➾ عمل حظر لشخص
+purge ➾ حذف الرسائل
+say ➾ يكرر كلامك
=========================================================
وقريباً المزيد من الاكواد
=========================================================
Support server :https://discord.gg/cUgYbEr
`)
   message.author.sendEmbed(embed)
   
   }
   });
client.on("message", async message => {
 
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
 if(command === "about") {
 const embed1 = new Discord.RichEmbed()
 .setTitle(' وسائل التواصل الاجتماعي الخاصة بمطور البوت')
 .addField('Youtube : ')
 .addField('Spotify : ')
 .addFeild('Facebook : ')
 message.author.sendEmbed(embed1)
 }


  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
    

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("لا تملك الصلاحيات لفعل هذا");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("اذكر شخص موجود في هذا السيرفر");
    if(!member.kickable) 
      return message.reply("لا استطيع طرد هذا الشخص،هل املك الصلاحيات اللازمة؟ ،هل هذا الشخص يملك صلاحيات اكثر منك؟ ");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "لم يتم ذكر السبب";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} تم طرد  هذا الشخص من قبل ${message.author.tag} بسبب ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("اسف، لا تملك الصلاحيات اللازمة");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("اذكر شخص موجود فالسيرفر");
    if(!member.bannable) 
      return message.reply("لا استطيع حضر هذا الشخص، هل يملك صلاحيات اثر منك؟ هل انا غير مخول لفعل هذا؟");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "لم يتم ذكر السبب";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} تم حظر هذا الشخص من طرف ${message.author.tag} بسبب ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("اذكر رقم بين ٢ و ١٠٠ ليتم الحذف");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(process.env.BOT_TOKEN);
