import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Cube {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  rotationX: number;
  rotationY: number;
  color: string;
}

export function Interactive3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cubes, setCubes] = useState<Cube[]>([]);

  // Generate cubes on mount
  useEffect(() => {
    const colors = [
      'rgba(139, 92, 246, 0.6)',   // Purple
      'rgba(168, 85, 247, 0.5)',   // Violet
      'rgba(192, 132, 252, 0.4)',  // Light purple
      'rgba(99, 102, 241, 0.5)',   // Indigo
      'rgba(129, 140, 248, 0.4)',  // Light indigo
      'rgba(236, 72, 153, 0.3)',   // Pink
    ];

    const generatedCubes: Cube[] = [];
    
    // Create a grid of cubes (similar to image)
    for (let i = 0; i < 25; i++) {
      generatedCubes.push({
        id: i,
        x: 50 + Math.random() * 40, // Right side of screen (50% - 90%)
        y: 20 + Math.random() * 60, // Spread vertically
        z: Math.random() * 200 - 100,
        size: 40 + Math.random() * 40,
        rotationX: Math.random() * 45 - 22.5,
        rotationY: Math.random() * 45 - 22.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    setCubes(generatedCubes);
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        perspective: '1000px',
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-purple-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* 3D Cubes */}
      {cubes.map((cube) => {
        const parallaxX = mousePosition.x * (cube.z + 100) * 0.3;
        const parallaxY = mousePosition.y * (cube.z + 100) * 0.3;
        const rotateX = cube.rotationX + mousePosition.y * 20;
        const rotateY = cube.rotationY + mousePosition.x * 20;

        return (
          <motion.div
            key={cube.id}
            className="absolute"
            style={{
              left: `${cube.x}%`,
              top: `${cube.y}%`,
              width: cube.size,
              height: cube.size,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              x: parallaxX,
              y: parallaxY,
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 20,
            }}
          >
            {/* Cube faces */}
            <div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0)',
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 border border-purple-500/40"
                style={{
                  background: cube.color,
                  transform: `translateZ(${cube.size / 2}px)`,
                  backdropFilter: 'blur(4px)',
                }}
              />
              {/* Back face */}
              <div
                className="absolute inset-0 border border-purple-500/30"
                style={{
                  background: cube.color.replace('0.', '0.3'),
                  transform: `translateZ(-${cube.size / 2}px) rotateY(180deg)`,
                }}
              />
              {/* Left face */}
              <div
                className="absolute inset-0 border border-purple-500/30"
                style={{
                  background: cube.color.replace('0.', '0.4'),
                  transform: `translateX(-${cube.size / 2}px) rotateY(-90deg)`,
                  transformOrigin: 'right center',
                }}
              />
              {/* Right face */}
              <div
                className="absolute inset-0 border border-purple-500/30"
                style={{
                  background: cube.color.replace('0.', '0.4'),
                  transform: `translateX(${cube.size / 2}px) rotateY(90deg)`,
                  transformOrigin: 'left center',
                }}
              />
              {/* Top face */}
              <div
                className="absolute inset-0 border border-purple-500/40"
                style={{
                  background: cube.color.replace('0.', '0.5'),
                  transform: `translateY(-${cube.size / 2}px) rotateX(90deg)`,
                  transformOrigin: 'bottom center',
                }}
              />
              {/* Bottom face with glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                  transform: `translateY(${cube.size / 2}px) rotateX(-90deg)`,
                  transformOrigin: 'top center',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Gradient overlay for text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
        }}
      />
    </div>
  );
}
