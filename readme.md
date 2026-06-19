live demo : https://concurrency-rate-limiter.onrender.com/

# Concurrent Rate Limiter & Request Queue Service

A backend system built using Node.js that demonstrates:

- Rate Limiting using Token Bucket Algorithm
- FIFO Request Queue
- Worker Pool Architecture
- Concurrent Request Processing
- Real-Time Monitoring Dashboard
- System Metrics Collection
- Activity Logging

---

# Project Overview

In real-world systems, thousands of requests may hit a server at the same time.

If all requests are processed immediately:

- CPU can become overloaded
- Memory usage can increase rapidly
- APIs may crash
- User experience degrades

To solve this problem, companies like Google, Amazon, Netflix, and Uber use:

1. Rate Limiting
2. Request Queues
3. Worker Pools

This project demonstrates these concepts in a simplified way.

---

# Architecture

Incoming Requests

↓

Token Bucket Rate Limiter

↓

FIFO Queue

↓

Worker Pool

↓

Processed Request

↓

Metrics Dashboard

---

# Technologies Used

## Backend

- Node.js
- Express.js
- Worker Threads

## Frontend

- HTML
- CSS
- JavaScript

## Concepts

- Concurrency
- Worker Threads
- Queue Data Structure
- Token Bucket Algorithm
- System Monitoring
- Real-Time Metrics

---

# Folder Structure

rate-limiter-service/

├── server.js

├── queue.js

├── rateLimiter.js

├── worker.js

├── metrics.js

├── package.json

├── public/

│ ├── index.html

│ ├── style.css

│ └── script.js

└── README.md

---

# Core Concepts

# 1. Rate Limiting

Rate Limiting controls how many requests are allowed during a time window.

Example:

Server allows:

10 requests per second

If 100 requests arrive:

First 10:

Accepted

Remaining:

Queued

Benefits:

- Prevents server overload
- Prevents abuse
- Improves stability

---

# 2. Token Bucket Algorithm

This project uses the Token Bucket Algorithm.

Imagine a bucket containing tokens.

Bucket Capacity = 10

Every request consumes:

1 token

If token exists:

Request accepted

If token does not exist:

Request queued

Tokens refill automatically every second.

Example:

Initial:

Tokens = 10

10 Requests arrive

Tokens become:

0

11th Request arrives

No token available

Request enters queue

After refill:

Tokens = 10

Queue starts processing again

---

# 3. FIFO Queue

FIFO:

First In First Out

Example:

Request A

Request B

Request C

Processing Order:

A

B

C

Why?

Fair processing.

No request jumps ahead.

---

# Queue Operations

enqueue()

Adds request.

dequeue()

Removes oldest request.

peek()

Returns first request.

size()

Current queue size.

isEmpty()

Checks queue status.

---

# 4. Worker Pool

Worker Pool = Group of workers processing jobs simultaneously.

In this project:

4 Workers

Worker 1

Worker 2

Worker 3

Worker 4

Instead of processing:

100 requests one-by-one

Workers process multiple requests concurrently.

Benefits:

- Better throughput
- Better scalability
- Faster processing

---

# Why Worker Threads?

Node.js is single-threaded.

Heavy CPU tasks can block the event loop.

Worker Threads allow:

Parallel execution

without blocking the main server.

Real companies use similar architectures for:

- Image processing
- Video processing
- Background jobs
- Analytics systems

---

# Concurrency vs Parallelism

Concurrency:

Multiple tasks make progress together.

Example:

Handling many requests.

Parallelism:

Multiple tasks run at the same time.

Example:

Worker Threads running simultaneously.

This project demonstrates both.

---

# Request Flow

Step 1

User clicks:

Send 100 Requests

↓

Step 2

Requests reach server

↓

Step 3

Token Bucket checks available tokens

↓

Step 4

Requests accepted or queued

↓

Step 5

Worker Pool picks queued jobs

↓

Step 6

Workers process requests

↓

Step 7

Metrics updated

↓

Step 8

Dashboard refreshes

---

# Metrics Collected

## Processed Requests

Total completed jobs.

---

## Queued Requests

Total requests placed in queue.

---

## Queue Size

Current queue length.

---

## Max Queue Size

Largest queue observed.

---

## Average Wait Time

Average time spent waiting before processing.

Formula:

Average Wait Time

=

Total Wait Time

/

Processed Requests

---

## Active Workers

Workers currently processing jobs.

---

## Total Workers

Maximum worker count.

---

## Requests Per Second

Throughput of the system.

Measures processing speed.

---

# Dashboard Features

Real-time metrics

Request simulator

Worker status monitor

Activity logs

Reset dashboard

Traffic visualization

Dark professional UI

---

# API Endpoints

## Send Request

POST

/api/request

Creates a new request.

---

## Metrics

GET

/api/metrics

Returns:

- Processed Requests
- Queue Size
- Workers
- Tokens
- Logs

---

## Reset Metrics

POST

/api/reset

Resets dashboard statistics.

---

# Example Scenario

User sends:

100 requests

Token Bucket:

10 tokens

Result:

10 accepted immediately

90 queued

Workers:

4

Workers start processing requests.

Queue gradually decreases.

Dashboard updates in real-time.

---

# What Interviewers Can Ask

## Why Rate Limiting?

Protects services from overload.

---

## Why Queue?

Stores excess requests safely.

---

## Why FIFO?

Fair request ordering.

---

## Why Worker Pool?

Improves throughput and concurrency.

---

## Why Worker Threads?

Provides parallel execution without blocking Node.js event loop.

---

## Difference Between Async and Worker Threads?

Async:

Good for I/O operations.

Worker Threads:

Good for parallel CPU or background processing.

---

## What Would You Improve?

- Redis Queue
- Distributed Rate Limiter
- RabbitMQ Integration
- Kafka Integration
- Docker Deployment
- Kubernetes Scaling
- Authentication
- Request Prioritization

---

# Resume Description

Concurrent Rate Limiter & Request Queue Service

- Built a concurrent request processing system using Node.js, Express, Worker Threads, and Token Bucket Rate Limiting.
- Implemented FIFO request queue to handle traffic bursts and prevent request loss.
- Designed a worker pool architecture with 4 concurrent workers for parallel request processing.
- Developed a real-time monitoring dashboard displaying throughput, queue size, active workers, token availability, and processing metrics.
- Added request logging, queue analytics, average wait time tracking, and system monitoring features.

---

# Learning Outcomes

After completing this project:

✓ Understand Rate Limiting

✓ Understand Token Bucket Algorithm

✓ Understand FIFO Queues

✓ Understand Worker Pools

✓ Understand Worker Threads

✓ Understand Concurrency

✓ Understand Parallel Processing

✓ Understand System Monitoring

✓ Understand Backend System Design

✓ Understand Real-World Traffic Management

---

# Author

Suraj Gupta

Backend Developer | MERN Stack | DSA Enthusiast
