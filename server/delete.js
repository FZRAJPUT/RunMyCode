const fs = require('fs');

const deleteFile = (file, out) => {
  // Delete the output file first
  fs.unlink(file, (err) => {
    if (err) {
      console.error(`Error deleting the input file: ${err}`);
    } else {
      console.log(`Input file ${file} deleted successfully.`);
    }
  });
  
  fs.unlink(out, (err) => {
    if (err) {
      console.error(`Error deleting the output file: ${err}`);
    } else {
      console.log(`Output file ${out} deleted successfully.`);
    }

    // Then delete the input file
  });
};

module.exports = deleteFile;
