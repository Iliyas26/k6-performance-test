import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    thresholds: {
        'http_req_duration{scenario:GetAPI}': ['p(95)<500'], // 95% of requests should complete under 500ms
    },
    scenarios: {
        GetAPI: {
            executor: 'ramping-vus',
            stages: [
                { duration: '1m', target: 200 },  // Ramp-up to 200 users over 1 minute
                { duration: '1m', target: 500 }, // Stay at 500 users for 1 minute
                { duration: '1m', target: 0 },   // Ramp-down to 0 users in 1 minute
            ],
            exec: 'getAPI',
        },
    },
};

// Function for "GetAPI" scenario
export function getAPI() {
    const url = 'https://httpbin.org/get';
    let response = http.get(url);

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(1); // Add a sleep between iterations if necessary
}
