// vueファイルの型定義ファイル
// .vueのモジュールをimportする際にエラーになるのを回避する
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const component: ComponentOptions;
    export default component
}
