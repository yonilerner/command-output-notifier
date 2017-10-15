const notifier = require('node-notifier')

const notify = (title, message) => {
    notifier.notify({
        title,
        message
    })
}

const matchers = [
    {
        matcher: /.*emit.*/,
        title: 'Webpack',
        body: () => new Date().toISOString()
    },
    {
        matcher: 'Compilation complete. Watching for file changes',
        title: 'Typescript',
        body: line => line.split(' - ')[0]
    }
]

exports.findAndNotifyForMatch = text => {
    matchers.forEach(({matcher, title, body}) => {
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
            notify(title, bodyText)
        }
    })
}
