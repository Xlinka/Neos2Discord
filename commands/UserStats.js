const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('UserStats')
    .setDescription('Show all the stats from the Neos API'),
  async execute(interaction) {
    const url = 'https://api.neos.com/api/stats/onlineuserstats';
    const response = await fetch(url);
    const data = await response.json();

    const exampleEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Neos Stats')
      .setURL('https://neos.com/')
      .setDescription('Here are the latest stats from the Neos API')
      .addFields(
        { name: 'Registered User Count', value: data.registeredUserCount.toLocaleString() },
        { name: 'Instance Count', value: data.instanceCount.toLocaleString() },
        { name: 'VR User Count', value: data.vrUserCount.toLocaleString() },
        { name: 'Screen User Count', value: data.screenUserCount.toLocaleString() },
        { name: 'Headless User Count', value: data.headlessUserCount.toLocaleString() },
        { name: 'Mobile User Count', value: data.mobileUserCount.toLocaleString() },
        { name: 'Public Session Count', value: data.publicSessionCount.toLocaleString() },
        { name: 'Active Public Session Count', value: data.activePublicSessionCount.toLocaleString() },
        { name: 'Public World User Count', value: data.publicWorldUserCount.toLocaleString() },
      )
      .setTimestamp()


    await interaction.reply({ content: 'Here are the latest stats from the Neos API:', embeds: [exampleEmbed]});
  },
};