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

## Examples

1. Anyone can read public files:

```
$ curl http://localhost:3000/readFile?id=test.txt
{
  "file": {
    "id": "test.txt",
    "content": "hello world"
  },
  "users": {}
}
```

2. Users can read or write files that they have been given the reader or writer role for.

```
$ curl -H 'content-type:application/json' -X PUT -d '{"id":"tps-reports/tps-report.txt", "content":"Hi Peter"}' -H "authorization: Michael" http://localhost:3000/updateFile
{
  "file": {
    "id": "tps-reports/tps-report.txt",
    "content": "Hi Peter"
  }
}
```

3. Users can read their own files:

```
$ curl -H "authorization: Peter" http://localhost:3000/readFile?id=tps-reports/tps-report.txt
{
  "file": {
    "id": "tps-reports/tps-report.txt",
    "content": "TODO: write TPS report"
  },
  "users": {
    "Michael": [
      "writer"
    ]
  }
}
```

4. Members of an organization can read files and folders that are part of the organization and have `is_readable_by_org` set

```
$ curl -H "authorization: Samir" http://localhost:3000/readFile?id=tps-reports/tps-report.txt
$ curl -H "authorization: Samir" http://localhost:3000/readFile?id=tps-reports/tps-report.txt
{
  "file": {
    "id": "tps-reports/tps-report.txt",
    "content": "TODO: write TPS report"
  },
  "users": {
    "Michael": [
      "writer"
    ]
  }
}
```

5. Admins of an organization can write files, but not all members of the org can write files.

```
$ curl -H 'content-type:application/json' -X PUT -d '{"id":"tps-reports/tps-report.txt", "content":"Hi Peter"}' -H "authorization: Samir" http://localhost:3000/updateFile
{"message":"Not authorized"}
$ curl -H 'content-type:application/json' -X PUT -d '{"id":"tps-reports/tps-report.txt", "content":"Needs work"}' -H "authorization: Bill" http://localhost:3000/updateFile
{
  "file": {
    "id": "tps-reports/tps-report.txt",
    "content": "Needs work"
  }
}
```