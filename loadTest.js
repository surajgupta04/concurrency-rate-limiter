const axios = require("axios");

const TOTAL_REQUESTS = 200;

async function runLoadTest() {

    console.log(
        `Starting ${TOTAL_REQUESTS} requests...\n`
    );

    const startTime = Date.now();

    const requests = [];

    for (
        let i = 0;
        i < TOTAL_REQUESTS;
        i++
    ) {

        requests.push(

            axios.post(
                "http://localhost:3000/api/request"
            )

        );

    }

    try {

        await Promise.all(requests);

        const endTime =
            Date.now();

        console.log(
            `Completed ${TOTAL_REQUESTS} requests`
        );

        console.log(
            `Time Taken: ${
                endTime - startTime
            } ms`
        );

    } catch (error) {

        console.error(
            "Load Test Error:",
            error.message
        );

    }

}

runLoadTest();