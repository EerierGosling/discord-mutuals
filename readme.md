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
discord-mutuals friends <serverName> [--show-ids]
```
and it will print all the users you have mutual friends with, and who those mutuals are.