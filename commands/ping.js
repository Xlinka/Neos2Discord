const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot to check its latency'),
  async execute(interaction) {
    const pingMessage = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong! Latency is ${pingMessage.createdTimestamp - interaction.createdTimestamp}ms.`);
  },
};