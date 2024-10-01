"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import langu from './defaultLang';
const Page = () => {
  const [code, setCode] = useState("");
  const [language, setlanguage] = useState("cpp")
  const [output, setOutput] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [status, setstatus] = useState("");
  const [jobId, setjobId] = useState("");

  useEffect(() => {
    setCode(langu[language])
  }, [language]);



  const handleCode = async (e) => {
    e.preventDefault();
    setjobId("");
    setstatus("");
    setOutput("");

    try {
      setisLoading(true);
      let url = 'http://localhost:4000/run';
      const response = await axios.post(url, { code, language });
      const jobId = response.data.jobId;
      setjobId(jobId);

      let intervalId = setInterval(async () => {
        const { data: statusData } = await axios.get(`http://localhost:4000/status?id=${jobId}`);
        const { success, job, error } = statusData;

        // If job is done, clear the interval
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setstatus(jobStatus);
          if (jobStatus === "pending") return;

          setOutput(jobOutput);
          setisLoading(false); // Stop loading when output is received
          clearInterval(intervalId);
        } else {
          setstatus("Error: Please retry!");
          console.error(error);
          setisLoading(false); // Stop loading on error
          clearInterval(intervalId);
          setOutput(error);
        }
        console.log(statusData);
      }, 1000);
    } catch (error) {
      console.error(error);
      setisLoading(false); // Stop loading on catch
    }
  };
  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-900 flex items-center justify-center'>
      <div className='flex flex-col w-full max-w-[1400px] bg-[#202020] shadow-lg rounded-lg p-4 sm:p-6'>

        {/* Header */}
        <h1 className='text-white text-3xl sm:text-3xl mb-6 text-center'>
          RunMyCode
        </h1>

        {/* Form */}
        <form onSubmit={handleCode} className='flex flex-col gap-6 items-center w-full h-full'>

          {/* Language Selector and Run Button */}
          <div className='flex flex-col sm:flex-row items-center sm:justify-between w-full px-2'>
            <div className='flex flex-col sm:flex-row items-center gap-4'>
              <label className='text-white text-lg font-semibold'>
                Language:
              </label>
              <select
                onChange={(e) => {
                  setlanguage(e.target.value)
                }}
                className='bg-gray-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'>
                <option value='cpp'>C++</option>
                <option value='py'>Python</option>
                <option value='c'>C</option>
              </select>
            </div>
            <button type='submit' className='bg-blue-500 w-full sm:w-[120px] h-12 flex items-center justify-center mt-2 sm:mt-0 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition duration-300'>
              {isLoading ? <Loader /> : "Run"}
            </button>
          </div>

          {/* Code Editor and Output Section */}
          <div className='flex flex-col sm:flex-row gap-6 w-full h-[70vh] sm:h-[80vh]'>

            {/* Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='flex-[3] h-[94%] resize-none p-4 rounded-lg bg-[#1d1c1c] text-white border-2 border-gray-600 focus:border-blue-500 transition duration-300 ease-in-out overflow-y-auto'
              placeholder='Write your code here...'
              spellCheck="false"
            />

            {/* Output Section */}
            <div className='flex-[2] h-[94%] bg-[##1d1c1c] p-4 rounded-lg border-2 border-gray-600'>
              <div className='h-full overflow-y-auto'>
                <p className='text-gray-300 font-mono whitespace-pre-wrap break-words'>
                  {status}
                </p>
                {jobId && (
                  <p className='text-gray-400 text-sm mt-2'>
                    Code ID: <span className='font-semibold'>{jobId}</span>
                  </p>
                )}
                <pre className='text-gray-200 font-mono text-sm whitespace-pre-wrap break-words'>
                  {output}
                </pre>
                {output && (
                  <p className='text-green-500 mt-2 text-sm'>
                    === Code executed successfully ===
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

}

export default Page;
