import { themeMode } from "@/store";
import { createDiscreteApi, type ConfigProviderProps } from "naive-ui";

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
	theme: themeMode.value,
}));

const { message, notification, dialog, loadingBar } = createDiscreteApi(["message", "dialog", "notification", "loadingBar"], {
	configProviderProps: configProviderPropsRef,
});

export default {
	message,
	notification,
	dialog,
	loadingBar,
};
