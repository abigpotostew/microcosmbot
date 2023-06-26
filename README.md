# MicroCosmBot

### Apps and Packages

- `web`: the NextJS web application that also runs the telegram bot
- `bot`: all the bot logic
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `tailwind-config`: `tailwind.config.js`s used through `web` and `docs` application as well as `package/ui` components

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Development Setup

* Setup a https://planetscale.com/ database. Copy the connection string to your env. Run `npx prisma db push` from the `packages/db` directory to deploy the schema. You can use another db, but you will need to modify the file `packages/db/prisma/prisma.schema` file appropriately.
* Acquire a telegram bot token from @BotFather
* Enable bot group settings via botfather.
* Create a webhook to your localhost web port. I can recommend https://tunnelmole.com/ -- `tmole 3000`. Set this tunnel url to your BASEURL env variable.
* Copy `apps/web/.env.sample` to `apps/web/.env` and fill in the values.
* Run your bot locally with `turbo dev` in the `apps/web` directory.
* Call the config api to tell the bot where to send updates. `curl -X GET  http://localhost:3000/api/bot/<your bot key>/config`
* You will now receive bot updates from telegram to your local machine.

### Deployment

* Get your bot info and store the JSON in `NEXT_PUBLIC_GETME_BOT_INFO` (one time)
  * Call the telegram api `https://api.telegram.org/bot<your-bot-api-key>/getMe` and copy the `result` field object in the environment variable.
  * This helps speed up the api calls because grammy will not have to call this each time a function boots.
* Setup `https://console.upstash.com/qstash` which is used for the cron job to periodically check nft token ownership. Copy the key to your env.
* Deploy to vercel through the git integration.

### Cron
A vercel cron job enqueues a job that checks the nft token ownership of all users in the database. If a user no longer owns the token, they are removed from the database and banned from the group. This is to ensure that only users who own the token can be in the group.

Configure how often this runs in `vercel.json`. The default is every 2 hours.

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd nouns-stream
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd nouns-stream
yarn dev
```

### Testing

The `web` and `docs` NextJS projects are setup to run with [Vitetest](https://vitest.dev) and `web3` is setup to run test via [Forge](https://book.getfoundry.sh/reference/forge/forge-test).

To test all apps and packages, run the following command:

```
cd nouns-stream
yarn test
```

To run tests in watch mode, run the following command:

```
cd nouns-stream
yarn test:watch
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd microcosms
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)


## License
This project is licensed under the GPL licence. See [LICENSE.md](LICENSE.md) for details.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Contributor wish list:
* Internationalization - help me make this bot available in other languages! See https://grammy.dev/plugins/i18n.html#usage