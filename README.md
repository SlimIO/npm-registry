# npm-registry

![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/npm-registry/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/Npm-registry/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![DEP](https://img.shields.io/david/SlimIO/Npm-registry.svg)
![size](https://img.shields.io/bundlephobia/min/@slimio/npm-registry.svg?style=flat)
[![Known Vulnerabilities](https://snyk.io/test/github/SlimIO/npm-registry/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/npm-registry?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Npm-registry.svg?branch=master)](https://travis-ci.com/SlimIO/Npm-registry)

API created to GET informations from the official [NPM API registry](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).

> ⛔️ You may need to consider the following package before: [pacote](https://github.com/npm/pacote#readme)

## Why ?
- Retrieve complete informations (with no filtering).
- Clean TypeScript definition

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/npm-registry
# or
$ yarn add @slimio/npm-registry
```

## Usage example

```js
const Registry = require("@slimio/npm-registry");

async function main() {
    const npmReg = new Registry();

    // Retrieve meta data
    const metaData = await npmReg.metaData();
    console.log(metaData);

    // Search a given package
    const pkg = await npmReg.package("@slimio/is");
    console.log(pkg.lastVersion);

    // Search full-text
    const results = await npmReg.search({
        text: "author:fraxken"
    });
    console.log(JSON.stringify(results, null, 2));
}
main().catch(console.error);
```

## Env required for testing

```
NPM_TOKEN=
NPM_AUTH=
```

## API

### Registry API
API for Registry Instance.

<details><summary>new Registry(URL: string)</summary>
<br/>

Create a new registry instance with a given URL (Registry root url). Is no value is provided, the default value will be the official NPM registry `https://registry.npmjs.org`.

```js
const Registry = require("@slimio/npm-registry");
const { strictEqual } = require("assert");

const reg = new Registry();
strictEqual(reg.url, Registry.DEFAULT_URL);
```
</details>


<details><summary>metaData(): Promise< Registry.Meta ></summary>
<br/>

API endpoint to get metadata of the given registry URL. Returned value is a Plain Object with all meta data.

```ts
interface Meta {
    db_name: string;
    doc_count: number;
    doc_del_count: number;
    update_seq: number;
    purge_seq: number;
    compact_running: boolean;
    disk_size: number;
    data_size: number;
    instance_start_time: string;
    disk_format_version: number;
    committed_update_seq: number;
}
```
</details>

<details><summary>login(auth: string): void</summary>
<br/>

Initialize header Authorization

```js
const reg = new Registry()

reg.login("username:password");
// or
reg.login("token");
// use API
```
</details>

<details><summary>logout(auth: string): void</summary>
<br/>

Remove header Authorization

```js
const reg = new Registry()

reg.login("username:password");
// use API
reg.logout();
```
</details>

<details><summary>package(packageName: string, version?: string): Promise< Package ></summary>
<br/>

Search a given package by his name (and optionally his version). It will return a new Package instance.

```js
const reg = new Registry();

const ava = await reg.package("ava");
console.log(ava.lastVersion);
console.log(ava.versions);
console.log(ava.homepage);

// Retrieve a given version
const lastVer = ava.version(ava.lastVersion);
console.log(lastVer.dependencies);
```
</details>

<details><summary>userPackages(userName: string): Promise< UserPackages ></summary>
<br/>

Find all packages for a given user. Returned value is a plain Object.

```js
const reg = new Registry();

const fraxPackages = await reg.userPackages("fraxken");
console.log(JSON.stringify(fraxPackages, null, 2));
```

TypeScript definition for UserPackages:
```ts
interface UserPackages {
    [packageName: string]: "write" | "read";
}
```
</details>

<details><summary>search(options: SearchOptions): Promise< Registry.SearchResult ></summary>
<br/>

Full-text search API. Please take a look at the [official documentation](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search).

Available Options:
```ts
interface SearchOptions {
    text: string;
    size?: number;
    from?: number;
    quality?: number;
    popularity?: number;
    maintenance?: number;
}
```

Usage example:
```ts
const reg = new Registry();

const { total, objects } = await reg.search({ text: "author:fraxken" });
if (total === 0) {
    console.log(`Total of packages retrieved: ${total}`);
}
for (const { package } of objects) {
    console.log(package.name);
}
```
</details>

<details><summary>membership(scope: string, auth?: string): Promise< Roster ></summary>
<br/>

Get memberships of an organisation. Auth parameter is an optional HTTP Authorization header `username:password`.
> If the organisation is private, you need to be logged to see memberships.

```ts
interface Roster {
    [username: string]: "developer" | "admin" | "owner"
}
```

Usage example:
```ts
const reg = new Registry();

const members = await reg.membership("npm");
for (const [username, role] of Object.entries(members)) {
    console.log(`${username}: ${role}`);
}
```
</details>

<details><summary>downloads(packageName: string, options?: DownloadOptions): Promise< DownloadPoint | DownloadRange ></summary>
<br/>

Get npm downloads counts in a given range. Options is described by the following interface:
```ts
type Period = "last-day" | "last-week" | "last-month";
interface DownloadOptions {
    period?: Period;
    type?: "point" | "range";
}
```

Example, retrieve the downloads count for `express` in the last-month:
```js
const { downloads } = await reg.downloads("express", { period: "last-month" });
console.log(downloads);
```

The returned value will depend on the type `point` or `range`. Default type is **point**.
</details>

### Package API
API for Package class.

```ts
declare class Package {
    version(version: string): Version;
    tag(tagName: string): string;
    publishedAt(version: string): Date;

    public readme: {
        file: string;
        content: string;
    };
    public readonly id: string;
    public readonly rev: string;
    public readonly name: string;
    public readonly description: string;
    public readonly author: Registry.Human;
    public readonly maintainers: Registry.Human[];
    public readonly tags: string[];
    public readonly lastVersion: string;
    public readonly versions: string[];
    public readonly keywords: string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly homepage: string;
    public readonly license: string;
    public readonly bugsURL: string;
}
```

<details><summary>version(version: string): Version</summary>
<br/>

Return a Version class instance.
</details>

<details><summary>tag(tagName: string): string</summary>
<br/>

Get a given tag value.
</details>

<details><summary>publishedAt(version: string): Date</summary>
<br/>

Get the publication date of a given version.

```js
const date = pkg.version(pkg.lastVersion);
```
</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|TBC|
|[httpie](https://github.com/lukeed/httpie#readme)|Minor|Low|TBC|

## License
MIT

