const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

require("dotenv").config();

if (process.env.DISCORD_BOT_TOKEN === undefined) {
    throw new Error(
        "Discord bot token missing! Ensure the DISCORD_BOT_TOKEN environment variable is set with the access token"
        + "for the Discord bot."
    );
}

const PREFIX = "~mikuum";
const MIKUUM_COPYPASTA = (() => {
    try {
        return fs.readFileSync("./assets/mikuum.txt", "utf-8");
    } catch (err) {
        console.log(err);
    }
})();

client.on("ready", () => {
    console.log("HatsuneMikuum ready...");
});

client.on("message", async message => {
    if (!message.content.startsWith(PREFIX)) {
        return;
    }

    const args = message.content.split(" ");

    switch (args[1]) {
        case "-t":
            message.reply(MIKUUM_COPYPASTA);
            break;
        case "-v":
            if (!message.guild) {
                message.reply("~mikuum -v only works in guilds.");
                break;
            } else if (!message.member.voice.channel) {
                message.reply("~mikuum -v requires you to be in a voice channel first.");
                break;
            }

            message.member.voice.channel.join()
                .then(conn => {
                    const dispatch = conn.play("./assets/mikuum.mp3");
                    dispatch.on("finish", finish => {
                        message.member.voice.channel.leave();
                    });
                })
                .catch(err => {
                    console.log(err);
                    message.member.voice.channel.leave();
                    message.reply("HatsuneMikuum unable to join voice channel");
                });
            break;
        default:
            break;
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
