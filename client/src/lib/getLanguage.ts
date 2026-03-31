export function getLanguageFromFileName(
    fileName: string
): string {

    const ext = fileName.split(".").pop()?.toLowerCase();

    switch (ext) {
        case "js":
            return "javascript";


case "ts":
  return "typescript";

case "jsx":
  return "javascript";

case "tsx":
  return "typescript";

case "html":
  return "html";

case "css":
  return "css";

case "json":
  return "json";

case "md":
  return "markdown";

case "py":
  return "python";

case "cpp":
case "cc":
case "cxx":
  return "cpp";

case "c":
  return "c";

case "java":
  return "java";

case "sh":
  return "shell";

case "yml":
case "yaml":
  return "yaml";

default:
  return "plaintext";


    }
}
