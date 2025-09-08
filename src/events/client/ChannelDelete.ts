import {
	ChannelType,
	type GuildChannel,
	type VoiceBasedChannel,
} from "discord.js";
import { Event, type Lavamusic } from "../../structures/index";

export default class ChannelDelete extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: "channelDelete",
		});
	}

	public async run(channel: GuildChannel | VoiceBasedChannel): Promise<void> {
		const { guild } = channel;
		const setup = await this.client.db.getSetup(guild.id);
		const stay = await this.client.db.get_247(guild.id);

		if (Array.isArray(stay)) {
			for (const s of stay) {
				if (
					channel.type === ChannelType.GuildVoice &&
					s.voiceId === channel.id
				) {
					await this.client.db.delete_247(guild.id);
					break;
				}
			}
		} else if (stay) {
			if (
				channel.type === ChannelType.GuildVoice &&
				stay.voiceId === channel.id
			) {
				await this.client.db.delete_247(guild.id);
			}
		}

		if (
			setup &&
			channel.type === ChannelType.GuildText &&
			setup.textId === channel.id
		) {
			await this.client.db.deleteSetup(guild.id);
		}

		const player = this.client.manager.getPlayer(guild.id);
		if (player && player.voiceChannelId === channel.id) {
			await player.destroy();
		}
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
