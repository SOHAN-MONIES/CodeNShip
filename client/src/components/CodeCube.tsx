"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

// Use ThreeElements['group'] to inherit standard group/object3D props
function Cube(props: ThreeElements["group"]) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const wireframeRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState<boolean>(false);

    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.15;
        }
        if (wireframeRef.current) {
            wireframeRef.current.rotation.x += delta * 0.1;
            wireframeRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group {...props}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <icosahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color={hovered ? "#6366f1" : "#4338ca"}
                    speed={2}
                    distort={0.4}
                    radius={1}
                />
            </mesh>
            {/* Outer wireframe shell */}
            <mesh ref={wireframeRef}>
                <icosahedronGeometry args={[2.1, 1]} />
                <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

export default function CodeCube() {
    return (
        <div className="h-[500px] w-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} color="#818cf8" intensity={2} />
                <pointLight position={[0, -5, 5]} color="#c084fc" intensity={1.5} />
                <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
                    <Cube position={[0, 0, 0]} />
                </Float>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
                <gridHelper args={[30, 30, "#1e293b", "#050505"]} position={[0, -5, 0]} />
            </Canvas>
        </div>
    );
}