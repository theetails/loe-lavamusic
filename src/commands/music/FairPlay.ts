import { Command, type Lavamusic } from "../../structures/index";
import { applyFairPlayToQueue } from "../../utils/functions/player";

export default class FairPlay extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "fairplay",
			description: {
				content: "cmd.fairplay.description",
				examples: ["fairplay"],
				usage: "fairplay",
			},
			category: "music",
			aliases: ["fp"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: true,
				active: true,
				djPerm: null,
			},
			permissions: {
				dev: false,
				client: [
					"SendMessages",
					"ReadMessageHistory",
					"ViewChannel",
					"EmbedLinks",
				],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: any): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild.id);
		if (!player) {
			return await ctx.sendMessage({
				embeds: [
					{
						description: ctx.locale("player.errors.no_player"),
						color: this.client.color.red,
					},
				],
			});
		}

		const embed = this.client.embed();
		const fairPlay = player.get<boolean>("fairplay");

		player.set("fairplay", !fairPlay);

		if (fairPlay) {
			embed
				.setDescription(ctx.locale("cmd.fairplay.messages.disabled"))
				.setColor(this.client.color.main);
		} else {
			embed
				.setDescription(ctx.locale("cmd.fairplay.messages.enabled"))
				.setColor(this.client.color.main);
			await applyFairPlayToQueue(player);
		}

		await ctx.sendMessage({ embeds: [embed] });
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
