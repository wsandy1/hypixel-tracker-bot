const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
// const { supabasekey } = require('../config.json');
const supabaskey = process.env.SUPABASE_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_user')
		.setDescription('Adds a user to the tracking list')
        .addStringOption(option =>
            option.setName('ign')
                .setDescription('In game name of the user to be added')
                .setRequired(true)),
        
	async execute(interaction) {
		let ign = interaction.options.getString('ign');
		let uuid;
		let name;
		await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
			.then(res => {
				uuid = res.data.id;
				name = res.data.name;
			});
		axios.post('https://cfubqfwhxdlrxtaubgpd.supabase.co/rest/v1/users', {	name: name, uuid: uuid	}, { 
			headers: {
				"apikey": supabasekey,
				"Authorization": "Bearer " + supabasekey,
				"Content-Type": "application/json",
				"Prefer": "return=representation"
			}
		})
		.then(res => {
			if (res.status === 201) {
				interaction.reply("User successfully added!")
			} else {
				interaction.reply("An error has occurred.")
			}
		});
	},
};
