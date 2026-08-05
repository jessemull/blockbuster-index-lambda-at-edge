require("dotenv").config();
const { spawn } = require("child_process");

const sshPrivateKeyPath = process.env.SSH_PRIVATE_KEY_PATH;
const sshUser = process.env.SSH_USER;
const sshHost = process.env.SSH_HOST;

if (!sshPrivateKeyPath || !sshUser || !sshHost) {
  console.error(
    "Missing required environment variables. Set SSH_HOST, SSH_USER, and SSH_PRIVATE_KEY_PATH in a .env file (see .env.example).",
  );
  process.exit(1);
}

const sshCommand = [
  "-i",
  sshPrivateKeyPath,
  "-p",
  "22",
  `${sshUser}@${sshHost}`,
];

console.log("Connecting to bastion host...");

const sshProcess = spawn("ssh", sshCommand, { stdio: "inherit" });

sshProcess.on("error", (error) => {
  console.error(`Failed to start SSH process: ${error.message}`);
  process.exit(1);
});

sshProcess.on("close", (code) => {
  process.exit(code ?? 0);
});
