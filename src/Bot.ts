import { Client, Events, GatewayIntentBits, REST, Routes} from "discord.js"
import { Commands } from "./Commands.ts";
import { Listeners} from "./Listeners.ts";

import 'dotenv/config'

const token = process.env.TOKEN ?? "";
const clientId = process.env.CLIENTID ?? "";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const rest = new REST().setToken(token);

(async () => {
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: Commands.map(cmd => cmd.data.toJSON()) },
  )
})()

for (const listener of Listeners) {
  listener(client)
}

client.login(token);
