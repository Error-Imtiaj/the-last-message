import { useEffect, useRef } from 'react';

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
}

export function BlackHole() {
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

    // Accretion disk particles
    const particles: Particle[] = Array.from({ length: 300 }, () => {
      const radius = Math.random() * 250 + 60; // Distance from center
      return {
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (3.5 / radius) + Math.random() * 0.005, // Speed inversely proportional to distance
        size: Math.random() * 2 + 0.5,
        color: radius < 120 
          ? `rgba(0, 242, 255, ${Math.random() * 0.7 + 0.3})` // cyan closer
          : `rgba(94, 94, 110, ${Math.random() * 0.5 + 0.1})`, // muted gray outer
      };
    });

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
      // Create a fading shadow to leave swirling feedback traces
      ctx.fillStyle = 'rgba(2, 2, 5, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw gravity bending/lens aura around center
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        30,
        centerX,
        centerY,
        280
      );
      gradient.addColorStop(0, 'rgba(2, 2, 5, 1)'); // Dark absolute singularity
      gradient.addColorStop(0.15, 'rgba(0, 242, 255, 0.1)'); // Soft blue accretion rim
      gradient.addColorStop(0.5, 'rgba(0, 242, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
      ctx.fill();

      // Swirl the particles closer and closer
      particles.forEach((p) => {
        p.angle += p.speed;
        
        // Slightly pull particles inward
        p.radius -= 0.1;
        if (p.radius <= 40) {
          p.radius = Math.random() * 100 + 200; // Reset outward
          p.speed = (3.5 / p.radius) + Math.random() * 0.005;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Singularity core (absolute pitch black void)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
      ctx.fillStyle = '#020205';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.6)';
      ctx.stroke();

      // Accretion inner disk hot glow line
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 52, 24, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.25)';
      ctx.lineWidth = 3;
      ctx.stroke();

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
