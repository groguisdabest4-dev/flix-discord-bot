const { ActivityType, GatewayIntentBits, Partials, Client } = require('discord.js');
const config = require('./config');
const { getState, setMaintenance, createOrUpdateSetting } = require('./db');
const { registerSlashCommands } = require('./commands/register');
const { loadCommands } = require('./commands');

async function createBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.GuildMember]
  });

  const commands = loadCommands();

  client.on('ready', async () => {
    console.log(`✅ ${config.APP_NAME} is online as ${client.user.tag}`);
    await client.user.setActivity('Flix | live community', { type: ActivityType.Watching });

    if (!config.SERVER_ID) {
      console.warn('⚠️ SERVER_ID is not defined. Welcome flow will be disabled until configured.');
    }

    try {
      await registerSlashCommands(client, commands);
      console.log('✅ Slash commands registered.');
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  });

  client.on('guildMemberAdd', async member => {
    const state = getState();
    if (!config.SERVER_ID || member.guild.id !== config.SERVER_ID) {
      return;
    }

    if (state.maintenanceMode) {
      console.log(`🚧 Maintenance mode active; welcome ignored for ${member.user.tag}.`);
      return;
    }

    const channel = member.guild.channels.cache.get(config.WELCOME_CHANNEL_ID);
    if (!channel) {
      console.warn(`Welcome channel ${config.WELCOME_CHANNEL_ID} not found in guild ${member.guild.id}.`);
      return;
    }

    const welcomeMessage = `Welcome to Flix, ${member.user.username}! We’re excited to have you here. Please read the rules and enjoy the community.`;
    await channel.send(welcomeMessage);
    console.log(`Welcome sent to ${member.user.tag} in ${member.guild.name}.`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const { commandName } = interaction;
    const state = getState();

    if (state.maintenanceMode && commandName !== 'maintenance') {
      await interaction.reply({
        content: `🚧 ${config.APP_NAME} is currently under major updates. We will let you know when the bot is back online.`,
        ephemeral: true
      });
      return;
    }

    const command = commands.get(commandName);
    if (!command) {
      return;
    }

    try {
      await command.execute(interaction, client, { getState, setMaintenance, createOrUpdateSetting });
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      const errorMessage = 'There was an error while running this command.';

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  });

  client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const state = getState();

    if (state.maintenanceMode && message.guild?.id === config.SERVER_ID) {
      try {
        await message.reply(`🚧 ${config.APP_NAME} is under major updates. We will post an update when we are back online.`);
      } catch (error) {
        console.error('Could not send maintenance message:', error);
      }
    }
  });

  return client;
}

module.exports = { createBot };
