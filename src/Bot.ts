import { Client, GatewayIntentBits, REST, Routes} from "discord.js"
import { Commands } from "./Commands.ts";
import { downloadExecutable } from "./yt-dlp-utils/index.js";

import 'dotenv/config'
import InteractionCreate from "./events/InteractionCreate.ts";
import Ready from "./events/Ready.ts";
import VoiceStateUpdate from "./events/VoiceStateUpdate.ts";

// Download yt-dlp executable first
downloadExecutable();

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

// Bind events to listeners
InteractionCreate(client);
VoiceStateUpdate(client);
Ready(client);

client.login(token);
