# Discord2Neos

Discord2Neos is a simple Discord bot that sends messages from a specified channel to a WebSocket server. The WebSocket server can then relay the messages to a NeosVR world, allowing users in the world to see and interact with messages from the Discord channel.

## Installation

1. Clone the repository: 
git clone https://github.com/xlinka/discord2neos.git

2. Install dependencies:
cd discord2neos
npm install

3. Create a Discord bot and add it to your server. Follow the instructions in the [Discord Developer Portal](https://discord.com/developers/docs/intro) to create a bot and add it to your server.

4. edit `config.json` and fill in the following information:

- `discord_token`: Your Discord bot token.
- `discord_channel_id`: The ID of the Discord channel you want to relay messages from.
- `websocket_port`: The port number of the WebSocket server.

5. Start the bot: 
node Bot.js

## Usage

Once the bot is running, it will automatically start sending messages from the specified Discord channel to the WebSocket server. You can then connect to the WebSocket server from your NeosVR world to receive the messages.

## Contributing

If you have any suggestions or find any bugs, feel free to open an issue or submit a pull request.
