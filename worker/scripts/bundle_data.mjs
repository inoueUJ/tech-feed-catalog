// Copy the generated catalog into the worker directory so it can be imported and
// bundled. Keeping this a build step (rather than importing across directories)
// keeps the Worker deployable on its own.
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const workerDir = dirname(dirname(fileURLToPath(import.meta.url)))
const source = join(dirname(workerDir), 'site', 'feeds.json')
const target = join(workerDir, 'data.json')

if (!existsSync(source)) {
  console.error(`Missing ${source}. Run: python scripts/build.py`)
  process.exit(1)
}

copyFileSync(source, target)
console.log(`Bundled catalog data into ${target}`)
