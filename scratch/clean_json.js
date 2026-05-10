const fs = require('fs');

function cleanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}

cleanFile('d:/projects/work/Freelance/Maraseq/Maraseq-Dashboard/src/locales/en.json');
cleanFile('d:/projects/work/Freelance/Maraseq/Maraseq-Dashboard/src/locales/ar.json');
