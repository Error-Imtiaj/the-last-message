import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

export function Starfield({ speedFactor = 1 }: { speedFactor?: number }) {
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

    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1000,
      size: Math.random() * 1.5 + 0.5,
      color: `rgba(225, 253, 255, ${Math.random() * 0.7 + 0.3})`,
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
      ctx.fillStyle = '#020205';
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        // Move star closer
        star.z -= 0.5 * speedFactor;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        // Perspective projection
        const k = 120 / star.z;
        const px = (star.x - width / 2) * k + width / 2;
        const py = (star.y - height / 2) * k + height / 2;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speedFactor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full pointer-events-none z-0"
    />
  );
}
