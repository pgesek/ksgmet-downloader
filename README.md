# ksgmet-downloader
Lambda function that fetches data from KSG-Met and stores it on an S3 bucket.

## Building

To install dependencies run:

```bash
npm install
```

In order to include to dev dependencies:

```bash
npm install --saveDev
```

To build the zip file for Lambda, run one of the following two commands.

If on a POSIX system:

```bash
npm run-script build-aws-resource
```

If on Windows:

```bash
npm run-script build-aws-resource-win
```

For Lambda, a zip containing the following files will be created:

* `index.js`
* the `src/` directory
* `node_modules/` directory
* `package.json`
* `LICENSE`

The zip file will be put into the `dest` folder.

## Running

In order to run manually outside of Lambda run:

```bash
node manual_run.js
```

This above the downloader without the Lambda handler.

## Configuration

Configuration is read from environment variables. It can be provide by an `.env` file placed in the working directory.
The following configuration variables are supported:

* `SERVER_URL` - base url of the server
* `PL_CSV_PATH` - path to the poland CSV directory, `prognozy/CSV/poland` by default
* `PL_CSV_STEP` - step used to the determine the next hour value to pull from, by default `1`. Applies to Poland CSV.
* `PL_CSV_FETCH_HOURS` - how many hours of Poland CSV data to fetch (maps to directory paths). Default is `40`.
* `PL_CSV_ERROR_LIMIT` - how many 404 errors to tolerate and retry by going lower. Default is `0`. Applies to Poland CSV.
* `EU_LONG_CSV_PATH` - path to the Europe long CSV directory, `prognozy/CSV/europe_long` by default
* `EU_LONG_CSV_STEP` - step used to the determine the next hour value to pull from, by default `3`. Applies to Europe long CSV.
* `EU_LONG_CSV_FETCH_HOURS` - how many hours of Europe long CSV data to fetch (maps to directory paths). Default is `168`.
* `EU_LONG_CSV_ERROR_LIMIT` - how many 404 errors to tolerate and retry by going lower. Default is `3`. Applies to Europe long CSV.
* `PL_CACHE_PATH` - path to Poland cache directory. Default is `prognozy/CACHE/poland`.
* `LOG_LEVEL` - Winston logging level, default is `info`.
* `UPLOAD_TO_S3` - whether to upload data to S3. By default `false`.
* `LOAD_AWS_CONFIG_FILE`: - whether to load aws configuration from `.aws-config.json`.
* `S3_BUCKET_NAME` - the name of the S3 bucket to upload to

## Tests

In order to run jasmine unit tests, execute:

```bash
npm run-script test
```
