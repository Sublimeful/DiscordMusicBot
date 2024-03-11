import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from "discord.js";

export enum MessageType {
  "info",
  "error",
}

export function createEmbed(type: MessageType, message: string): EmbedBuilder {
  switch (type) {
    case MessageType.info:
      return new EmbedBuilder().setColor("Blue").setTitle(message);
    case MessageType.error:
      return new EmbedBuilder().setColor("Red").setTitle(message);
  }
}

export async function createStringListPagination(
  interaction: ChatInputCommandInteraction<CacheType>,
  stringList: string[],
  title = "No title",
  emptyText = "Empty",
  stringsPerPage = 5,
  initialPage = 0,
  timeout = 120000,
) {
  const pages: EmbedBuilder[] = [];

  if (stringList.length > 0) {
    for (let i = 0; i < stringList.length; i += stringsPerPage) {
      pages.push(
        new EmbedBuilder()
          .setTitle(title)
          .setDescription(
            stringList
              .slice(i, i + Math.min(stringList.length - i, stringsPerPage))
              .join("\n"),
          ),
      );
    }
  } else {
    pages.push(new EmbedBuilder().setTitle(title).setDescription(emptyText));
  }

  await createPagination(interaction, pages, initialPage, timeout);
}

export async function createPagination(
  interaction: ChatInputCommandInteraction<CacheType>,
  pages: EmbedBuilder[],
  initialPage = 0,
  timeout = 120000,
) {
  if (!interaction.deferred) await interaction.deferReply().catch(() => {});

  let page = initialPage;

  const navigationButtons = [
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Previous")
      .setCustomId("Previous"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Next")
      .setCustomId("Next"),
  ];

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    navigationButtons,
  );

  const currPage = await interaction
    .editReply({
      embeds: [
        pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
      ],
      components: [row],
    })
    .catch(() => {});

  // In some rare cases, the message `currPage` does not exist (ex: deleted)
  // In that case, currPage would return null here
  if (!currPage) return;

  const collector = currPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    if (pages.length === 1) {
      // If there's only one page, then pressing
      // Previous or Next shouldn't do anything
      await i.deferUpdate().catch(() => {});
      return;
    }
    if (i.user.id !== interaction.user.id) {
      i.reply({
        content: `These buttons aren't for you!`,
        ephemeral: true,
      }).catch(() => {});
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

    await i.deferUpdate().catch(() => {});
    await i
      .editReply({
        embeds: [
          pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
        ],
        components: [row],
      })
      .catch(() => {});

    collector.resetTimer();
  });

  collector.on("end", (_, reason) => {
    // If the message component collector times out
    // Then disable the Previous and Next buttons
    if (reason === "time") {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        navigationButtons[0].setDisabled(true),
        navigationButtons[1].setDisabled(true),
      );
      currPage
        .edit({
          embeds: [
            pages[page].setFooter({
              text: `Page ${page + 1} / ${pages.length}`,
            }),
          ],
          components: [disabledRow],
        })
        .catch(() => {});
    }
  });

  return currPage;
}
