import React from "react";
import {
  SiCplusplus,
  SiC,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiJson,
  SiCoffeescript,
  SiMarkdown,
} from "react-icons/si";

import {
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";

export function getFileIcon(
  name: string,
  type: "file" | "folder",
  isOpen?: boolean
) {
  /* ------------------ */
  /* FOLDER ICONS      */
  /* ------------------ */
  if (type === "folder") {
    return isOpen
      ? <FolderOpen size={16} className="text-blue-400" />
      : <Folder size={16} className="text-blue-400" />;
  }

  const ext = name.split(".").pop()?.toLowerCase();

  /* ------------------ */
  /* LANGUAGE ICONS    */
  /* ------------------ */
  switch (ext) {
    case "cpp":
    case "cc":
    case "cxx":
      return <SiCplusplus size={16} color="#00599C" />;

    case "c":
      return <SiC size={16} color="#A8B9CC" />;

    case "py":
      return <SiPython size={16} color="#3776AB" />;

    case "html":
      return <SiHtml5 size={16} color="#E34F26" />;

    case "css":
      return <SiCss3 size={16} color="#1572B6" />;

    case "js":
      return <SiJavascript size={16} color="#F7DF1E" />;

    case "ts":
    case "tsx":
      return <SiTypescript size={16} color="#3178C6" />;

    case "json":
      return <SiJson size={16} color="#000000" />;

    case "java":
      return <SiCoffeescript size={16} color="#007396" />;

    case "md":
      return <SiMarkdown size={16} color="#000000" />;

    default:
      return <FileText size={16} />;
  }
}
