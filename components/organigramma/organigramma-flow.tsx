"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { OrgNode } from "./org-node";

const nodeTypes = {
  orgNode: OrgNode,
};

type OrganigrammaFlowInnerProps = {
  nodes: Node[];
  edges: Edge[];
};

const OrganigrammaFlowInner = ({
  nodes: initialNodes,
  edges: initialEdges,
}: OrganigrammaFlowInnerProps) => {
  const { fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const hasInitialized = useRef(false);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    hasInitialized.current = false;
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  useEffect(() => {
    if (!hasInitialized.current && nodes.length > 0 && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasInitialized.current) {
              setTimeout(() => {
                fitView({ padding: 0.2, duration: 0 });
                hasInitialized.current = true;
              }, 150);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [fitView, nodes.length]);

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Nessun dato disponibile</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[calc(100vh-8rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 2 },
        }}
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.data.level === 0) return "#3b82f6";
            if (node.data.level === 1) return "#a855f7";
            if (node.data.level === 2) return "#6366f1";
            return "#94a3b8";
          }}
          nodeStrokeWidth={3}
          className="!bg-background !border-border"
        />
        <Background gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};

type OrganigrammaFlowProps = {
  nodes: Node[];
  edges: Edge[];
};

export const OrganigrammaFlow = ({
  nodes,
  edges,
}: OrganigrammaFlowProps) => {
  return (
    <ReactFlowProvider>
      <OrganigrammaFlowInner nodes={nodes} edges={edges} />
    </ReactFlowProvider>
  );
};
