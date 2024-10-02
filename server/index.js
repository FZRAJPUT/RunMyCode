const express = require('express');
const cors = require('cors');
const generateFile = require('./generateFile');
const mongoose = require('mongoose');
const jobModel = require('./models/jobs');
const { addJobToQueue } = require('./jobQueue')
const deleteFile = require('./delete')

// Database Connection
mongoose.connect("mongodb+srv://subhash:oXqW0RSZj6gtirIf@cluster0.fjeho.mongodb.net/compiler")
    .then(() => console.log("DB connected successfully."))
    .catch((err) => console.error("DB connection failed:", err));

// Server configuration
const app = express();
const PORT = 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Root endpoint
app.get('/', (req, res) => {
    res.send("API is working");
});

// Get Job Status
app.get('/status', async (req, res) => {
        const jobId = req.query.id;
        console.log("Status requested for job ID:", jobId);
    
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID not available" });
        }
    
        try {
            const job = await jobModel.findById(jobId);
            if (!job) {
                return res.status(404).json({ success: false, error: "Invalid job ID" });
            }
    
            let file = String(job.filepath);
            let out = String(job.outputPath);
    
            // Send the response first to avoid any delays caused by the file deletion process
            res.status(200).json({ success: true, job });
    
            // Delete files
            deleteFile(file, out);
    
            // Delete job
            // const result = await jobModel.deleteOne({ _id: jobId });
            // console.log(`${result.deletedCount} document(s) was/were deleted.`);
    
        } catch (error) {
            console.error("Error fetching job status:", error);
            return res.status(500).json({ success: false, error: "Server error while fetching job status" });
        }
    });

// Run Code Endpoint
app.post('/run', async (req, res) => {

    const { code, language = "cpp" } = req.body;

    // generate filepath
    const filepath = await generateFile(language, code);

    // write db
    let job = await new jobModel({ language, filepath }).save();
    const jobId = job._id;

    addJobToQueue(jobId);
    
    res.status(201).json({ success: true, jobId });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
