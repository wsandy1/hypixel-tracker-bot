const axios = require('axios');
const { Client, Intents } = require('discord.js');
const { token, igns, apikey } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var users = [];

for (ign of igns) {
    axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
        .then(res => {
            let currentuser = {
                "name": res.data.name,
                "uuid": res.data.id,
                "lastonline": "n/a",
                "online": false
            };

            users.push(currentuser);
        });
}


function update() {
    for (user of users) {
        axios.get(`https://api.hypixel.net/status?uuid=${user.uuid}`, {
            headers: {
                'API-Key': apikey
            }
        })
            .then(res => {
                user.online = res.data.session.online;
                client.channels.cache.get('936524453582618644').send('test');
            });
    }

    var embed = {
        title: 'Hypixel Tracking',
        fields: [
            {
                name: 'test',
                value: 'test',
                inline: false
            },
            {
                name: 'test',
                value: 'test',
                inline: false
            },
            {
                name: 'test',
                value: 'test',
                inline: true
            },
            {
                name: 'test',
                value: 'test',
                inline: true
            }

        ]
    };
}

client.once('ready', () => {
	console.log('Ready!');
    var interval = setInterval(update, 60000);
});

client.login(token);