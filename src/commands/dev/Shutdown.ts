import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Shutdown extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "shutdown",
			description: {
				content: "Shutdown the bot",
				examples: ["shutdown"],
				usage: "shutdown",
			},
			category: "dev",
			aliases: ["turnoff"],
			cooldown: 3,
			args: false,
			player: {
				voice: false,
				dj: false,
				active: false,
				djPerm: null,
			},
			permissions: {
				dev: true,
				client: [
					"SendMessages",
					"ReadMessageHistory",
					"ViewChannel",
					"EmbedLinks",
				],
				user: [],
			},
			slashCommand: false,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<void> {
		const embed = this.client.embed();
		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Danger)
			.setLabel("Confirm Shutdown")
			.setCustomId("confirm-shutdown");
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
		const shutdownEmbed = embed
			.setColor(this.client.color.red)
			.setDescription(
				`**Are you sure you want to shutdown the bot **\`${client.user?.username}\`?`,
			)
			.setTimestamp();

		const msg = await ctx.sendMessage({
			embeds: [shutdownEmbed],
			components: [row],
		});

		const filter = (i: any) =>
			i.customId === "confirm-shutdown" && i.user.id === ctx.author?.id;
		const collector = msg.createMessageComponentCollector({
			time: 30000,
			filter,
		});

		collector.on("collect", async (i) => {
			await i.deferUpdate();

			await msg.edit({
				content: "Shutting down the bot...",
				embeds: [],
				components: [],
			});

			await client.destroy();
			process.exit(0);
		});

		collector.on("end", async () => {
			if (collector.collected.size === 0) {
				await msg.edit({
					content: "Shutdown cancelled.",
					components: [],
				});
			}
		});
	}
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
