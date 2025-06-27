import { execSync } from "child_process";

export function detectPythonCommand() {
  const possibleCommands = ["python3", "python", "py"];
  for (const command of possibleCommands) {
    try {
      execSync(`${command} --version`, { stdio: "ignore" });
      return command;
    } catch (e) {}
  }

  throw new Error("Python could not be found.");
}
