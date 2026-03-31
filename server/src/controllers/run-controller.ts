import { Request, Response } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const runCode = async (req: Request, res: Response) => {
  try {
    const { code, language, input } = req.body;

    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    let filePath = "";
    let command = "";
    let args: string[] = [];
    let isCompiled = false;

    /* ---------------- */
    /* SETUP EXECUTION  */
    /* ---------------- */
    switch (language) {
      case "cpp":
        filePath = path.join(tempDir, "main.cpp");
        fs.writeFileSync(filePath, code);
        command = "g++";
        args = [filePath, "-o", "temp/main"];
        isCompiled = true;
        break;

      case "c":
        filePath = path.join(tempDir, "main.c");
        fs.writeFileSync(filePath, code);
        command = "gcc";
        args = [filePath, "-o", "temp/main"];
        isCompiled = true;
        break;

      case "java":
        filePath = path.join(tempDir, "Main.java");
        fs.writeFileSync(filePath, code);
        command = "javac";
        args = [filePath];
        isCompiled = true;
        break;

      case "python":
        filePath = path.join(tempDir, "main.py");
        fs.writeFileSync(filePath, code);
        command = "python3";
        args = [filePath];
        isCompiled = false;
        break;

      case "javascript":
        filePath = path.join(tempDir, "main.js");
        fs.writeFileSync(filePath, code);
        command = "node";
        args = [filePath];
        isCompiled = false;
        break;

      case "typescript":
        filePath = path.join(tempDir, "main.ts");
        fs.writeFileSync(filePath, code);
        // Using npx ts-node for direct execution
        command = "npx";
        args = ["ts-node", filePath];
        isCompiled = false;
        break;

      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    if (isCompiled) {
      // COMPILE PATH
      const compile = spawn(command, args);
      let compileError = "";

      compile.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      compile.on("close", (code) => {
        if (code !== 0) {
          return res.json({ output: "", error: "Compilation Error:\n" + compileError });
        }

        let runCmd = "";
        let runArgs: string[] = [];

        if (language === "cpp" || language === "c") {
          runCmd = "./temp/main";
        } else if (language === "java") {
          runCmd = "java";
          runArgs = ["-cp", "temp", "Main"];
        }

        execute(runCmd, runArgs, input, res);
      });
    } else {
      // INTERPRETED PATH
      execute(command, args, input, res);
    }

  } catch (err) {
    console.error("Run error:", err);
    res.status(500).json({ error: "Execution failed" });
  }
};

/**
 * Helper to handle the actual execution of the process
 */
function execute(command: string, args: string[], input: string | undefined, res: Response) {
  const run = spawn(command, args);

  if (input) {
    run.stdin.write(input);
  }
  run.stdin.end();

  let output = "";
  let error = "";

  run.stdout.on("data", (data) => {
    output += data.toString();
  });

  run.stderr.on("data", (data) => {
    error += data.toString();
  });

  run.on("close", () => {
    res.json({ output, error });
  });

  run.on("error", (err) => {
    res.json({ output: "", error: "Execution failed to start: " + err.message });
  });
}
