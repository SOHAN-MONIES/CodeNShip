"use client"; // This is the key!

import dynamic from 'next/dynamic';

// We move the dynamic import here
const CodeCubeScene = dynamic(() => import('./CodeCube'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] flex items-center justify-center">
            <p className="text-slate-500 animate-pulse">Initializing 3D Workspace...</p>
        </div>
    )
});

export default function VisualWrapper() {
    return <CodeCubeScene />;
}