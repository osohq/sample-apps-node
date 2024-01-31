# hello-world

## Running this Sample App

1. `npm install`
2. Sign up for [Oso Cloud](https://cloud.osohq.com) and get an API key
3. Copy `.env.example` to `.env` and set the `OSO_CLOUD_API_KEY` entry in `.env` to your Oso Cloud API key
4. Run `npm run seed`. This will overwrite any policy you currently have set up in Oso Cloud.
5. Run `node . Bill`. You should see the following output:

```
$ node . Bill
User Bill is authorized to read tps-reports
```

Try running `node .` with a different user name:

```
$ node . Peter
User Peter is not authorized to read tps-reports
```
