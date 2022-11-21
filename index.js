const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const { Events, Collection, Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config()

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }

}
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});



client.on('ready', () => {
    console.log(`bot online`);
    client.user.setActivity('with discord.js', { type: 'PLAYING' });
})

client.on('messageCreate', async message => {
    if (message.author == "645387770088390726") {
        message.channel.send("I'm a bot");
    };

})

client.login(process.env.TOKEN);
