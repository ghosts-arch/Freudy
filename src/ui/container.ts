import {
  ContainerBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";

export const buildContainer = ({
  color,
  title,
  description,
  footer,
  thumbnailUrl,
}: {
  color: number;
  title: string;
  description?: string;
  footer?: string;
  thumbnailUrl: string;
}) => {
  const container = new ContainerBuilder().setAccentColor(color);
  const section = new SectionBuilder().setThumbnailAccessory(
    new ThumbnailBuilder({
      media: {
        url: thumbnailUrl,
      },
    })
  );
  const sectionTitle = new TextDisplayBuilder().setContent(title);
  section.addTextDisplayComponents(sectionTitle);
  if (description) {
    const sectionDescription = new TextDisplayBuilder().setContent(description);
    section.addTextDisplayComponents(sectionDescription);
  }
  container
    .addSectionComponents(section)
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
    );
  if (footer) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(footer)
    );
  }
  return container;
};
