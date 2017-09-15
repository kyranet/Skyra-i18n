# Contributing to the repository

First, you will need to create a **[GitHub Account](https://github.com/join)** if you haven't yet, then, download this repository or the file from `/languages/en-US`.

## Translating the pieces

I am aware translating Skyra to other languages in the format I provide in this repository can be hard, as it's how they're stored and used in **production**, I lack of time to use a fancier online tool (I haven't had time to find one, neither, I have been busy with the **i18n** implementation, bugfixing, and implementing features).

What should I touch and what I should **not**? The format for the file is a JavaScript object. Let me show an example.

```javascript
module.exports = class extends Language {

    constructor(...args) {
        // Stuff

        COMMAND_FLOW: (amount) => `${amount} messages have been sent within the last minute.`,
        COMMAND_TIME_TIMED: 'The selected moderation case has already been timed.',
        COMMAND_TIME_UNDEFINED_TIME: 'You must specify a time.',
        COMMAND_TIME_UNSUPPORTED_TIPE: 'The type of action for the selected case cannot be reverse, therefore this action is unsupported.',
        COMMAND_TIME_NOT_SCHEDULED: 'This task is not scheduled.',

        // More stuff
    }
}
```

In the snippet above, you shall **not** touch the names and variables, for example, in the first name, `COMMAND_FLOW` is the key/name I use to get the text for future output, the `(whatever) =>` should be ignored, they're functions I use to insert variables into them. And, inside the texts, whatever is between `${whatever}` is a variable inserted into the text. For example, let's say I pass the value `7` to `COMMAND_FLOW`, then `amount` becomes `7`, making the output of it:

```md
7 messages have been sent within the last minute.
```

I will show you an example, translating the snippet above in Spanish, my native language:

```javascript
module.exports = class extends Language {

    constructor(...args) {
        // Stuff

        COMMAND_FLOW: (amount) => `Una cantidad de ${amount} mensajes fueron enviados durante el último minuto.`,
        COMMAND_TIME_TIMED: 'El caso de moderación seleccionado ya ha sido temporizado.',
        COMMAND_TIME_UNDEFINED_TIME: 'Debes especificar un tiempo.',
        COMMAND_TIME_UNSUPPORTED_TIPE: 'El tipo de acción por el caso de moderación seleccionado no es reversible, por lo tanto, esta acción no está soportada.',
        COMMAND_TIME_NOT_SCHEDULED: 'Esta tarea no está temporizada.',

        // More stuff
    }
}
```

## Uploading the translations

You can make a PR (you need to have an account, fork this repository, upload the file with your translations) and make a Pull Request. Check [this](https://help.github.com/articles/about-pull-requests/) for more information.

However, I understand not everyone is an expert on this, if you have a chance and you don't know what to do, feel free to upload your translation in [hastebin](https://hastebin.com/) or [Gist GitHub](https://gist.github.com/) and send it to me in DMs, Skyra's lounge, or via the feedback command.

## Proofreading

Once you (or me) upload a translation, it'll be visible to everyone in this repository for future maintenance, such as improving the wording/translation/expression, if there's a translation for the language you know, you can do a [proofread](http://www.wordreference.com/definition/proofread) and check it.

## Translators

The use of translators is **forbidden**, and keep in mind, native speakers will notice the use of translators easily (they ain't perfect), and if a proofreader finds out that, I'm gonna be **sad**.

## Doubts

Do you have doubts? Please do me a favor and ask me in DMs or in the **[Official Skyra's Lounge](https://skyradiscord.com/join)**, I will be very grateful with your help!

> I am going to upload the es-ES translation very soon, by the way, so you can check it out and compare with the en-US one.
