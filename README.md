# k6 Performance Test Project

This project contains a k6 script for load testing using HTTP requests, checking for status and response time metrics, with scenarios for ramping up and down virtual users.

## Project Structure

- `test-script.js` - Contains the main k6 load test script.
- `README.md` - Documentation for the project.

## Prerequisites

- [k6](https://k6.io/docs/getting-started/installation/) must be installed on your system.

## k6 Script: test-script.js

This script uses `ramping-vus` to simulate users. The performance thresholds and stages are defined as follows:

1. **Thresholds**:
- 95% of requests should complete within 500ms.

2. **Scenarios**:
- Ramp up to 200 users over 1 minute.
- Stay at 500 users for 1 minute.
- Ramp down to 0 users in 1 minute.

3. **Target URL**:
- `https://httpbin.org/get`

## Usage

### Running the Test

Run the k6 test using the following command:
```bash
k6 run test-script.js
