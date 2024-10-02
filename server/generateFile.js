const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
    fs.mkdirSync(dirCode, { recursive: true });
}

const generateFile = async (format, code) => {

    const jobId = uuid();
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCode, filename);

    // Write the code content to the file
    await fs.writeFileSync(filepath, code);

    return filepath;
};

module.exports = generateFile;
