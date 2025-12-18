#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { Client } = require('discord.js-selfbot-v13');
const readline = require('readline');

const CONFIG_PATH = path.join(os.homedir(), '.config/discord-mutuals/config.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  }
  return {};
}

function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function setToken(token) {
  const config = loadConfig();
  config.token = token;
  saveConfig(config);
  rl.close();
}

function printUser(nickname, globalName, username, id, showIds, isListItem) {

  const name = nickname ? nickname : globalName;

  var cyanColor = chalk.cyanBright;
  var blueColor = chalk.blueBright;
  var grayColor = chalk.gray;

  if (isListItem) {
    cyanColor = chalk.dim.cyan;
    blueColor = chalk.dim.blue;
    grayColor = chalk.dim.gray;
  }
  if (!name) {
    console.log((isListItem ? "  - " : "") + blueColor(username) + (showIds ? grayColor(" (id: ") + grayColor(id) + grayColor(")") : ""));
    return;
  }
  console.log((isListItem ? "  - " : "") + cyanColor(name) + grayColor(" (username: ") + blueColor(username) + (showIds ? grayColor(", id: ") + grayColor(id) : "") + grayColor(")"));
}

async function showFriends(serverName, showIds, excludeInServer) {

  const config = loadConfig();

  const client = new Client();

  client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}`);

    var count = 0;

    try {
      var guild = client.guilds.cache.get(serverName);
      if (!guild) {
        guild = client.guilds.cache.find(g => g.name === serverName);
        if (!guild) {
          console.error('Server not found!');
          process.exit(1);
        }
      }

      await guild.members.fetch();
      const guildMembers = guild.members.cache;

      for (const [id, member] of guildMembers) {

        const response = await fetch(`https://discord.com/api/v9/users/${id}/relationships`, {
          headers: {
            'authorization': config.token
          }
        });

        var relationships = await response.json();

        if (excludeInServer) {
          const filteredRelationships = [];
          for (const relationship of relationships) {
            const isInServer = guildMembers.has(relationship.id);
            if (!isInServer) {
              filteredRelationships.push(relationship);
            }
          }
          relationships = filteredRelationships;
        }

        if (relationships.length > 0) {
          count += 1;
          console.log();
          const name = member.nickname ? member.nickname : member.user.globalName;
          printUser(member.nickname, member.user.globalName, member.user.username, member.id, showIds, false);

          if (true) {
            for (const relationship of relationships) {
              printUser(relationship.nickname, relationship.global_name, relationship.username, relationship.id, showIds, true);
            }
          }
        }
      }

      console.log(chalk.green(count) + " users with mutuals found!");

    } catch (error) {
      console.error('Error:', error.message);
    }

    rl.close();
    process.exit(0);
  });

  client.login(config.token);
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === 'set-token') {
    await setToken(args[1]);
    return;
  }
  if (args[0] === 'friends') {
    await showFriends(args[1], args.includes('--show-ids'), args.includes('--exclude-in-server'));
    return;
  }
  console.log('Usage: discord-mutuals set-token | friends <serverName> [--exclude-in-server] [--show-ids]');
  console.log('  set-token <token>       Set your Discord token');
  console.log('  friends <serverName>    Show friends in the specified server (serverName can be the server name or ID)');
  console.log('    --exclude-in-server   Exclude mutual friends who are in the server');
  console.log('    --show-ids            Show user IDs');
  rl.close();
}

main();