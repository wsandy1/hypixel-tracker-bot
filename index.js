const fs = require('fs');
const axios = require('axios');
const { Client, Collection, Intents } = require('discord.js');
const { token, igns, apikey, supabasekey } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

var userscache = [];

function cacheusers() {
    axios.get('https://cfubqfwhxdlrxtaubgpd.supabase.co/rest/v1/users?select=*', {
        headers: {
            apikey: supabasekey,
            Authorization: "Bearer " + supabasekey
        }
    })
        .then(res => {
            userscache = [];
            for (user of res.data) {
                let current = {
                    "name": user.name,
                    "uuid": user.uuid,
                    "online": false
                };

                userscache.push(current);
            }
        });
}

function update() {
    let refresh = false;
    for (user of userscache) {
        axios.get(`https://api.hypixel.net/status?uuid=${user.uuid}`, {
            headers: {
                'API-Key': apikey
            }
        })
            .then(res => {
                if (res.data.session.online != user.online) {
                    refresh = true;
                }
                return res.data.session.online;
            })
            .then(online => {
                user.online = online;
            })
            .then(() => {
                if (refresh) {
                    var embed = {
                        title: 'Hypixel Tracking',
                        description: ''
                    };
                
                    for (user of userscache) {
                        if (user.online == true) {
                            embed.description += `\n<:green_circle:936683622688243752> ${user.name} - *online*`;
                        } else {
                            continue;
                        }
                    }
                
                    for (user of userscache) {
                        if (user.online == false) {
                            embed.description += `\n<:red_circle:936684130895282176> ${user.name} - *offline*`;
                        } else {
                            continue;
                        }
                    }
            
                    client.channels.cache.get('936524453582618644').send({ embeds: [embed] });
                }
            });
    }
}

client.once('ready', () => {
	console.log('Ready!');
    cacheusers();
    var interval = setInterval(update, 300000);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

    cacheusers();
});

client.login(token);