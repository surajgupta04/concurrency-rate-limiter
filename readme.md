
# Concurrent Rate Limiter & Request Queue

A small Node.js backend that protects a server from traffic bursts using a token bucket rate limiter, a FIFO queue, and a worker pool — with a live dashboard so you can actually watch it happen instead of reading numbers in a terminal.

**Live demo:** https://concurrency-rate-limiter.onrender.com/
(Hosted on Render's free tier, so the first request after a period of inactivity can take 30-50s to wake up — give it a moment.)

<img width="1500" height="732" alt="image" src="https://github.com/user-attachments/assets/a887636b-ac99-42c8-8c09-46cc88cfde5a" />
<img width="1232" height="967" alt="image" src="https://github.com/user-attachments/assets/f95275de-3926-4b80-9e16-5b743ec16cc3" />

## Why I built this

This is the pattern companies like Stripe and Cloudflare use to stop traffic spikes from taking down a service: don't reject excess requests, queue them and process what you can handle, when you can handle it. I wanted to build it from scratch instead of just dropping in `express-rate-limit`, to actually understand what's happening under the hood — token refill timing, queue backpressure, and how a worker pool processes jobs concurrently without blocking Node's event loop.

## How it works

- **Token bucket** — the bucket holds a fixed number of tokens (10) and refills once per second. Every request consumes a token. If the bucket is empty, the request goes to the queue instead of being dropped.
- **FIFO queue** — requests that couldn't get a token wait here, in arrival order, until a worker picks them up.
- **Worker pool** — 4 workers pull jobs off the queue and process them concurrently, instead of one request blocking the next.
- **Dashboard** — polls `/api/metrics` and renders queue size, active workers, throughput, and a live activity log.

```
Incoming requests → Token bucket → FIFO queue (if no token) → Worker pool → Metrics
```

## Tech stack

- Node.js, Express
- Worker Threads (`worker_threads`) for the worker pool
- Vanilla HTML/CSS/JS for the dashboard — no frontend framework

## Running it locally

```bash
git clone https://github.com/surajgupta04/concurrency-rate-limiter.git
cd concurrency-rate-limiter
npm install
node server.js
```

Then open `http://localhost:3000` (or whatever port is logged on start).

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/request` | Submit a request to the limiter/queue |
| GET | `/api/metrics` | Current metrics snapshot (queue size, tokens, workers, throughput) |
| POST | `/api/reset` | Reset all dashboard stats |

## Load testing

`loadTest.js` fires a burst of requests against the running server so you can watch the queue fill and drain on the dashboard in real time. Run it with the server already running:

```bash
node loadTest.js
```

## Known limitations

- **Single instance only.** The token bucket and queue live in process memory, so this only works correctly behind one server instance. Running multiple instances behind a load balancer would let each instance hand out its own full set of tokens — the limiter would no longer be enforcing a real global limit.
- **Worker threads are doing simulated work**, not real CPU-bound processing. For genuinely I/O-bound request handling, Node's event loop already handles concurrency without extra threads — worker threads earn their place once there's actual CPU-heavy work (image/video processing, batch analytics, etc.) to take off the main thread.
- State resets on restart — nothing is persisted.

## What I'd build next

- Move the token bucket into Redis (`INCR`/`EXPIRE` or a Lua script) so the limit holds across multiple server instances instead of resetting per-process
- Containerize with Docker so it's a one-command spin-up
- Per-client rate limiting (currently the limiter is global, not per-user/IP)

## Author

Suraj Gupta — backend development, MERN stack
