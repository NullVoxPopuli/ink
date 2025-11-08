import "./register.ts";
import { resolve } from "node:path";
import assert from "node:assert";

assert(process.argv[1], `You must specify a script to run`);

let path = resolve(process.cwd(), process.argv[1]);

import(path);
