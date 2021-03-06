# @vatis-tech/asr-client-js

![version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues open](https://img.shields.io/github/issues/Vatis-Tech/asr-client-js.svg)
![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/Vatis-Tech/asr-client-js.svg)

<div align="center"><img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/logo.png?raw=true" alt="@vatis-tech/asr-client-js"/></div>

#### Client JavaScript implementation for Vatis Tech's live ASR service.

### Contents

- **[Installation 📀](#installation)**
- **[Constructor 🦺](#constructor)**
- **[Props 📦](#props)**
- **[Methods 🖇](#methods)**
- **[Browser Support 🔮](#browser-support)**
- **[Contributing 🏗](#contributing)**
- **[Getting Help ☎️](#getting-help)**
- **[Changelog 💾](#changelog)**
- **[Further Reading 📚](#further-reading)**

## Installation

### Via NPM

**Install the latest version**

```
npm i @vatis-tech/asr-client-js
```

This will install the latest version of `@vatis-tech/asr-client-js` with the caret (`^`) symbol to its version, inside the `package.json` file.

This means, that when you will do a later install into your project, it will take the latest minor version.

You can read more about this here: [npm caret and tilde](https://stackoverflow.com/a/22345808).

**Install the exact latest version.**

```
npm i -E @vatis-tech/asr-client-js
```

This will install the latest version of `@vatis-tech/asr-client-js` without the caret (`^`).

This means that on each new install, you will still have the initial installed version.

You can read more about this here: [npm install --save-exact](https://docs.npmjs.com/cli/v8/commands/npm-install#save-exact).

### Via CDN

You can also use this plugin via CDN, and use it inside an HTML & JavaScript project, that will run in browsers.
Just copy and paste the following script into your project:

```
<script src="unpkg.com/@vatis-tech/asr-client-js@1.2.1/umd/vatis-tech-asr-client.umd.js" charset="utf-8"></script>
```

### Via Download

You can also choose to download it, and use it locally, instead of a CDN.
You can download it by pressing the following link: [download here](https://github.com/Vatis-Tech/asr-client-js/archive/refs/heads/main.zip).
Or, download it from Github [here](https://github.com/Vatis-Tech/asr-client-js).
After that copy and paste the following script into your app:

```
<script src="%path%/asr-client-js/dist/umd/vatis-tech-asr-client.umd.js" charset="utf-8"></script>
```

And replace `%path%` with the path where you've downloaded and unzipped the plugin.

## Constructor

### Via NPM

First you need to import the plugin:

```
import VTC from "@vatis-tech/asr-client-js";
```

After that, you can initialize it like so:

```
const vtc = new VTC({
  service: "LIVE_ASR",
  language: "ro_RO",
  apiKey: "YOUR_API_KEY",
  onData: (data) => { console.log(data); },
  log: true,
});
```

### Via CDN or Download

If you opted out to use it as a downloadable or CDN (i.e. via a `script` tag inside a **static** HTML & JavaScript project), you will be able to use the constructor as follows:

```
const vtc = new VatisTechClient.default({
  service: "LIVE_ASR",
  language: "ro_RO",
  apiKey: "YOUR_API_KEY",
  onData: (data) => { console.log(data); },
  log: true,
});
```

## Props

### `service`

This is a **String** that refers to the service that you would like to use.

Vatis Tech offers two speech-to-text services, `LIVE_ASR`, you will receive the transcript while recording your microphone.

And `STATIC_ASR`, you upload a file, and receive the transcript on a given link (at the moment, this plugin does not support this feature).

**Only `LIVE_ASR` can be used at the moment.**

### `model`

This is a **String** that represents the **ID** of the model you want to use.

If not specified, the default model of the selected language will be used.

### `language`

This is a **String** for the language you want to transcribe from.

It must be in the following format: `language_region`.

At the moment, only `ro_RO` is available.

### `apiKey`

This is a **String** of your API key.

In order to use this plugin, you will need to use a valid API key.

To get one, please follow these instructions:

1. If you do not have one, please create an account on [https://vatis.tech/](https://vatis.tech/).
2. Log in to your account on [https://vatis.tech/login](https://vatis.tech/login).
3. Got to the API key page on your account, [https://vatis.tech/account/api-key](https://vatis.tech/account/api-key).
4. Copy the API key from there and add it to the `@vatis-tech/asr-client-js` constructor.

### `onData`

This is a **Function** on which you will receive from the back-end the transcript chunks.

It has the following signature:

```
const onData = (data) => {
	/* do something with data */
}
```

Or with function names:

```
function onData(data) {
	/* do something with data */
}
```

The `data` object that is received has the following props:

### `log`

This is a **Boolean** prop.

If set to true, it will call the `logger` function with an object that has the following structure:

```
{
	currentState: ...,
    description: ....
}
```

This tells you the current state of the plugin.

The last state will be the following:

```
{
  currentState: `@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.`,
  description: `@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each 1 second.`,
}
```

### `logger`

This is a **Function** on which you will receive data about the plugin state.

It has the following signature:

```
const logger = (info) => {
	/* do something with info */
}
```

Or with function names:

```
function onData(info) {
	/* do something with info */
}
```

The `info` object that is received has the props from above.

If `log` prop is set to `true` and the `logger` prop is not set, or is not a function with the above signature, the plugin will default the `logger` to `console.log`.

### `onDestroyCallback`

This is a **Function** that will be called upon successful destruction;

### `errorHandler`

This is a **Function** that will be called upon errors;

### `host`

This is the host for generating a key. It defaults to "https://vatis.tech/".

### `microphoneTimeslice`

How fast you want data to be captured from the microphone. Default is `250 milliseconds`.

### `frameLength`

The frame length of what the microphone catches. Default is `0.3 seconds`. (For a `microphoneTimeslice` of `250`, the `frameLength` is `0.3`).

### `frameOverlap`

Default is `0.3 seconds`.

### `bufferOffset`

Default is `0.3 seconds`.

### `waitingAfterMessages`

This is a **number** that needs to be _> 0_. It represents the number of message to be sent to the ASR Service, before waiting for a response. Default is `5`.

## Methods

### `destroy`

This will destroy the instantiated `@vatis-tech/asr-client-js`.

Also, the destroy method will be invoked if any error will come through the `socket.io-client` as a response from Vatis Tech ASR SERVICE.

**NOTE! If the VTC plugin did not send all messages, or it did not receive all messages, the destruction will not happen instantly.**
**NOTE! The destruction of the VTC plugin will happen only when all messages have been sent and received.**
**NOTE! If you wish to destroy the VTC plugin without waiting for all messages to be sent and received, you can pass `{ hard: true}` as a parameter to the `.destroy` call.**

### `pause`

Call this method, if you want to pause for a while the recording.

### `resume`

After calling the `pause` method, you can call this one to resume recording.

## Browser Support

We officially support the latest versions of the following browsers:

|                                                              Chrome                                                              |                                                              Firefox                                                              |                                                              Safari                                                              |                                                                       Safari                                                                        |                                                              Edge                                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/chrome.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/firefox.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/safari.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/safari-technology-preview.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/edge.png?raw=true" width="48" height="48"> |

## Contributing

We love pull requests!

Our community is safe for all. Before submitting a pull request, please review and agree our [Code of Conduct](https://github.com/Vatis-Tech/asr-client-js/blob/main/CODE_OF_CONDUCT.md), after that, please check the [Contribution](https://github.com/Vatis-Tech/asr-client-js/blob/main/CONTRIBUTING.md) guidelines.

## Getting Help

If you have questions, you need some help, you've found a bug, or you have an improvement idea, do not hesitate to open an [issue here](https://github.com/Vatis-Tech/asr-client-js/issues).

There are three types of issues:

- [Bug report](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+)
- [Feature request](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=feature&template=feature_request.yml&title=%5BFeature%5D%3A+)
- [Help wanted](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=help+wanted&template=help_wanted.yml&title=%5BHelp+wanted%5D%3A+)

## Changelog

To keep the README a bit lighter, you can read the [Changelog here](https://github.com/Vatis-Tech/asr-client-js/blob/main/CHANGELOG.md).

## Further Reading

#### Developers

If you are a developer, the following links might interest you:

- API documentation: [https://vatis.tech/documentation/](https://vatis.tech/documentation/#introduction)
- API status: [https://vatistech.statuspage.io/](https://vatistech.statuspage.io/)
- Supported languages: [https://vatis.tech/languages](https://vatis.tech/languages)
- Accepted file formats: [https://vatis.tech/formats](https://vatis.tech/formats)
- Check the pricing: [https://vatis.tech/pricing](https://vatis.tech/pricing)
- Join the team: [https://vatis.tech/careers](https://vatis.tech/careers)

#### About Vatis Tech

If you are just curios to learn more about Vatis Tech, please refer to these links:

- Landing page for Vatis Tech: [https://vatis.tech/](https://vatis.tech/)
- About Vatis Tech: [https://vatis.tech/about](https://vatis.tech/about)
- Vatis Tech newsroom: [https://vatis.tech/press](https://vatis.tech/press)

#### Social Media

- Message us on Facebook: [https://www.facebook.com/VatisTech/](https://www.facebook.com/VatisTech/)
- Connect with us on LinkedIn: [https://www.linkedin.com/company/vatis-tech/](https://www.linkedin.com/company/vatis-tech/)
- Chat with out Facebook community: [https://www.facebook.com/groups/1630293847133624](https://www.facebook.com/groups/1630293847133624)
