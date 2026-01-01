import { ContainerBuilder, SeparatorSpacingSize } from "discord.js";

export const buildContainer = ({
	color,
	title,
	description,
	footer,
}: {
	color: number;
	title: string;
	description?: string;
	footer?: string;
}) => {
	const container = new ContainerBuilder()
		.setAccentColor(color)
		.addTextDisplayComponents((display) => display.setContent(title));
	if (description) {
		container.addTextDisplayComponents((display) =>
			display.setContent(description),
		);
	}
	container.addSeparatorComponents((separator) =>
		separator.setSpacing(SeparatorSpacingSize.Large),
	);
	if (footer) {
		container.addTextDisplayComponents((display) => display.setContent(footer));
	}
	return container;
};
