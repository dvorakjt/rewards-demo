import { spawn } from "node:child_process";
import { detectPythonCommand } from "./detect-python-command";
import { JSONStreamParser } from "./json-stream-parser";
import { join } from "node:path";

export function watch(
  path: string,
  callback: (
    eventType: string,
    sourcePath: string,
    destinationPath: string
  ) => void
) {
  const python = detectPythonCommand();
  const pathToPythonScript = join(__dirname, "./create-watchdog-observer.py");
  const childProcess = spawn(python, [pathToPythonScript, path]);
  const parser = new JSONStreamParser();
  childProcess.stdout.pipe(parser);
  childProcess.stderr.on("data", (data) => console.log(data));
  parser.on("data", (data) => {
    callback(data.eventType, data.srcPath, data.destPath);
  });
  // should probably check in on child process periodically
  const killMainProcess = keepAlive();

  return {
    unwatch() {
      childProcess.kill();
      killMainProcess();
    },
  };
}

function keepAlive() {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}
