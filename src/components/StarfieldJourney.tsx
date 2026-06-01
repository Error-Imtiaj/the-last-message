import { useEffect, useRef } from 'react';

interface JourneyStar {
  x: number;
  y: number;
  z: number;
  color: string;
}

export function StarfieldJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const parent = canvas.parentElement;
    let width = (canvas.width = parent ? parent.clientWidth : 1280);
    let height = (canvas.height = parent ? parent.clientHeight : 1024);

    // Radiating stars
    const stars: JourneyStar[] = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1000,
      color: `rgba(0, 242, 255, ${Math.random() * 0.6 + 0.4})`, // Cyan glowing stars
    }));

    const handleResize = () => {
      if (parent) {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      } else {
        width = canvas.width = 1280;
        height = canvas.height = 1024;
      }
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 5, 0.45)'; // Feed forward blur motion trail
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach((star) => {
        const oldZ = star.z;
        star.z -= 18; // Speed of ship

        // Reset if past screen
        if (star.z <= 10) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * 1000;
          star.y = (Math.random() - 0.5) * 1000;
        }

        // Perspective start points
        const kStart = 400 / oldZ;
        const x1 = star.x * kStart + centerX;
        const y1 = star.y * kStart + centerY;

        // Perspective end points (longer lines closer to screen)
        const kEnd = 400 / star.z;
        const x2 = star.x * kEnd + centerX;
        const y2 = star.y * kEnd + centerY;

        // Draw stretched needle/line if within bounds
        if (
          x1 >= 0 &&
          x1 < width &&
          y1 >= 0 &&
          y1 < height &&
          x2 >= 0 &&
          x2 < width &&
          y2 >= 0 &&
          y2 < height
        ) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.max(0.5, (1000 - star.z) / 250); // Thicker as they get closer
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full pointer-events-none z-0"
    />
  );
}
