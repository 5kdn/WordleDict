/**
 * @description 全面ポップアップ関連
 * @export
 */
export function popup() {
    /**
     * @description get is_hide from cookie
     * @returns boolean
     */
    const is_hide = (): boolean => {
        const arr = document.cookie.split(';')
        const len_arr = arr.length
        for (let i = 0; i < len_arr; i++) {
            const c = arr[i].split('=')
            if (c[0] == 'is_hide') {
                return c[1] == 'true'
            }
        }
        return false
    }
    const popup: HTMLDivElement | null = document.querySelector('div#popup')
    const bg_black:  HTMLDivElement | null = document.querySelector('div#popup-bg')
    const close_btn: HTMLDivElement | null = document.querySelector('div.popup-close-btn')

    if (!popup || !bg_black || !close_btn) {
        throw new Error('elem not found.')
    }

    // 全面ポップアップのイベントリスナー
    [bg_black, close_btn].forEach(elem => {
        if (!elem) throw new Error('elem not found.')
        elem.addEventListener('click', () => {
            if (!popup)  throw new Error('popup not found.')
            popup.classList.toggle('is-show')
            // add cookie
            document.cookie = 'is_hide=true'
        })
    })
    // cookieを見て、is_hide == falseなら.is-show属性をつける
    if (!is_hide()) {
        popup.classList.toggle('is-show')       // default hide
    }

    // #show-help-btn__innerのイベントリスナー
    const show_help_btn: HTMLDivElement | null = document.querySelector('div#show-help-btn__inner')
    if (!show_help_btn) throw new Error('#show_help_btn not found.');
    show_help_btn.addEventListener('click', () => {
        popup.classList.toggle('is-show')
    })
}