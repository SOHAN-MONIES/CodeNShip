export type Project = {
    id: string;
    userId: string;
    name: string;
    type: "Web" | "C++" | "C" | "Python" | "Java";
    createdAt: string;
};