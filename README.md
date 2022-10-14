# 🧭 Favicon Scout

A web service to fetch the favicon of any website. Includes fallback options.

## Usage

Install globally

```bash
yarn global add @stevent-team/favicon-scout
```

```bash
npm i -g @stevent-team/favicon-scout
```

Then you can invoke the command line utility to start the server

```bash
favicon-scout # start with default options

favicon-scout --port 8080 # run on port 8080

favicon-scout --host 12.34.56.78 # specify a host

favicon-scout --origins https://example.com # only allow requests from example.com

favicon-scout -p 1234 -h 0.0.0.0 -o https://example1.com /\.example2\.com$/ # all options

favicon-scout --help # show help information
```

### Web server

```h
/{site url}/{size}
```

`site url` is any valid url to a page that you want the favicon for. Must be URL encoded.

`size` is an integer in pixels to set the returned image. It's optional, and if not included then the best available size will be returned.

### CORS

By default, any origin is allowed to request from this API. To lock it down, use the `--origins` command line options to specify a list of origins. If an origin starts and ends with `/` it will be treated as a regexp. For example `favicon-scout -o http://example1.com /\.example2\.com$/` will accept any request from "http://example1.com" or from a subdomain of "example2.com". See the [fastify-cors options](https://github.com/fastify/fastify-cors#options) for more details.

## Development

Run `yarn` to install dependencies. Run `yarn dev` to watch for changes and rerun.

Run `yarn build` to build to `/dist/index.js`.
