import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, ComponentType, EmbedBuilder } from "discord.js";

export enum MessageType {
  "info",
  "error"
}

export function createEmbed(type: MessageType, message: string): EmbedBuilder {
  switch (type) {
    case MessageType.info:
      return new EmbedBuilder()
        .setColor("Blue")
        .setTitle(message)
    case MessageType.error:
      return new EmbedBuilder()
        .setColor("Red")
        .setTitle(message)
  }
}

export async function createPagination(
  interaction: ChatInputCommandInteraction<CacheType>,
  pages: EmbedBuilder[],
  initialPage = 0,
  timeout = 120000
) {
  if (!interaction.deferred) await interaction.deferReply();

  let page = initialPage;

  const navigationButtons = [
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Previous")
      .setCustomId("Previous"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Next")
      .setCustomId("Next")
  ];

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(navigationButtons)

  const currPage = await interaction.editReply({
    embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
    components: [row],
  });

  const collector = currPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout
  });

  collector.on("collect", async (i) => {
   if (i.user.id !== interaction.user.id) {
     i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
     return;
   }

   switch (i.customId) {
     case "Previous": {
       page = page > 0 ? --page : pages.length - 1;
       break;
     }
     case "Next": {
       page = page + 1 < pages.length ? ++page : 0;
       break;
     }
   }
   await i.deferUpdate();
   await i.editReply({
     embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
     components: [row],
   });
   collector.resetTimer();
  })

  collector.on("end", (_, reason) => {
    if (reason !== "messageDelete") {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        navigationButtons[0].setDisabled(true),
        navigationButtons[1].setDisabled(true)
      );
      currPage.edit({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [disabledRow],
      });
    }
  });

  return currPage;
}
