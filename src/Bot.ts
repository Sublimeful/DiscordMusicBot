import { Client, ClientOptions } from "discord.js"
import 'dotenv/config'

const token = process.env.TOKEN;

console.log("Bot is starting...");

const client = new Client({
  intents: []
});

client.login(token);
