import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

// Individual Keycap Component
function Keycap({ position, gridPosition }: { position: [number, number, number], gridPosition: [number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const targetZ = useRef(0);
  const { mouse, camera, raycaster } = useThree();

  // Create keycap geometry (chunky 1x1x1 cube-like keycap)
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Create base shape - much bigger keys (3x scale)
    const baseSize = 1.5;       // Bottom size (3.0 total width)
    const topSize = 1.35;       // Top size (2.7 total width for subtle taper)
    
    shape.moveTo(-topSize, -topSize);
    shape.lineTo(topSize, -topSize);
    shape.lineTo(topSize, topSize);
    shape.lineTo(-topSize, topSize);
    shape.closePath();

    const extrudeSettings = {
      depth: 2.4,              // Very tall chunky keys
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Create edge geometry for the glow effect
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15);
  }, [geometry]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Create a plane at z=0 for raycasting
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    
    // Get ray from camera through mouse position
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectPoint);

    // Calculate distance from mouse to this keycap in 2D (x, y)
    const dx = intersectPoint.x - position[0];
    const dy = intersectPoint.y - position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Create smooth wave/pyramid effect
    const influenceRadius = 8;      // Larger radius for gradual wave
    const maxHeight = 3.5;           // Taller peak for dramatic effect
    const falloffPower = 2;          // Controls wave steepness (higher = steeper)

    // Calculate target height with smooth falloff
    if (distance < influenceRadius) {
      // Smooth gradient from center to edge
      const normalizedDistance = distance / influenceRadius;
      const influence = Math.pow(1 - normalizedDistance, falloffPower);
      targetZ.current = influence * maxHeight;
    } else {
      targetZ.current = 0;
    }

    // Smooth lerp to target position (very slow for ultra-smooth motion)
    const currentZ = meshRef.current.position.z;
    const newZ = THREE.MathUtils.lerp(currentZ, targetZ.current, 0.05);
    meshRef.current.position.z = newZ;
    
    if (edgesRef.current) {
      edgesRef.current.position.z = newZ;
    }
  });

  return (
    <group position={position}>
      {/* Main keycap mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Glowing edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>
      
      {/* Additional purple glow on edges */}
      <lineSegments geometry={edgesGeometry} position={[0, 0, 0.01]}>
        <lineBasicMaterial
          color="#b800ff"
          transparent
          opacity={0.4}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

// Grid of Keycaps
function KeycapGrid() {
  const keycaps = useMemo(() => {
    const grid: Array<{ position: [number, number, number], gridPosition: [number, number] }> = [];
    const gridSize = 35; // 35x35 grid to reach edges
    const spacing = 3.2;  // Large spacing for big keys
    
    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        grid.push({
          position: [x * spacing, y * spacing, 0],
          gridPosition: [x, y]
        });
      }
    }
    
    return grid;
  }, []);

  return (
    <>
      {keycaps.map((keycap, i) => (
        <Keycap 
          key={i} 
          position={keycap.position} 
          gridPosition={keycap.gridPosition}
        />
      ))}
    </>
  );
}

// Main Background Component
export function KeycapBackground3D() {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',  // Only fill hero section
        zIndex: 1,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a1a 50%, #000000 100%)',
      }}
    >
      <Canvas>
        {/* Isometric camera setup */}
        <OrthographicCamera
          makeDefault
          zoom={10}
          position={[10, 10, 10]}
          rotation={[-Math.PI / 6, Math.PI / 4, 0]}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#b800ff" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
        
        {/* The grid of keycaps */}
        <KeycapGrid />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#000000', 10, 30]} />
      </Canvas>
    </div>
  );
}
