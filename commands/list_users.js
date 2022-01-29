const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { supabasekey } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list_users')
		.setDescription('Shows tracking list'),
        
	async execute(interaction) {
		axios.get('https://cfubqfwhxdlrxtaubgpd.supabase.co/rest/v1/users?select=*', {
			headers: {
				apikey: supabasekey,
				Authorization: "Bearer " + supabasekey
			}
    	})
		.then(res => {
			let message = "**User list:**";
			for (user of res.data) {
				message += "\n" + user.name;
			}
			interaction.reply(message);

		})
	},
};
