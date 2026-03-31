import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import {useRouter} from "next/navigation";

const typeIcon: Record<string, string> = {
    Web: "🌐",
    "C++": "⚙️",
    C: "🧠",
    Python: "🐍",
    Java: "☕",
};

type Props = {
    project: Project;
    onDelete?: (id: string) => void;
};

export default function ProjectCard({
                                        project,
                                        onDelete,
                                    }: Props) {
    const handleDelete = (
        e: React.MouseEvent
    ) => {
        e.stopPropagation(); // prevent card click
        onDelete?.(project.id);
    };
    const router = useRouter();

    const openProject = () => {
        router.push(
            `/dashboard/project/${project.id}`
        );
    };

    return ( <Card onClick={openProject}
            className="group hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

        <CardContent className="p-6 space-y-4">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="text-2xl">
                    {typeIcon[project.type]}
                </div>

                <h2 className="font-semibold text-lg">
                    {project.name}
                </h2>
            </div>

            {/* Meta */}
            <div className="text-sm text-muted-foreground">
                Type: {project.type}
            </div>

            <div className="text-xs text-muted-foreground">
                Created:{" "}
                {new Date(
                    project.createdAt
                ).toLocaleDateString()}
            </div>

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition flex gap-3 pt-2 text-sm font-medium">

      <span className="hover:underline">
        Open →
      </span>

                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:underline"
                >
                    Delete 🗑️
                </button>

            </div>

        </CardContent>
    </Card>


);
}
