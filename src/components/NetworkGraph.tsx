import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  x: number;
  y: number;
  type: "account" | "device" | "ip";
  isFraud: boolean;
  label: string;
  riskLevel?: "safe" | "warning" | "fraud";
}

interface Edge {
  from: string;
  to: string;
  type: "transaction" | "shared_device" | "shared_ip";
  isSuspicious: boolean;
  riskLevel?: "safe" | "warning" | "fraud";
}

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
  selectedNode?: string | null;
}

export const NetworkGraph = ({
  nodes,
  edges,
  onNodeClick,
  selectedNode,
}: NetworkGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeColor = (node: Node) => {
    if (node.riskLevel === "fraud" || node.isFraud) return "fill-fraud stroke-fraud";
    if (node.riskLevel === "warning") return "fill-warning stroke-warning";
    if (node.type === "device") return "fill-warning stroke-warning";
    if (node.type === "ip") return "fill-primary stroke-primary";
    return "fill-safe stroke-safe";
  };

  const getEdgeColor = (edge: Edge) => {
    if (edge.riskLevel === "fraud" || edge.isSuspicious) return "stroke-fraud";
    if (edge.riskLevel === "warning") return "stroke-warning";
    if (edge.type === "shared_device") return "stroke-warning";
    if (edge.type === "shared_ip") return "stroke-primary";
    return "stroke-muted-foreground/30";
  };

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "account":
        return "👤";
      case "device":
        return "📱";
      case "ip":
        return "🌐";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] rounded-xl border border-border/50 bg-card/50 overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 data-grid opacity-50" />

      <svg className="w-full h-full">
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted =
            hoveredNode === edge.from ||
            hoveredNode === edge.to ||
            selectedNode === edge.from ||
            selectedNode === edge.to;

          return (
            <g key={i}>
              <line
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                className={cn(
                  "transition-all duration-300",
                  getEdgeColor(edge),
                  isHighlighted ? "opacity-100 stroke-[3]" : "opacity-40 stroke-[1.5]"
                )}
                strokeDasharray={edge.isSuspicious ? "5,5" : "none"}
              />
              {edge.isSuspicious && (
                <circle r="3" className="fill-fraud animate-pulse-subtle">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={`M${(fromNode.x * 5).toFixed(0)},${(fromNode.y * 5).toFixed(0)} L${(toNode.x * 5).toFixed(0)},${(toNode.y * 5).toFixed(0)}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}%, ${node.y}%)`}
              className="cursor-pointer"
              onClick={() => onNodeClick?.(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow effect */}
              {(isSelected || isHovered || node.isFraud) && (
                <circle
                  r="30"
                  className={cn(
                    "transition-all duration-300",
                    node.isFraud
                      ? "fill-fraud/20"
                      : "fill-primary/20"
                  )}
                  style={{ filter: "blur(10px)" }}
                />
              )}

              {/* Node circle */}
              <circle
                r={isSelected || isHovered ? "22" : "18"}
                className={cn(
                  "transition-all duration-300 stroke-[2]",
                  getNodeColor(node),
                  isSelected || isHovered ? "fill-opacity-30" : "fill-opacity-20"
                )}
              />

              {/* Inner circle */}
              <circle
                r="10"
                className={cn(
                  "transition-all duration-300",
                  getNodeColor(node),
                  "fill-opacity-80"
                )}
              />

              {/* Label */}
              <text
                y="40"
                textAnchor="middle"
                className={cn(
                  "text-xs font-medium fill-foreground transition-opacity duration-300",
                  isSelected || isHovered ? "opacity-100" : "opacity-70"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-safe" />
          <span className="text-muted-foreground">Normal Account</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-fraud" />
          <span className="text-muted-foreground">Fraud Account</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Shared Device</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Shared IP</span>
        </div>
      </div>
    </div>
  );
};
