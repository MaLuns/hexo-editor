const commands: CommandPalette[] = [];

export const registerCommand = (cp: CommandPalette, insert?: boolean) => {
	const index = commands.findIndex((item) => item.key === cp.key);
	if (index > -1) {
		commands.splice(index, 1, cp);
	} else {
		insert ? commands.unshift(cp) : commands.push(cp);
	}
};

export const removeCommand = (key: string) => {
	const index = commands.findIndex((item) => item.key === key);
	if (index > -1) {
		commands.splice(index, 1);
	}
};

export const getCommands = () => {
	return commands;
};
