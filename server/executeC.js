const { exec } = require('child_process'); // Ensure to import exec
const path = require('path');
const fs = require('fs');

const outputPath = path.join(__dirname, "outputs"); // Make sure outputPath is defined

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Function to execute code
const executeCode = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, jobId);

    return new Promise((resolve, reject) => {
        // Compile and run the C++ file
        exec(`gcc ${filepath} -o ${outPath.replace(/\\/g, '/')} && ${outPath.replace(/\\/g, '/')}`, (error, stdout, stderr) => {
            error && reject({error, stderr});
            stderr && reject({stderr});
            resolve(stdout);
        });
    });
};

module.exports = executeCode;
    
