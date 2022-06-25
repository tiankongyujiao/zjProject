```
/**
 * px转换rem
 * 1rem = 10px
 */
(function (doc, win) {
    let docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            const clientWidth = docEl.clientWidth
            if (!clientWidth) return
            docEl.style.fontSize = 10 * (clientWidth / 1920) + 'px'
        };
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
```
