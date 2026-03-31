"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Project } from "@/types/project";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreated: (project: Project) => void;
};

export default function CreateProjectDialog({
                                                open,
                                                setOpen,
                                                onCreated,
                                            }: Props) {
    const [name, setName] = useState("");
    const [type, setType] = useState("Web");

    const { user } = useUser();

    const handleCreate = async () => {
        if (!user) return;


const res = await fetch(
  "http://localhost:8000/api/projects",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      type,
      userId: user.id,
    }),
  }
);

const data = await res.json();

onCreated(data);
setOpen(false);

// reset form
setName("");
setType("Web");


    };

    return ( <Dialog open={open} onOpenChange={setOpen}> <DialogContent className="space-y-4">


        <DialogHeader>
            <DialogTitle>
                Create Project
            </DialogTitle>
        </DialogHeader>

        <Input
            placeholder="Project name"
            value={name}
            onChange={(e) =>
                setName(e.target.value)
            }
        />

        <select
            className="border rounded-md p-2"
            value={type}
            onChange={(e) =>
                setType(e.target.value)
            }
        >
            <option value="Web">Web</option>
            <option value="C++">C++</option>
            <option value="C">C</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
        </select>

        <Button onClick={handleCreate}>
            Create
        </Button>

    </DialogContent>
    </Dialog>


);
}
