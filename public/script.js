const processedRequests =
    document.getElementById(
        "processedRequests"
    );

const queuedRequests =
    document.getElementById(
        "queuedRequests"
    );

const availableTokens =
    document.getElementById(
        "availableTokens"
    );

const queueSize =
    document.getElementById(
        "queueSize"
    );

const averageWaitTime =
    document.getElementById(
        "averageWaitTime"
    );

const maxQueueSize =
    document.getElementById(
        "maxQueueSize"
    );

const activeWorkers =
    document.getElementById(
        "activeWorkers"
    );

const totalWorkers =
    document.getElementById(
        "totalWorkers"
    );

const requestsPerSecond =
    document.getElementById(
        "requestsPerSecond"
    );

const workerStatusContainer =
    document.getElementById(
        "workerStatusContainer"
    );

const logContainer =
    document.getElementById(
        "logContainer"
    );

const sendOneButton =
    document.getElementById(
        "sendOne"
    );

const sendHundredButton =
    document.getElementById(
        "sendHundred"
    );

const sendThousandButton =
    document.getElementById(
        "sendThousand"
    );

const resetDashboardButton =
    document.getElementById(
        "resetDashboard"
    );

/*
----------------------------------
FETCH METRICS
----------------------------------
*/

async function fetchMetrics() {

    try {

        const response =
            await fetch(
                "/api/metrics"
            );

        const data =
            await response.json();

        processedRequests.textContent =
            data.processedRequests;

        queuedRequests.textContent =
            data.queuedRequests;

        availableTokens.textContent =
            data.availableTokens;

        queueSize.textContent =
            data.queueSize;

        averageWaitTime.textContent =
            `${data.averageWaitTime} ms`;

        maxQueueSize.textContent =
            data.maxQueueSize;

        activeWorkers.textContent =
            data.activeWorkers;

        totalWorkers.textContent =
            data.totalWorkers;

        requestsPerSecond.textContent =
            data.requestsPerSecond;

        renderLogs(
            data.logs || []
        );

        renderWorkers(
            data.workerStatus || []
        );

    } catch (error) {

        console.error(
            "Metrics Error:",
            error
        );

    }

}

/*
----------------------------------
RENDER WORKERS
----------------------------------
*/

function renderWorkers(
    workers
) {

    workerStatusContainer.innerHTML =
        "";

    if (
        workers.length === 0
    ) {

        workerStatusContainer.innerHTML = `
            <div class="log-item">
                No workers found
            </div>
        `;

        return;

    }

    workers.forEach(worker => {

        const workerCard =
            document.createElement(
                "div"
            );

        workerCard.className =
            "worker-card";

        workerCard.innerHTML = `

            <h3>
                Worker ${worker.id}
            </h3>

            <p class="
                ${worker.status === "Busy"
                    ? "worker-busy"
                    : "worker-idle"}
            ">
                ${worker.status}
            </p>

        `;

        workerStatusContainer
            .appendChild(
                workerCard
            );

    });

}

/*
----------------------------------
RENDER LOGS
----------------------------------
*/

function renderLogs(
    logs
) {

    logContainer.innerHTML =
        "";

    if (
        logs.length === 0
    ) {

        logContainer.innerHTML = `
            <div class="log-item">
                No activity yet...
            </div>
        `;

        return;

    }

    logs.forEach(log => {

        const logElement =
            document.createElement(
                "div"
            );

        logElement.className =
            "log-item";

        logElement.innerHTML = `

            <strong>
                ${log.timestamp}
            </strong>

            <br>

            ${log.message}

        `;

        logContainer.appendChild(
            logElement
        );

    });

}

/*
----------------------------------
SEND ONE REQUEST
----------------------------------
*/

async function sendRequest() {

    try {

        await fetch(
            "/api/request",
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.error(
            error
        );

    }

}

/*
----------------------------------
SEND BULK REQUESTS
----------------------------------
*/

async function sendBulkRequests(
    count
) {

    const requests = [];

    for (
        let i = 0;
        i < count;
        i++
    ) {

        requests.push(

            fetch(
                "/api/request",
                {
                    method: "POST"
                }
            )

        );

    }

    await Promise.all(
        requests
    );

}

/*
----------------------------------
RESET DASHBOARD
----------------------------------
*/

async function resetDashboard() {

    try {

        await fetch(
            "/api/reset",
            {
                method: "POST"
            }
        );

        fetchMetrics();

    } catch (error) {

        console.error(
            error
        );

    }

}

/*
----------------------------------
BUTTON EVENTS
----------------------------------
*/

sendOneButton.addEventListener(
    "click",
    () => {

        sendRequest();

    }
);

sendHundredButton.addEventListener(
    "click",
    () => {

        sendBulkRequests(
            100
        );

    }
);

sendThousandButton.addEventListener(
    "click",
    () => {

        sendBulkRequests(
            1000
        );

    }
);

resetDashboardButton.addEventListener(
    "click",
    () => {

        resetDashboard();

    }
);

/*
----------------------------------
INITIAL LOAD
----------------------------------
*/

fetchMetrics();

/*
----------------------------------
AUTO REFRESH
----------------------------------
*/

setInterval(
    fetchMetrics,
    1000
);