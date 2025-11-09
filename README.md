TaskQueueCLI — Background Job Queue System

TaskQueueCLI is a simple Node.js-based background job processor that runs and manages tasks asynchronously through a command-line interface.
It supports multiple worker execution, retry logic, and persistent job storage using JSON.


🧠 Overview

This CLI tool allows you to:
	•	Enqueue shell commands as background jobs
	•	Run one or more workers to process jobs
	•	Retry failed jobs automatically with exponential backoff
	•	Persist all jobs across runs
	•	Handle failed jobs via a Dead Letter Queue (DLQ)


🧩 Folder Structure

TaskQueueCLI/

├── main.js             # CLI entry point

├── taskManager.js      # Core queue management logic

├── taskWorker.js       # Background job executor

├── settings.json       # Configuration (retries, timeout, etc.)

├── tasks.json          # Job + DLQ data

├── helpers/

│   └── fileLock.js     # File locking utility

└── job-logs/           # Stores job output and logs



⚙️ How It Works
	1.	Add a Job:
You can queue any shell command for background execution.
	2.	Worker Execution:
Workers pick jobs one by one, execute them, and update job states.
	3.	Retry Mechanism:
Failed jobs retry automatically based on configured limits and backoff rate.
	4.	Dead Letter Queue (DLQ):
If retries are exhausted, failed jobs are moved to DLQ for review.



💻 Example Usage

➕ Add Job

node main.js enqueue "echo Hello TaskQueueCLI"

🏃 Start Worker

node main.js worker start --count 2

📊 Check Status

node main.js status

☠️ View DLQ

node main.js dlq list




📁 Persistent Data

File	Description
tasks.json	Stores all job data (pending, processing, completed, dead)
settings.json	Stores configuration (retries, backoff, timeout)
job-logs/	Contains logs for each executed job




🧾 Tech Stack
	•	Node.js (v18+)
	•	Libraries: commander, fs-extra, uuid, chalk
	•	Storage: JSON-based persistence



🧠 Example Run Output

Starting 2 worker(s)...
🧑‍🏭 Worker w-1 started
🧑‍🏭 Worker w-2 started
✅ Job echo Hello TaskQueueCLI completed
🔁 Job not_a_real_command failed → will retry
☠️ Job not_a_real_command moved to DLQ


