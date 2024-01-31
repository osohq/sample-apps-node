# oso-drive

## Running this Sample App

1. `npm install`
2. Sign up for [Oso Cloud](https://cloud.osohq.com) and get an API key
3. Copy `.env.example` to `.env` and set the `OSO_CLOUD_API_KEY` entry in `.env` to your Oso Cloud API key
4. Run `npm run seed`. This will overwrite any policy you currently have set up in Oso Cloud.
5. Run `npm start`.
6. Run the following `curl` command to verify that you can read a public file: `curl -H "authorization: foo" http://localhost:3000/readFile?id=test.txt`

Example Output:

```
$ curl -H "authorization: foo" http://localhost:3000/readFile?id=test.txt
{"file":{"id":"test.txt","content":"hello world"}}
```
