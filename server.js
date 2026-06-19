const express = require("express");
const path = require("path");
const { Worker } = require("worker_threads");

const RequestQueue = require("./queue");
const TokenBucket = require("./rateLimiter");
const metrics = require("./metrics");

const app = express();

const PORT = 3000;

const queue = new RequestQueue();

const rateLimiter =
    new TokenBucket(10, 5);

const workers = [];

const NUM_WORKERS = 4;

const activityLogs = [];

let jobId = 1;

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/*
---------------------------------
ACTIVITY LOGS
---------------------------------
*/

function addLog(message) {

    activityLogs.unshift({

        message,

        timestamp:
            new Date()
            .toLocaleTimeString()

    });

    if (
        activityLogs.length > 50
    ) {

        activityLogs.pop();

    }

}

/*
---------------------------------
CREATE WORKER POOL
---------------------------------
*/

for (
    let i = 0;
    i < NUM_WORKERS;
    i++
) {

    const worker =
        new Worker(
            "./worker.js"
        );

    worker.busy = false;

    worker.on(
        "message",
        (result) => {

            worker.busy = false;

            metrics.incrementProcessed();

            addLog(
                `Job ${result.jobId} completed in ${result.processingTime} ms`
            );

            console.log(
                `Job ${result.jobId} completed`
            );

            processQueue();

        }
    );

    worker.on(
        "error",
        (error) => {

            console.error(
                "Worker Error:",
                error
            );

        }
    );

    workers.push(worker);

}

/*
---------------------------------
GET FREE WORKER
---------------------------------
*/

function getFreeWorker() {

    return workers.find(

        worker => !worker.busy

    );

}

/*
---------------------------------
WORKER STATUS
---------------------------------
*/

function getWorkerStatus() {

    return workers.map(

        (worker, index) => ({

            id: index + 1,

            status:
                worker.busy
                    ? "Busy"
                    : "Idle"

        })

    );

}

/*
---------------------------------
PROCESS QUEUE
---------------------------------
*/

function processQueue() {

    while (
        !queue.isEmpty()
    ) {

        const worker =
            getFreeWorker();

        if (!worker) {

            return;

        }

        const job =
            queue.dequeue();

        worker.busy = true;

        const waitTime =

            Date.now() -
            job.createdAt;

        metrics.addWaitTime(
            waitTime
        );

        worker.postMessage(
            job
        );

    }

}

/*
---------------------------------
SEND REQUEST
---------------------------------
*/

app.post(
    "/api/request",
    (req, res) => {

        const request = {

            id: jobId++,

            createdAt:
                Date.now()

        };

        /*
        -----------------------------
        TOKEN AVAILABLE
        -----------------------------
        */

        if (
            rateLimiter.allowRequest()
        ) {

            queue.enqueue(
                request
            );

            metrics.updateMaxQueueSize(
                queue.size()
            );

            addLog(
                `Request ${request.id} accepted by rate limiter`
            );

            processQueue();

            return res.json({

                success: true,

                message:
                    "Request Accepted",

                requestId:
                    request.id

            });

        }

        /*
        -----------------------------
        TOKEN NOT AVAILABLE
        -----------------------------
        */

        metrics.incrementQueued();

        queue.enqueue(
            request
        );

        metrics.updateMaxQueueSize(
            queue.size()
        );

        addLog(
            `Request ${request.id} moved to queue`
        );

        processQueue();

        return res.json({

            success: true,

            message:
                "Request Queued",

            requestId:
                request.id

        });

    }
);

/*
---------------------------------
GET METRICS
---------------------------------
*/

app.get(
    "/api/metrics",
    (req, res) => {

        res.json({

            ...metrics.getMetrics(),

            queueSize:
                queue.size(),

            availableTokens:
                rateLimiter.getAvailableTokens(),

            activeWorkers:
                workers.filter(
                    worker => worker.busy
                ).length,

            totalWorkers:
                NUM_WORKERS,

            workerStatus:
                getWorkerStatus(),

            logs:
                activityLogs

        });

    }
);

/*
---------------------------------
RESET DASHBOARD
---------------------------------
*/

app.post(
    "/api/reset",
    (req, res) => {

        metrics.reset();

        activityLogs.length = 0;

        jobId = 1;

        res.json({

            success: true,

            message:
                "Dashboard Reset Successfully"

        });

    }
);

/*
---------------------------------
START SERVER
---------------------------------
*/

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);