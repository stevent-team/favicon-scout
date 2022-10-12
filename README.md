# 🧭 Favicon Scout

A web service to fetch the favicon of any website. Includes fallback options.

## Usage

```h
/{site url}/{size}
```

`site url` is any valid url to a page that you want the favicon for. Must be URL encoded.

`size` is an integer in pixels to set the returned image. It's optional, and if not included then the best available size will be returned.

### CORS

By default, any origin is allowed to request from this API. To lock it down, set `ALLOWED_ORIGINS` in a `.env` file to a comma separated list of origins. If an origin starts and ends with `/` it will be treated as a regexp. For example `ALLOWED_ORIGINS="http://example1.com, /\.example2\.com$/"` will accept any request from "http://example1.com" or from a subdomain of "example2.com". See the [fastify-cors options](https://github.com/fastify/fastify-cors#options) for more details.

## Development

Run `yarn` to install dependencies. Run `yarn dev` to watch for changes and rerun.

Run `yarn build` to build to `/dist/index.js`.
