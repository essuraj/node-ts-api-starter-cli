#!/usr/bin/env node
const prompts = require('prompts');
var clone = require('git-clone');
const fs = require("fs");
const questions = [
    {
        type: 'text',
        name: 'projectName',
        message: 'What is your Project Name (lower case without space)?',
        initial: "api"
    },

    {
        type: 'select',
        name: 'version',
        message: 'Pick a version',
        choices: [
            { title: 'V1', description: 'standard regular old route,controller, service type', value: 'V1' },
            { title: 'V2', description: 'new decorator based syntax', value: "V2" },

        ],
        initial: 1
    },
    {
        type: 'toggle',
        name: 'needsMongoose',
        message: 'Do you need to use Mongoose?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    },
];

(async () => {
    const response = await prompts(questions);
    if (Object.keys(response).length === 0) { console.error("User aborted the cli"); process.exit(0); }
    console.info(response);
    const packageJsonPath = `./${response.projectName}/package.json`;
    console.log("Creating directory");
    fs.mkdirSync(response.projectName);
    console.log("Cloning " + response.version);
    let cloneURL;
    if (response.version === "V1")
        cloneURL = "https://github.com/stuworx/node-ts-api-starter.git";

    if (response.version === "V2")
        cloneURL = "https://github.com/essuraj/node-ts-api-starter-v2.git";

    clone(cloneURL, `./${response.projectName}`, undefined, () => {

        var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf-8" }));
        packageJson.name = response.projectName;

        if (response.needsMongoose === false) {
            console.log("Removing mongodb entries " + response.version);
            fs.rmdirSync(`./${response.projectName}/src/models`, { recursive: true })
            delete packageJson.dependencies.mongoose;
            delete packageJson.devDependencies["@types/mongoose"];
        }
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), { flag: "w" });
    })
})();