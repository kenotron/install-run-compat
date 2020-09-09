// this is the rush / yarn compatible version of install-run.js

// e.g. node ./install-run-compat.js blah@1.2.3

import { spawnSync, spawn } from "child_process";

import os from "os";
import path from "path";
import fs from "fs";

import parsePackageName from "parse-package-name";

const npmCmd = path.join(
  path.dirname(process.execPath),
  os.platform() === "win32" ? "npm.cmd" : "npm"
);

const args = process.argv.slice(2);

const name = args[0];
const command = args[1];
const commandArgs = args.slice(2);

// get cacheDir
const results = spawnSync(npmCmd, ["config", "get", "cache", "--parseable"]);

const cacheDir = results.stdout.toString().trim();

// npm i -g blah@1.2.3 -c prefix
const pkgInfo = parsePackageName(name);

if (!pkgInfo.version) {
  throw new Error("Needs to specify the version number (foo@1.2.3)");
}

const prefix = path.join(cacheDir, "_install-run-compat", name);

if (!fs.existsSync(prefix)) {
  console.log(`Globally install a cached version of ${name}`);

  spawnSync(npmCmd, ["install", name, "--prefix", prefix], {
    stdio: "inherit",
  });
}

spawnSync(
  path.join(prefix, os.platform() === "win32" ? command + ".cmd" : command),
  commandArgs,
  { stdio: "inherit", env: process.env }
);
