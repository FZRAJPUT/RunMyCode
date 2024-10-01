const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const outputPath = path.join(__dirname, "outputs");

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Function to execute the code and return the stdout and the outPath
const executeCode = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0]; // Extract job ID from the file name
    let outPath = path.join(outputPath, jobId); // Output path for the compiled file

    return new Promise((resolve, reject) => {
        // Compile and run the C++ file
        exec(`g++ ${filepath} -o ${outPath.replace(/\\/g, '/')} && ${outPath.replace(/\\/g, '/')}`, (error, stdout, stderr) => {
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
