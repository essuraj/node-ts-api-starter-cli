#!/usr/bin/env node


let command = null;
try {
    command = require(`${process.cwd()}/node_modules/node-ts-api-starter-cli`);
} catch (e) {
    command = require('./index.js');
} command()