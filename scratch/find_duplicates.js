const fs = require('fs');

function findDuplicates(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const keys = {};
    const duplicates = [];

    lines.forEach((line, index) => {
        const match = line.match(/^\s*"([^"]+)"\s*:/);
        if (match) {
            const key = match[1];
            if (keys[key]) {
                duplicates.push({ key, line: index + 1 });
            } else {
                keys[key] = true;
            }
        }
    });

    return duplicates;
}

console.log('EN Duplicates:', findDuplicates('d:/projects/work/Freelance/Maraseq/Maraseq-Dashboard/src/locales/en.json'));
console.log('AR Duplicates:', findDuplicates('d:/projects/work/Freelance/Maraseq/Maraseq-Dashboard/src/locales/ar.json'));
