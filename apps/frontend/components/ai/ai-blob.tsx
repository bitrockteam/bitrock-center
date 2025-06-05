"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AIBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Imposta le dimensioni del canvas
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Parametri per l'animazione del blob
    const points = 8;
    const radius = size / 3;
    const center = size / 2;
    const angles = Array.from(
      { length: points },
      (_, i) => (i / points) * Math.PI * 2,
    );
    const baseRadii = Array.from(
      { length: points },
      () => radius * (0.8 + Math.random() * 0.4),
    );
    const velocities = Array.from(
      { length: points },
      () => 0.002 + Math.random() * 0.002,
    );
    const offsets = Array.from(
      { length: points },
      () => Math.random() * Math.PI * 2,
    );

    // Colori per il gradiente
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gradientColors = isDarkMode
      ? ["rgba(56, 189, 248, 0.8)", "rgba(168, 85, 247, 0.8)"]
      : ["rgba(56, 189, 248, 0.6)", "rgba(168, 85, 247, 0.6)"];

    // Funzione di animazione
    let animationId: number;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, size, size);

      // Crea il gradiente
      const gradient = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        radius * 1.5,
      );
      gradient.addColorStop(0, gradientColors[0]);
      gradient.addColorStop(1, gradientColors[1]);

      // Calcola i punti del blob
      const currentRadii = baseRadii.map(
        (r, i) =>
          r +
          Math.sin(time * 0.001 * velocities[i] + offsets[i]) * (radius * 0.2),
      );

      // Disegna il blob
      ctx.beginPath();

      // Primo punto
      const startX = center + currentRadii[0] * Math.cos(angles[0]);
      const startY = center + currentRadii[0] * Math.sin(angles[0]);
      ctx.moveTo(startX, startY);

      // Punti successivi con curve di Bezier
      for (let i = 0; i < points; i++) {
        const nextIndex = (i + 1) % points;

        const x1 = center + currentRadii[i] * Math.cos(angles[i]);
        const y1 = center + currentRadii[i] * Math.sin(angles[i]);

        const x2 =
          center + currentRadii[nextIndex] * Math.cos(angles[nextIndex]);
        const y2 =
          center + currentRadii[nextIndex] * Math.sin(angles[nextIndex]);

        const cpx1 = x1 + (x2 - x1) * 0.5 - (y2 - y1) * 0.2;
        const cpy1 = y1 + (y2 - y1) * 0.5 + (x2 - x1) * 0.2;

        const cpx2 = x2 - (x2 - x1) * 0.5 - (y2 - y1) * 0.2;
        const cpy2 = y2 - (y2 - y1) * 0.5 + (x2 - x1) * 0.2;

        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      // Effetto glow
      ctx.shadowColor = isDarkMode
        ? "rgba(56, 189, 248, 0.5)"
        : "rgba(168, 85, 247, 0.5)";
      ctx.shadowBlur = 20;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="rounded-full"
      />
    </motion.div>
  );
}
