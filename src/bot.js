const { ActivityType, GatewayIntentBits, Partials, Client, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');
const config = require('./config');
const { getGuildConfig, createOrUpdateGuildConfig, getGlobalState, getGuildWelcomeConfig } = require('./db');
const { registerSlashCommands } = require('./commands/register');
const { loadCommands } = require('./commands');

function buildMaintenanceStateMessage(message) {
  return new ContainerBuilder()
    .setAccentColor(0xf59e0b)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## 🚧 Flix is under maintenance')
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(message)
    );
}

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

    // Register guild commands for all guilds the bot is in
    for (const guild of client.guilds.cache.values()) {
      try {
        // Store guild info in database
        createOrUpdateGuildConfig(guild.id, {
          guildName: guild.name,
          guildOwnerId: guild.ownerId,
          memberCount: guild.memberCount,
          createdAt: guild.createdAt
        });
      } catch (error) {
        console.error(`Failed to initialize guild ${guild.id}:`, error);
      }
    }

    try {
      await registerSlashCommands(client, commands);
      console.log('✅ Slash commands registered for all guilds.');
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  });

  // Welcome flow for all configured guilds
  client.on('guildMemberAdd', async member => {
    const guildConfig = getGuildConfig(member.guild.id);
    
    // Check if this guild has welcome enabled
    const welcomeConfig = getGuildWelcomeConfig(member.guild.id);
    if (!welcomeConfig || !welcomeConfig.enabled) {
      return;
    }

    // Check global maintenance mode
    const globalState = getGlobalState();
    if (globalState.maintenanceMode) {
      console.log(`🚧 Global maintenance mode active; welcome ignored for ${member.user.tag} in ${member.guild.name}.`);
      return;
    }

    // Check guild-specific maintenance
    if (guildConfig && guildConfig.maintenanceEnabled) {
      console.log(`🚧 Guild maintenance mode active; welcome ignored for ${member.user.tag} in ${member.guild.name}.`);
      return;
    }

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) {
      console.warn(`Welcome channel ${welcomeConfig.channelId} not found in guild ${member.guild.id}.`);
      return;
    }

    const welcomeMessage = welcomeConfig.message.replace('{user}', member.user.username);
    await channel.send(welcomeMessage);
    console.log(`Welcome sent to ${member.user.tag} in ${member.guild.name}.`);
  });

  // Handle slash commands
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const { commandName } = interaction;
    const guildConfig = getGuildConfig(interaction.guildId);
    const globalState = getGlobalState();

    // Check if bot is in maintenance mode (global or guild-specific)
    const isGlobalMaintenance = globalState.maintenanceMode;
    const isGuildMaintenance = guildConfig && guildConfig.maintenanceEnabled;

    if ((isGlobalMaintenance || isGuildMaintenance) && commandName !== 'maintenance') {
      const message = isGlobalMaintenance 
        ? globalState.maintenanceMessage 
        : (guildConfig?.maintenanceMessage || 'This server is under maintenance.');
      
      const container = buildMaintenanceStateMessage(message);
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
        ephemeral: true
      });
      return;
    }

    const command = commands.get(commandName);
    if (!command) {
      return;
    }

    try {
      await command.execute(interaction, client, { getGuildConfig, createOrUpdateGuildConfig, getGlobalState });
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

  // Handle message responses
  client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const guildConfig = getGuildConfig(message.guildId);
    const globalState = getGlobalState();

    if ((globalState.maintenanceMode || (guildConfig && guildConfig.maintenanceEnabled)) && message.guildId) {
      try {
        const maintenanceMsg = guildConfig?.maintenanceMessage || globalState.maintenanceMessage;
        await message.reply(`🚧 ${maintenanceMsg}`);
      } catch (error) {
        console.error('Could not send maintenance message:', error);
      }
    }
  });

  return client;
}

module.exports = { createBot };
