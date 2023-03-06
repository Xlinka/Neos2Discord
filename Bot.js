const fs = require('fs');
const WebSocket = require('ws');
const Bottleneck = require('bottleneck');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// load config from file
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

// create WebSocket server
const wss = new WebSocket.Server({ port: 3000 }, () => {
  console.log('WebSocket server started on port 3000');
});

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// create rate limiter for Discord API requests
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1100,
});

// create collection to store slash commands
client.commands = new Collection();

// import slash commands
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// handle Discord ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // create REST API client
  const rest = new REST({ version: '9' }).setToken(config.discord_bot_token);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.discord_application_id),
      { body: client.commands.map((command) => command.data.toJSON()) }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

// handle WebSocket connection event
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
  
    // handle WebSocket message event
    ws.on('message', (message) => {
      try {
        
        const messageString = message.toString();
        const [neosName, neosMessage] = messageString.split(',');
        const discordMessage = `${neosName}: ${neosMessage}`;
        console.log(`Sending to Discord: ${discordMessage}`);
        limiter.schedule(() => client.channels.cache.get(config.discord_channel_id).send(discordMessage));
      } catch (error) {
        console.error(`Error processing WebSocket message: ${error.message}`);
      }
    });
    


    // handle WebSocket close event
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  
    // handle WebSocket error event
    ws.on('error', (error) => {
      console.error(`WebSocket error: ${error.message}`);
    });
  });

  client.on('messageCreate', (message) => {
    console.log(`Listening for messages in channel: ${message.channel.name}`);
    if (message.channelId === config.discord_channel_id) {
      console.log(`Received message from ${message.author.username}: ${message.content}`);
      try {
        const discordMessage = `${message.author.username}:${message.content}`;
        console.log(`Sending to WebSocket: ${discordMessage}`);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(discordMessage);
          }
        });
      } catch (error) {
        console.error(`Error processing Discord message: ${error.message}`);
      }
    }
  });

// handle Discord interaction create event (for slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// log in to Discord using bot token from config file
client.login(config.discord_bot_token);