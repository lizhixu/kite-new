import {defineConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import legacyPlugin from '@vitejs/plugin-legacy'
import topLevelAwait from "vite-plugin-top-level-await";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        Vue({
            template: {
                compilerOptions: {
                    // 将所有带短横线的标签名都视为自定义元素
                    isCustomElement: (tag) => tag.includes('lottie-player')
                }
            }
        }),
        AutoImport({
            // targets to transform
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            // Auto import functions from Vue, e.g. ref, reactive, toRef...
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ['vue'],

            // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
            // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
            resolvers: [
                ElementPlusResolver(),

                // Auto import icon components
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
            vueTemplate: true
        }),

        Components({
            resolvers: [
                // Auto register icon components
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                // Auto register Element Plus components
                // 自动导入 Element Plus 组件
                ElementPlusResolver(),
            ],
        }),

        Icons({
            autoInstall: true,
        }),
        nodePolyfills(),
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: "__tla",
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: i => `__tla_${i}`
        }),
        //浏览器兼容
        legacyPlugin({
            targets: [
                "defaults",
                "> 1%",
                "last 2 versions",
                "not ie <= 8",
                "ios > 7",
            ],  // 需要兼容的目标列表，可以设置多个
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
            renderLegacyChunks: true,
            polyfills: [
                'es.symbol',
                'es.array.filter',
                'es.promise',
                'es.promise.finally',
                'es/map',
                'es/set',
                'es.array.for-each',
                'es.object.define-properties',
                'es.object.define-property',
                'es.object.get-own-property-descriptor',
                'es.object.get-own-property-descriptors',
                'es.object.keys',
                'es.object.to-string',
                'web.dom-collections.for-each',
                'esnext.global-this',
                'esnext.string.match-all'
            ]
        })
    ],
    resolve: {
        alias: {
            "@": path.join(__dirname, 'src')
        }
    },
    build: {
        // rollup 配置
        outDir: 'dist',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            input: {
                main: 'index.html',
            },
            output: {
                chunkFileNames: 'js/[name]-[hash].js', // 分类输出
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: '[ext]/[name]-[hash].[ext]',
                manualChunks(id) {
                    // // 最小化拆分包
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }
                }
            }
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "https://api.lizhixu.cn",
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/toolkit": {
                target: "https://www.115113.xyz",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/toolkit/, ""),
            },
        },
    }
})
