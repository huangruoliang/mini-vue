
const args = require('minimist')(process.argv.slice(2))
const { build } = require('esbuild')
const { resolve } = require('path')
console.log(args)
console.log(process.argv)

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormt = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`)

build({
    entryPoints: [resolve(__dirname,`../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormt,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node': 'browser',
    watch: {
        onRebuild(error) {
            if(!error) console.log('rebuild........')
        }
    }

}).then(() => {
    console.log('watching')
})