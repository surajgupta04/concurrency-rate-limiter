class TokenBucket {

    constructor(capacity, refillRate) {

        this.capacity = capacity;

        this.tokens = capacity;

        this.refillRate = refillRate;

        setInterval(() => {

            this.tokens = Math.min(
                this.capacity,
                this.tokens + this.refillRate
            );

        }, 1000);
    }

    allowRequest() {

        if (this.tokens > 0) {

            this.tokens--;

            return true;
        }

        return false;
    }

    getAvailableTokens() {
        return this.tokens;
    }

}

module.exports = TokenBucket;