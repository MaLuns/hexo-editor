import type { MessageReactive } from "naive-ui";
import { fileStore } from "@/store";

export const useLoading = () => {
    const message = useMessage();
    let messageReactive: MessageReactive | null = null;

    const endLoading = () => {
        if (messageReactive) {
            messageReactive.destroy();
            messageReactive = null;
        }
    };

    onBeforeUnmount(endLoading);

    return {
        endLoading,
        startLoading(title: string) {
            if (messageReactive) {
                messageReactive.content = title;
            } else {
                messageReactive = message.loading(title, { duration: 0 });
            }
        },
    };
};

export const useEventListener = (target: any, event: string, callback: Function) => {
    onMounted(() => target.addEventListener(event, callback));
    onUnmounted(() => target.removeEventListener(event, callback));
};

export const useAutoParentHeight = (min: string) => {
    const proxy = getCurrentInstance()?.proxy;
    if (proxy?.$el && proxy?.$el.parentElement) {
        return proxy?.$el.parentElement.clientHeight + "px";
    }
    return min;
};

export const useWindowResize = (reduceHeight: number) => {
    let data = ref(`${window.innerHeight - reduceHeight}px`);
    useEventListener(window, "resize", () => {
        data.value = `${window.innerHeight - reduceHeight}px`;
    });
    return data;
};
