const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "py", "c"]
    },
    filepath: {
        type: String,
        required: true
    }, 
    submittedAt: {
        type: Date,
        default: Date.now
    },
    startAt: {
        type: Date
    },
    completedAt: { // Corrected spelling
        type: Date
    },
    output: {
        type: String
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "error"]
    },
    outputPath: {
        type: String,
    }
});

const jobModel = mongoose.model("jobs", jobSchema);

module.exports = jobModel;
