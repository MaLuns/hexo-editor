export const caniUse = (args: any[]) => {
    const [feature, periods = 'current'] = args.join('').split('@');
    if (!feature) {
        return '';
    }

    return `<iframe data-feature="${feature}" src="https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&periods=${periods}&accessible-colours=false" frameborder="0" width="100%" height="400px"></iframe>`;
};


