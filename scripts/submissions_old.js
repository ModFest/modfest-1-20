#!/usr/bin/node

const { readFileSync, writeFileSync, existsSync } = require("node:fs");
const url = require("url");
const path = require("path");

const EXCLUDE = [
    "wild-magix", // not approved yet?
    "weathersync", // Not updated yet
    "rapscallions-and-rockhoppers" // Pulls latest from NeoForge ver
];

const API_SUBMISSIONS = "https://platform.modfest.net/submissions/";
const API_EVENT = "https://platform.modfest.net/event/1.20/";

const fetchSubmissions = async () => {
    let list = [];

    const allSubmissions = await (await fetch(API_SUBMISSIONS)).json();
    const { participants } = await (await fetch(API_EVENT)).json();

    for (let { submissions = [] } of Object.values(participants)) {
        for (let submission of submissions) {
            list.push(allSubmissions.find(x => x.id === submission));
        }
    }

    return list.filter(x => !EXCLUDE.includes(x.slug)) || [];
}

const inputPath = "./server.base.toml";
const outputPath = "./server.toml";
const replaceToken = "#[SUBMISSIONS]";

const main = async () => {
    if (!existsSync(inputPath))
        return console.log("Error: server.base.toml not found - are you in the correct directory?");

    console.log("Fetching submissions...");

    let submissionData = await fetchSubmissions();

    console.log(`Adding ${submissionData.length} mods...`);

    let list = submissionData.map((s) => {
        console.log(`Adding '${s.name}' (${path.basename(url.parse(s.download_url).pathname)})`);
        return [
            "[[mods]]",
            `type = "modrinth"`,
            `id = "${s.slug || s.id}"`,
            `version = "${s.version_id || "latest"}"`,
        ].join("\n");
    }).join("\n\n");

    console.log(`Reading ${inputPath}...`);
    let contents = readFileSync(inputPath).toString();

    contents = contents.replaceAll(replaceToken, list);

    console.log(`Writing to ${outputPath}...`);
    writeFileSync(outputPath, contents);

    console.log(`Done.`);
}

main();
