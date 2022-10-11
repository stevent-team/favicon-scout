# 🧭 Favicon Scout

A web service to fetch the favicon of any website. Includes fallback options.

## Usage

```h
/{site url}/{size}
```

`site url` is any valid url to a page that you want the favicon for. Must be URL encoded.

`size` is an integer in pixels to set the returned image. It's optional, and if not included then the best available size will be returned.

## Development

Run `yarn` to install dependencies. Run `yarn dev` to watch for changes and rerun.

Run `yarn build` to build to `/dist/index.js`.
