const { exec } = require("node:child_process");

const startTime = Date.now();
const spinnerIntervalMs = 200;
const timeoutMs = 300000; // 5 min

function checkPostgres() {
  showWaitingMessage();

  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (Date.now() - startTime < timeoutMs) {
        if (stdout.search("accepting connections") === -1) {
          checkPostgres();
          return;
        }

        process.stdout.write(
          "\n🟢 PostgreSQL is ready and accepting connections!\n",
        );
      } else {
        process.stderr.write(
          "\n🔴 Timeout: PostgreSQL is not accepting connections.\n",
        );
        process.exit(1);
      }
    },
  );
}

function showWaitingMessage() {
  const spinner = [
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛",
  ];

  const spinnerIndex =
    Math.floor(Date.now() / spinnerIntervalMs) % spinner.length;

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

  process.stdout.write(
    `\r${spinner[spinnerIndex]} ` +
      `Waiting for PostgreSQL to accept connections...\t${elapsedTime}s`,
  );
}

checkPostgres();
