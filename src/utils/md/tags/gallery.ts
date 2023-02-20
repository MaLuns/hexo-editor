import { htmlTag } from "@/utils"

/**
 * 相册
 * @param {*} args 
 * @param {*} content 
 * @returns 
 */
export const galleryGroup = (args: any[], content: string) => {
    return `<div class="fj-gallery no-fancybox">
    ${content}
</div>`
}

/**
 * 相册图片
 * @param {*} args 
 * @returns 
 */
export const galleryItem = (args: any[]) => {
    return htmlTag('img', {
        src: (args[0]),
        'data-src': (args[1])
    })
}

/**
 * 相册库
 * @param {*} args 
 * @returns 
 */
export const gallery = (args: any[]) => {
    const name = args[0]
    const desrc = args[1]
    const url = (args[2])
    const img = (args[3])
    const col = args[4] || 6
    const ratio = args[5] || 80

    return `
<div class="col-lg-${col}">
    <a href="${url}" class="trm-portfolio-item trm-scroll-animation" data-scroll data-scroll-offset="40">
        <div class="trm-cover-frame" style="padding-bottom:${ratio}%">
            <img class="trm-cover no-fancybox" src="${img}" alt="Group Image Gallery">
        </div>
        <div class="trm-item-description">
            <div>
                <h6>${name}</h6>
                <p style="margin: 5px 0 0;font-size: .9rem;opacity: .8;">${desrc}</p>
            </div>
        </div>
    </a>
</div>`
}
