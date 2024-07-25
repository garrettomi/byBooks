export function validateImageSrc(src: string) {
    if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) return src;

    return '';
};
