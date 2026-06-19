class RequestQueue {

    constructor() {
        this.queue = [];
    }

    // Add request to queue
    enqueue(request) {
        this.queue.push(request);
    }

    // Remove oldest request
    dequeue() {

        if (this.isEmpty()) {
            return null;
        }

        return this.queue.shift();
    }

    // Number of waiting requests
    size() {
        return this.queue.length;
    }

    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }

    // View first request
    peek() {

        if (this.isEmpty()) {
            return null;
        }

        return this.queue[0];
    }

}

module.exports = RequestQueue;