#!/usr/bin/env node
const {spawn} = require('child_process')
const {findAndNotifyForMatch} = require('./matching')


let args = process.argv.concat()
if (args[0].includes('node')) {
    args = args.slice(1)
} else if (args[0].includes('npm')) {
    args = args.slice(2)
}
args = args.slice(1)

const proc = spawn(args[0], args.slice(1), {
    shell: true
})

const dataCallback = (data, isErr) => {
    const asStr = data.toString()
    if (isErr) {
        process.stderr.write(data)
    } else {
        process.stdout.write(data)
    }
    findAndNotifyForMatch(asStr)
}

proc.stdout.on('data', data => dataCallback(data, false))
proc.stderr.on('data', data => dataCallback(data, true))

