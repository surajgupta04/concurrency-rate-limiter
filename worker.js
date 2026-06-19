const { parentPort } = require("worker_threads");

parentPort.on("message", (job) => {

    const processingTime =
        Math.floor(Math.random() * 2000) + 500;

    console.log(
        `Worker processing Job ${job.id}`
    );

    setTimeout(() => {

        parentPort.postMessage({
            jobId: job.id,
            status: "completed",
            processingTime
        });

    }, processingTime);

});