const fs = require("fs");
const path = require("path");

function customRequireDirectory(dir, pascalCase = false) {
    let mp = {};
    let fileNames = fs.readdirSync(dir);
    let indexFile = path.join(dir, "index.js");
    for (fileName of fileNames) {
        let file = path.join(dir, fileName);
        let isDir = fs.lstatSync(file).isDirectory();

        let tempName = "";
        for (let i = 0; i < fileName.length; i++) {
            if (fileName[i] === "-") {
                if (i !== fileName.length - 1) {
                    ++i;
                    tempName += fileName[i].toUpperCase();
                }
            } else {
                tempName += fileName[i];
            }
        }
        fileName = tempName;
        if (!isDir) {
            fileName = path.parse(fileName).name; //get fileName without extension
        }
        if (pascalCase) {
            fileName = fileName[0].toUpperCase() + fileName.slice(1);
        }
        if (file !== indexFile) {
            mp[fileName] = require(file);
        }
    }
    return mp;
}

module.exports = customRequireDirectory;
