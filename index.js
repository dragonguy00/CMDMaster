const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ms = require("ms");
const token = process.env.token;
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);

  bot.user.setActivity("ArkhamKnight", {type: "Playing"});


});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  
  if (cmd === `${prefix}inactive`) {

      //>inactive <duration> <reason>
      if(message.member.roles.find(`name`, "Inactive")) {
        message.delete().catch(O_o=>{});
        return message.channel.send("Sorry, you already have an inactivity notice submitted!");
      }
      else {
      let inactivetime = args[0];
      if(!inactivetime) return message.channel.send("You didn't specify a time!");
      let reason = args.slice(1).join(" ");
      let inactiverole = message.guild.roles.find(`name`, "Inactive");
      let user = message.guild.member(message.author);
      if(!inactiverole) return message.channel.send("Role does not exist.")

      let inactivityEmbed = new Discord.RichEmbed()
      .setTitle(`Inactivity Notices`)
      .setURL(`https://docs.google.com/spreadsheets/d/14PS-lZG0zBcHrXBpGkTcgawhykYYXy3icnW76Zxsqzg/edit#gid=1690386896`)
      .setColor("#15f153")
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
      .setDescription("This log is generated when a staff member submits an inactivity notice. To view all other inactivity notices submitted via the google form, click the title above. Information about this inactivity can be seen below.")
      .setThumbnail("https://i.imgur.com/Kv9ZcHX.png")
      .addField("Submitted By", `${message.author}`)
      .addField("Submitted At", message.createdAt)
      .addField("Duration", `${ms(ms(inactivetime))}`)
      .addField("Reason", reason)
      .setTimestamp()
      .setFooter(`This message is generated by ${bot.user.username}.`, "https://i.imgur.com/Kv9ZcHX.png");

      let inactivitychannel = message.guild.channels.find(`name`, "inactivity-log")
      if(!inactivitychannel) return message.channel.send("Couldn't find inactivity channel.");

      message.delete().catch(O_o=>{});
      inactivitychannel.send(inactivityEmbed);

      await(user.addRole(inactiverole.id));
      message.channel.send(`<@${user.id}>, you have successfully submitted an inactivity notice. You will be tagged when it has expired.`);

      setTimeout(function() {
        user.removeRole(inactiverole.id);
        message.channel.send(`<@${user.id}>, your inactivity has expired! If you are going to be inactive for longer, please submit another inactivity notice.`);

        let inactiveEmbed = new Discord.RichEmbed()
        .setTitle("[Expired] Inactivity Notice")
        .setDescription("The following staff member's inactivty has expired.")
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
        .setColor("#ec0000")
        .setThumbnail("https://i.imgur.com/Kv9ZcHX.png")
        .addField("Staff Member", `${message.author}`)
        .setTimestamp()
        .setFooter(`This message is generated by ${bot.user.username}.`, "https://i.imgur.com/Kv9ZcHX.png");

        inactivitychannel.send(inactiveEmbed);

      }, ms(inactivetime));
     }
    }

});

bot.login(token);
