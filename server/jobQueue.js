const Queue = require('bull');
const Job = require('./models/jobs');
const executeCode = require('./executecode'); // C++ execution
const executePy = require('./executePy');     // Python execution
const executeC = require('./executeC');       // C execution

const jobQueue = new Queue('job-queue');
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  console.log(job);
  

  if (!job) {
    throw new Error(`Cannot find Job with id ${jobId}`);
  }

  try {
    if (!job.filepath) {
      throw new Error(`Filepath is undefined for Job with id ${jobId}`);
    }
    
    const normalizedFilePath = job.filepath.replace(/\\/g, '/');
    console.log("Normalized file path:", normalizedFilePath);
    
    let output;
    job.startedAt = new Date();
    
    if (job.language === "cpp") {
      try {
        const result = await executeCode(normalizedFilePath);
        output = result.stdout;  // Store the output from the C++ code
        job.outputPath = result.outPath; // Store the outputPath for future use
        console.log("C++ code execution completed");
      } catch (err) {
        console.error("Error during C++ code execution:", err);
        job.output = err.stderr || err.message || err.error;
        job.status = "error";
        await job.save();
        return null;
      }
    } else if (job.language === "py") {
      try {
        output = await executePy(normalizedFilePath);
        console.log("Python code execution completed");
      } catch (err) {
        console.error("Error during Python code execution:", err);
        job.output = err.stderr || err.message || err.error;
        job.status = "error";
        await job.save();
        return null;
      }
    } else if (job.language === "c") {
      try {
        const result = await executeC(normalizedFilePath);
        output = result.stdout;  // Store the output from the C code
        job.outputPath = result.outPath; // Store the outputPath for future use
        console.log("C code execution completed");
      } catch (err) {
        console.error("Error during C code execution:", err);
        job.output = err.stderr || err.message || err.error;
        job.status = "error";
        await job.save();
        return null;
      }
    }

    job.completedAt = new Date();
    job.output = output;
    job.status = "success";
    await job.save();
    return 1;

  } catch (error) {
    console.error("Unexpected error:", error);
    job.completedAt = new Date();
    job.status = "error";
    job.output = error.message || error;
    await job.save();
  }
});

jobQueue.on('failed', (error) => {
  console.error("Job failed with error:", error);
  if (error.data && error.data.id) {
    console.log(`${error.data.id} failed: `, error);
  }
});

const addJobToQueue = async (jobId) => {
  await jobQueue.add({ id: jobId });
};

module.exports = {
  addJobToQueue
};
