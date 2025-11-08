import "./register.ts";
import { resolve } from "node:path";
import assert from "node:assert";

assert(process.argv[2], `You must specify a script to run`);

let path = resolve(process.cwd(), process.argv[2]);

import(path);
