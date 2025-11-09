const fs = require("fs");
const path = require("path");

const LOCKFILE = path.join(__dirname, "..", ".queue.lock");

/**
 * Cross-platform safe lock.
 * Works on Windows reliably — no exclusive handle issues.
 */
async function withLock(fn, retryMs = 200, maxRetries = 25) {
  let retries = 0;

  while (true) {
    try {
      // If lock file already exists, check if it's stale (>15s old)
      if (fs.existsSync(LOCKFILE)) {
        const stat = fs.statSync(LOCKFILE);
        const age = Date.now() - stat.mtimeMs;
        if (age > 15000) {
          console.warn("⚠️ Removing stale lock file");
          fs.unlinkSync(LOCKFILE);
        } else {
          throw new Error("locked");
        }
      }

      // Create a lightweight lock marker (not exclusive handle)
      fs.writeFileSync(LOCKFILE, String(Date.now()));

      // Run your critical section
      const result = await fn();

      // Remove lock after done
      fs.unlinkSync(LOCKFILE);
      return result;
    } catch (e) {
      if (e.message === "locked") {
        retries++;
        if (retries > maxRetries) {
          throw new Error("❌ Could not acquire lock after multiple attempts. Try again later.");
        }
        await new Promise((r) => setTimeout(r, retryMs));
      } else if (e.code === "EEXIST") {
        // fallback for rare race conditions
        await new Promise((r) => setTimeout(r, retryMs));
      } else {
        throw e;
      }
    }
  }
}

module.exports = { withLock };
