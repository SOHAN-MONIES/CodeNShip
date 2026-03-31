import { Request, Response } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import prettier from "prettier";

export const formatCode = async (req: Request, res: Response) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        let formattedCode = code;

        switch (language) {
            case "javascript":
            case "js":
            case "typescript":
            case "ts":
            case "html":
            case "css":
            case "json":
                const parserMap: Record<string, string> = {
                    javascript: "babel",
                    js: "babel",
                    typescript: "typescript",
                    ts: "typescript",
                };
                formattedCode = await prettier.format(code, {
                    parser: parserMap[language] || language,
                    semi: true,
                    singleQuote: false,
                    tabWidth: 4,
                });
                break;

            case "python":
            case "py":
                formattedCode = await formatWithCommand("black -q -", code);
                break;

            case "cpp":
            case "c":
                formattedCode = await formatWithCommand("clang-format", code);
                break;

            case "java":
                // For Java, we'll use a simple placeholder or a basic indentation fixer 
                // as installing google-java-format JAR might be too complex for now
                // but we can try clang-format with java style if available
                formattedCode = await formatWithCommand("clang-format --style=Google", code);
                break;

            default:
                return res.status(400).json({ error: "Unsupported language for formatting" });
        }

        res.json({ formattedCode });

    } catch (err: any) {
        console.error("Formatting error:", err);
        res.status(500).json({ error: "Formatting failed", details: err.message });
    }
};

/**
 * Helper to run a CLI command and pipe code to stdin
 */
function formatWithCommand(command: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
                return;
            }
            resolve(stdout);
        });

        if (child.stdin) {
            child.stdin.write(code);
            child.stdin.end();
        } else {
            reject("Failed to open stdin for formatting command");
        }
    });
}
