# discord-mutuals

Find people you have mutual friends with on any Discord server!

## Installation

```sh
npm install -g discord-mutuals
# or
yarn global add discord-mutuals
# or your package manager of choice
```

## Usage

First, you need to add your Discord token. You can find this by opening Discord on the web, looking at nearly any `Fetch/XHR` request, and grabbing the string after `Authorization` in `Request Headers`. Save it by running
```sh
discord-mutuals add-token <your-discord-token>
```
which will save your token to your config.

Now, you can find people you have mutual friends with! Run
```sh
discord-mutuals friends <serverName>
```
and it will print all the users you have mutual friends with, and who those mutuals are.

You can also run the command with the flag `--exclude-in-server` to exclude any mutual friends that are also in the server you're looking through and/or the flag `--show-ids` to show users' Discord IDs in the results.
```sh
discord-mutuals friends <serverName> [--exclude-in-server] [--show-ids]
```


_Open source on [GitHub](https://github.com/EerierGosling/discord-mutuals), published on [npm](https://www.npmjs.com/package/discord-mutuals)._