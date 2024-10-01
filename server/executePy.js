const { exec } = require('child_process');

// Function to execute code
const executePy = (filepath) => {

    return new Promise((resolve, reject) => {
        exec(`python ${filepath}`, (error, stdout, stderr) => {
            error && reject({error, stderr});
            stderr && reject({stderr});
            resolve(stdout);
        });
    });
};

module.exports = executePy;
    
