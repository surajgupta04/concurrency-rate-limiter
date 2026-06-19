const metrics = {

    processedRequests: 0,

    queuedRequests: 0,

    droppedRequests: 0,

    totalWaitTime: 0,

    maxQueueSize: 0,

    startTime: Date.now(),

    incrementProcessed() {

        this.processedRequests++;

    },

    incrementQueued() {

        this.queuedRequests++;

    },

    incrementDropped() {

        this.droppedRequests++;

    },

    addWaitTime(waitTime) {

        this.totalWaitTime += waitTime;

    },

    updateMaxQueueSize(currentQueueSize) {

        if (
            currentQueueSize >
            this.maxQueueSize
        ) {

            this.maxQueueSize =
                currentQueueSize;

        }

    },

    getAverageWaitTime() {

        if (
            this.processedRequests === 0
        ) {

            return 0;

        }

        return (
            this.totalWaitTime /
            this.processedRequests
        ).toFixed(2);

    },

    getRequestsPerSecond() {

        const uptimeSeconds =

            (
                Date.now() -
                this.startTime
            ) / 1000;

        if (
            uptimeSeconds <= 0
        ) {

            return 0;

        }

        return (
            this.processedRequests /
            uptimeSeconds
        ).toFixed(2);

    },

    reset() {

        this.processedRequests = 0;

        this.queuedRequests = 0;

        this.droppedRequests = 0;

        this.totalWaitTime = 0;

        this.maxQueueSize = 0;

        this.startTime =
            Date.now();

    },

    getMetrics() {

        return {

            processedRequests:
                this.processedRequests,

            queuedRequests:
                this.queuedRequests,

            droppedRequests:
                this.droppedRequests,

            averageWaitTime:
                this.getAverageWaitTime(),

            maxQueueSize:
                this.maxQueueSize,

            requestsPerSecond:
                this.getRequestsPerSecond()

        };

    }

};

module.exports = metrics;