const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Check the uptime of the bot'),
  async execute(interaction) {
    const uptime = moment.duration(process.uptime() * 1000).humanize();
    interaction.reply(`Bot uptime: ${uptime}`);
  },
};