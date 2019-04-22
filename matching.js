const notifier = require('node-notifier')
const growlNotifier = new notifier.Growl()
const commandExists = require('command-exists').sync
const os = require('os')
const lodash = require('lodash')
const {execSync} = require('child_process')

const notify = lodash.debounce((title, message) => {
    const msg = {title, message}
    if (os.platform() === 'linux' && commandExists('gol')) {
        growlNotifier.notify(msg)
    } else {
        notifier.notify(msg)
    }
}, 100, {trailing: true})

const matchers = [
    {
        matcher: /.*emit.*/,
        title: 'Webpack',
        body: () => new Date().toISOString()
    },
    {
        matcher: 'Watching for file changes',
        title: 'Typescript',
        body: line => line.split(' - ')[0]
    },
    {
      matcher: 'BUILD SUCCESSFUL',
      title: 'Gradle Incremental Build',
      onMatch() {
        const ret = execSync('/home/yonil/code/lark/post-gradle-compile.sh', {stdio: 'pipe'}).toString()
        console.log(ret)
      }
    }
]

exports.findAndNotifyForMatch = text => {
    matchers.forEach(({matcher, title, body = text, onMatch}) => {
        if (
            (matcher instanceof RegExp && matcher.test(text)) ||
            (typeof matcher === 'function' && matcher(text)) ||
            (typeof matcher === 'string' && text.includes(matcher))
        ) {
            let bodyText
            if (typeof body === 'function') {
                bodyText = body(text, matcher)
            } else {
                bodyText = body
            }
            if (onMatch) {
              onMatch()
            }
            notify(title, bodyText)
        }
    })
}
