import { Client, Events, GatewayIntentBits, REST, Routes} from "discord.js"
import 'dotenv/config'

import { Commands } from "./Commands";

const token = process.env.TOKEN ?? "";
const clientId = process.env.CLIENTID ?? "";

console.log("Bot is starting...");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`Nice! Logged in as ${c.user.tag}`);
})

const rest = new REST().setToken(token);

(async () => {
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: Commands },
  )
})()

client.login(token);
