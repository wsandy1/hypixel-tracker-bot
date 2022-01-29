const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { supabasekey } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_user')
		.setDescription('Removes a user from the tracking list')
        .addStringOption(option =>
            option.setName('ign')
                .setDescription('In game name of the user to be removed')
                .setRequired(true)),
        
	async execute(interaction) {
		let ign = interaction.options.getString('ign');
		axios.delete(`https://cfubqfwhxdlrxtaubgpd.supabase.co/rest/v1/users?name=eq.${ign}`, { 
			headers: {
				"apikey": supabasekey,
				"Authorization": "Bearer " + supabasekey
			}
		})
		.then(res => {
			if (res.status === 204) {
				interaction.reply("User successfully removed");
			} else {
				interaction.reply("An error has occurred");
			}
		});
	},
};
