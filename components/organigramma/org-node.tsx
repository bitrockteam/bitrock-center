"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

type NodeData = {
  nome: string;
  ruolo: string;
  area?: string;
  societa?: string;
  posizione?: string;
  altri_ruoli?: string[];
  level: number;
};

const getNodeStyle = (level: number): string => {
  if (level === 0) {
    return "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-2 border-blue-600 shadow-lg";
  }
  if (level === 1) {
    return "bg-gradient-to-br from-purple-500 to-purple-700 text-white border-2 border-purple-600 shadow-md";
  }
  if (level === 2) {
    return "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-2 border-indigo-600 shadow-sm";
  }
  return "bg-card text-card-foreground border border-border shadow-sm";
};

const getNodeSize = (level: number): { width: string; minHeight: string } => {
  if (level <= 1) {
    return { width: "220px", minHeight: "120px" };
  }
  if (level === 2) {
    return { width: "200px", minHeight: "100px" };
  }
  return { width: "180px", minHeight: "80px" };
};

export const OrgNode = ({ data }: NodeProps<NodeData>) => {
  const { nome, ruolo, area, societa, altri_ruoli, level } = data;
  const nodeStyle = getNodeStyle(level);
  const nodeSize = getNodeSize(level);

  return (
    <div
      className={cn("rounded-lg p-3 flex flex-col gap-1 transition-all hover:scale-105", nodeStyle)}
      style={nodeSize}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-sm leading-tight">{nome}</div>
        <div className="text-xs font-medium opacity-90">{ruolo}</div>
        {altri_ruoli && altri_ruoli.length > 0 && (
          <div className="text-xs opacity-75 italic">{altri_ruoli.map((r) => r).join(", ")}</div>
        )}
        {area && (
          <div className="text-xs opacity-80 mt-1 pt-1 border-t border-current/20">{area}</div>
        )}
        {societa && <div className="text-xs opacity-80 font-semibold">{societa}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};
