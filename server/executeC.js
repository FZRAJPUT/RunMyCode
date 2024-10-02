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
    let outPath = path.join(outputPath, jobId);

    return new Promise((resolve, reject) => {
        // Compile and run the C++ file
        exec(`gcc ${filepath} -o ${outPath.replace(/\\/g, '/')} && ${outPath.replace(/\\/g, '/')}`, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr }); // Reject if there is an error
                return;
            }
            if (stderr) {
                reject({ stderr }); // Reject if there is stderr
                return;
            }

            outPath = `${outPath}.exe`;
            // Resolve the Promise with both stdout and outPath
            resolve({ stdout, outPath });
            console.log(stdout,outPath);
        });
    });
};

module.exports = executeCode;
    
