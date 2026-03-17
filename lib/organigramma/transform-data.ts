import type { Node, Edge } from "@xyflow/react";
import dagre from "dagre";

type OrgData = {
  gruppo: {
    nome: string;
    societa: string[];
    organigramma: {
      ruolo: string;
      nome: string;
      altri_ruoli?: string[];
      riporta_a?: string | null;
      riporti?: OrgData["gruppo"]["organigramma"][];
      aree?: Array<{
        nome_area: string;
        responsabile?: {
          ruolo: string;
          nome: string;
        };
        riporti?: OrgData["gruppo"]["organigramma"][];
        team?: Array<{
          nome: string;
          posizione?: string;
          ruolo?: string;
        }>;
      }>;
      team?: Array<{
        nome: string;
        posizione?: string;
        ruolo?: string;
      }>;
      area?: string;
      societa?: string;
    };
  };
};

type NodeData = {
  nome: string;
  ruolo: string;
  area?: string;
  societa?: string;
  posizione?: string;
  altri_ruoli?: string[];
  level: number;
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const HORIZONTAL_SPACING = 150;
const VERTICAL_SPACING = 100;
const LEVEL3_COLUMN_SPACING = 200;
const LEVEL3_ROW_SPACING = 110;
const COMPACT_VERTICAL_SPACING = 70;
const LEVEL3_START_SPACING = 120;

const getLayoutConfig = (): { rankdir: "TB" | "LR"; nodesep: number; ranksep: number } => {
  return {
    rankdir: "TB",
    nodesep: HORIZONTAL_SPACING,
    ranksep: COMPACT_VERTICAL_SPACING,
  };
};

const reorganizeLevel3Nodes = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  layoutConfig: { rankdir: "TB" | "LR" }
): Node<NodeData>[] => {
  const level3Nodes = nodes.filter((n) => n.data.level === 3);
  if (level3Nodes.length === 0) {
    return nodes;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const parentToChildren = new Map<string, Node<NodeData>[]>();

  for (const node of level3Nodes) {
    const edge = edges.find((e) => e.target === node.id);
    if (edge) {
      const parentId = edge.source;
      if (!parentToChildren.has(parentId)) {
        parentToChildren.set(parentId, []);
      }
      const children = parentToChildren.get(parentId);
      if (children) {
        children.push(node);
      }
    }
  }

  const updatedNodes = [...nodes];

  for (const [parentId, children] of parentToChildren.entries()) {
    const parentNode = nodeMap.get(parentId);
    if (!parentNode) continue;

    const parentX = parentNode.position.x;
    const parentY = parentNode.position.y;

    if (layoutConfig.rankdir === "TB") {
      const maxNodesPerColumn = 4;
      const numColumns = Math.ceil(children.length / maxNodesPerColumn);
      const totalWidth = (numColumns - 1) * LEVEL3_COLUMN_SPACING;
      const startX = parentX - totalWidth / 2;

      children.forEach((child, index) => {
        const column = Math.floor(index / maxNodesPerColumn);
        const row = index % maxNodesPerColumn;
        const childIndex = updatedNodes.findIndex((n) => n.id === child.id);
        if (childIndex !== -1) {
          updatedNodes[childIndex] = {
            ...updatedNodes[childIndex],
            position: {
              x: startX + column * LEVEL3_COLUMN_SPACING,
              y: parentY + LEVEL3_START_SPACING + row * LEVEL3_ROW_SPACING,
            },
          };
        }
      });
    } else {
      const nodesPerRow = Math.ceil(Math.sqrt(children.length * 2));
      const numRows = Math.ceil(children.length / nodesPerRow);
      const totalHeight = (numRows - 1) * LEVEL3_ROW_SPACING;
      const startY = parentY - totalHeight / 2;

      children.forEach((child, index) => {
        const row = Math.floor(index / nodesPerRow);
        const column = index % nodesPerRow;
        const childIndex = updatedNodes.findIndex((n) => n.id === child.id);
        if (childIndex !== -1) {
          updatedNodes[childIndex] = {
            ...updatedNodes[childIndex],
            position: {
              x: parentX + HORIZONTAL_SPACING + column * LEVEL3_COLUMN_SPACING,
              y: startY + row * LEVEL3_ROW_SPACING,
            },
          };
        }
      });
    }
  }

  return updatedNodes;
};

const compactHigherLevels = (nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] => {
  const updatedNodes = [...nodes];
  const levelGroups = new Map<number, Node<NodeData>[]>();

  for (const node of nodes) {
    if (node.data.level < 3) {
      if (!levelGroups.has(node.data.level)) {
        levelGroups.set(node.data.level, []);
      }
      const group = levelGroups.get(node.data.level);
      if (group) {
        group.push(node);
      }
    }
  }

  for (const [level, levelNodes] of levelGroups.entries()) {
    if (level === 0) continue;

    const parentLevel = level - 1;
    const parentNodes = levelGroups.get(parentLevel) || [];

    if (parentNodes.length === 0) continue;

    const minParentY = Math.min(...parentNodes.map((p) => p.position.y));

    levelNodes.forEach((node) => {
      const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        const originalY = node.position.y;
        const relativeY = originalY - minParentY;
        const compactedY = minParentY + COMPACT_VERTICAL_SPACING + relativeY * 0.5;

        updatedNodes[nodeIndex] = {
          ...updatedNodes[nodeIndex],
          position: {
            ...updatedNodes[nodeIndex].position,
            y: compactedY,
          },
        };
      }
    });
  }

  const compactLevel2Horizontal = (nodes: Node<NodeData>[]): Node<NodeData>[] => {
    const level2Nodes = nodes.filter((n) => n.data.level === 2);
    if (level2Nodes.length === 0) return nodes;

    const updated = [...nodes];
    const parentToChildren = new Map<string, Node<NodeData>[]>();

    for (const node of level2Nodes) {
      const edge = edges.find((e) => e.target === node.id);
      if (edge) {
        const parentId = edge.source;
        if (!parentToChildren.has(parentId)) {
          parentToChildren.set(parentId, []);
        }
        const children = parentToChildren.get(parentId);
        if (children) {
          children.push(node);
        }
      }
    }

    for (const [parentId, children] of parentToChildren.entries()) {
      if (children.length <= 1) continue;

      const sortedChildren = [...children].sort((a, b) => a.position.x - b.position.x);
      const minX = sortedChildren[0].position.x;
      const spacing = 120;

      sortedChildren.forEach((child, index) => {
        const childIndex = updated.findIndex((n) => n.id === child.id);
        if (childIndex !== -1) {
          updated[childIndex] = {
            ...updated[childIndex],
            position: {
              ...updated[childIndex].position,
              x: minX + index * spacing,
            },
          };
        }
      });
    }

    return updated;
  };

  return compactLevel2Horizontal(updatedNodes);
};

const generateNodeId = (nome: string, ruolo: string, parentId?: string): string => {
  const baseId = `${ruolo}-${nome}`.replace(/\s+/g, "-").toLowerCase();
  return parentId ? `${parentId}-${baseId}` : baseId;
};

const createNode = (id: string, data: NodeData): Node<NodeData> => {
  return {
    id,
    type: "orgNode",
    position: { x: 0, y: 0 },
    data,
  };
};

const processPerson = (
  person: OrgData["gruppo"]["organigramma"],
  parentId: string | null,
  level: number,
  nodes: Node<NodeData>[],
  edges: Edge[],
  parentNodeId?: string
): string => {
  const nodeId = generateNodeId(person.nome, person.ruolo, parentNodeId);
  const nodeData: NodeData = {
    nome: person.nome,
    ruolo: person.ruolo,
    level,
    altri_ruoli: person.altri_ruoli,
  };

  if (person.area) {
    nodeData.area = person.area;
  }
  if (person.societa) {
    nodeData.societa = person.societa;
  }

  const node = createNode(nodeId, nodeData);
  nodes.push(node);

  if (parentId && parentNodeId) {
    edges.push({
      id: `${parentNodeId}-${nodeId}`,
      source: parentNodeId,
      target: nodeId,
      type: "smoothstep",
    });
  }

  const currentParentId = nodeId;

  if (person.riporti && person.riporti.length > 0) {
    for (const riporto of person.riporti) {
      processPerson(riporto, person.ruolo, level + 1, nodes, edges, currentParentId);
    }
  }

  if (person.aree && person.aree.length > 0) {
    for (const area of person.aree) {
      if (area.riporti && area.riporti.length > 0) {
        for (const riporto of area.riporti) {
          const areaNodeData: NodeData = {
            nome: riporto.nome,
            ruolo: riporto.ruolo,
            area: area.nome_area,
            level: level + 1,
          };
          if (riporto.societa) {
            areaNodeData.societa = riporto.societa;
          }
          const areaNodeId = generateNodeId(riporto.nome, riporto.ruolo, currentParentId);
          const areaNode = createNode(areaNodeId, areaNodeData);
          nodes.push(areaNode);

          edges.push({
            id: `${currentParentId}-${areaNodeId}`,
            source: currentParentId,
            target: areaNodeId,
            type: "smoothstep",
          });

          if (riporto.riporti && riporto.riporti.length > 0) {
            for (const subRiporto of riporto.riporti) {
              processPerson(subRiporto, riporto.ruolo, level + 2, nodes, edges, areaNodeId);
            }
          }

          if (riporto.team && riporto.team.length > 0) {
            for (const teamMember of riporto.team) {
              const teamNodeData: NodeData = {
                nome: teamMember.nome,
                ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
                level: level + 2,
              };
              const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, areaNodeId);
              const teamNode = createNode(teamNodeId, teamNodeData);
              nodes.push(teamNode);

              edges.push({
                id: `${areaNodeId}-${teamNodeId}`,
                source: areaNodeId,
                target: teamNodeId,
                type: "smoothstep",
              });
            }
          }
        }
      }

      if (area.team && area.team.length > 0) {
        for (const teamMember of area.team) {
          const teamNodeData: NodeData = {
            nome: teamMember.nome,
            ruolo: teamMember.posizione || "Team Member",
            area: area.nome_area,
            level: level + 1,
          };
          const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, currentParentId);
          const teamNode = createNode(teamNodeId, teamNodeData);
          nodes.push(teamNode);

          edges.push({
            id: `${currentParentId}-${teamNodeId}`,
            source: currentParentId,
            target: teamNodeId,
            type: "smoothstep",
          });
        }
      }
    }
  }

  if (person.team && person.team.length > 0) {
    for (const teamMember of person.team) {
      const teamNodeData: NodeData = {
        nome: teamMember.nome,
        ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
        level: level + 1,
      };
      const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, currentParentId);
      const teamNode = createNode(teamNodeId, teamNodeData);
      nodes.push(teamNode);

      edges.push({
        id: `${currentParentId}-${teamNodeId}`,
        source: currentParentId,
        target: teamNodeId,
        type: "smoothstep",
      });
    }
  }

  return nodeId;
};

export const transformOrgDataToFlow = (
  orgData: OrgData
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  const ceo = orgData.gruppo.organigramma;
  const ceoNodeId = generateNodeId(ceo.nome, ceo.ruolo);
  const ceoNodeData: NodeData = {
    nome: ceo.nome,
    ruolo: ceo.ruolo,
    level: 0,
    altri_ruoli: ceo.altri_ruoli,
  };

  const ceoNode = createNode(ceoNodeId, ceoNodeData);
  nodes.push(ceoNode);

  if (ceo.riporti && ceo.riporti.length > 0) {
    for (const riporto of ceo.riporti) {
      processPerson(riporto, ceo.ruolo, 1, nodes, edges, ceoNodeId);
    }
  }

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  const layoutConfig = getLayoutConfig();
  graph.setGraph(layoutConfig);

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  let positionedNodes = nodes.map((node) => {
    const nodePosition = graph.node(node.id);
    return {
      ...node,
      position: {
        x: nodePosition.x - NODE_WIDTH / 2,
        y: nodePosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  positionedNodes = reorganizeLevel3Nodes(positionedNodes, edges, layoutConfig);
  positionedNodes = compactHigherLevels(positionedNodes, edges);

  return {
    nodes: positionedNodes,
    edges,
  };
};

const processPersonLimited = (
  person: OrgData["gruppo"]["organigramma"],
  parentId: string | null,
  level: number,
  nodes: Node<NodeData>[],
  edges: Edge[],
  parentNodeId?: string,
  maxLevel: number = 2
): string => {
  if (level > maxLevel) {
    return parentNodeId || "";
  }

  const nodeId = generateNodeId(person.nome, person.ruolo, parentNodeId);
  const nodeData: NodeData = {
    nome: person.nome,
    ruolo: person.ruolo,
    level,
    altri_ruoli: person.altri_ruoli,
  };

  if (person.area) {
    nodeData.area = person.area;
  }
  if (person.societa) {
    nodeData.societa = person.societa;
  }

  const node = createNode(nodeId, nodeData);
  nodes.push(node);

  if (parentId && parentNodeId) {
    edges.push({
      id: `${parentNodeId}-${nodeId}`,
      source: parentNodeId,
      target: nodeId,
      type: "smoothstep",
    });
  }

  const currentParentId = nodeId;

  if (level < maxLevel) {
    if (person.riporti && person.riporti.length > 0) {
      for (const riporto of person.riporti) {
        processPersonLimited(
          riporto,
          person.ruolo,
          level + 1,
          nodes,
          edges,
          currentParentId,
          maxLevel
        );
      }
    }

    if (person.aree && person.aree.length > 0) {
      for (const area of person.aree) {
        if (area.riporti && area.riporti.length > 0) {
          for (const riporto of area.riporti) {
            const areaNodeData: NodeData = {
              nome: riporto.nome,
              ruolo: riporto.ruolo,
              area: area.nome_area,
              level: level + 1,
            };
            if (riporto.societa) {
              areaNodeData.societa = riporto.societa;
            }
            const areaNodeId = generateNodeId(riporto.nome, riporto.ruolo, currentParentId);
            const areaNode = createNode(areaNodeId, areaNodeData);
            nodes.push(areaNode);

            edges.push({
              id: `${currentParentId}-${areaNodeId}`,
              source: currentParentId,
              target: areaNodeId,
              type: "smoothstep",
            });
          }
        }

        if (area.team && area.team.length > 0 && level + 1 <= maxLevel) {
          for (const teamMember of area.team) {
            const teamNodeData: NodeData = {
              nome: teamMember.nome,
              ruolo: teamMember.posizione || "Team Member",
              area: area.nome_area,
              level: level + 1,
            };
            const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, currentParentId);
            const teamNode = createNode(teamNodeId, teamNodeData);
            nodes.push(teamNode);

            edges.push({
              id: `${currentParentId}-${teamNodeId}`,
              source: currentParentId,
              target: teamNodeId,
              type: "smoothstep",
            });
          }
        }
      }
    }

    if (person.team && person.team.length > 0) {
      for (const teamMember of person.team) {
        const teamNodeData: NodeData = {
          nome: teamMember.nome,
          ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
          level: level + 1,
        };
        const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, currentParentId);
        const teamNode = createNode(teamNodeId, teamNodeData);
        nodes.push(teamNode);

        edges.push({
          id: `${currentParentId}-${teamNodeId}`,
          source: currentParentId,
          target: teamNodeId,
          type: "smoothstep",
        });
      }
    }
  }

  return nodeId;
};

export const transformOrgDataToMainFlow = (
  orgData: OrgData
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  const ceo = orgData.gruppo.organigramma;
  const ceoNodeId = generateNodeId(ceo.nome, ceo.ruolo);
  const ceoNodeData: NodeData = {
    nome: ceo.nome,
    ruolo: ceo.ruolo,
    level: 0,
    altri_ruoli: ceo.altri_ruoli,
  };

  const ceoNode = createNode(ceoNodeId, ceoNodeData);
  nodes.push(ceoNode);

  if (ceo.riporti && ceo.riporti.length > 0) {
    for (const riporto of ceo.riporti) {
      processPersonLimited(riporto, ceo.ruolo, 1, nodes, edges, ceoNodeId, 1);
    }
  }

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  const layoutConfig = getLayoutConfig();
  graph.setGraph(layoutConfig);

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  let positionedNodes = nodes.map((node) => {
    const nodePosition = graph.node(node.id);
    return {
      ...node,
      position: {
        x: nodePosition.x - NODE_WIDTH / 2,
        y: nodePosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  positionedNodes = reorganizeLevel3Nodes(positionedNodes, edges, layoutConfig);
  positionedNodes = compactHigherLevels(positionedNodes, edges);

  return {
    nodes: positionedNodes,
    edges,
  };
};

export const transformSubOrgToFlow = (
  _orgData: OrgData,
  parentPerson: OrgData["gruppo"]["organigramma"],
  title: string
): { nodes: Node<NodeData>[]; edges: Edge[]; title: string } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  const parentNodeIdGenerated = generateNodeId(parentPerson.nome, parentPerson.ruolo);
  const parentNodeData: NodeData = {
    nome: parentPerson.nome,
    ruolo: parentPerson.ruolo,
    level: 0,
    altri_ruoli: parentPerson.altri_ruoli,
  };

  if (parentPerson.area) {
    parentNodeData.area = parentPerson.area;
  }
  if (parentPerson.societa) {
    parentNodeData.societa = parentPerson.societa;
  }

  const parentNode = createNode(parentNodeIdGenerated, parentNodeData);
  nodes.push(parentNode);

  if (parentPerson.riporti && parentPerson.riporti.length > 0) {
    for (const riporto of parentPerson.riporti) {
      processPerson(riporto, parentPerson.ruolo, 1, nodes, edges, parentNodeIdGenerated);
    }
  }

  if (parentPerson.aree && parentPerson.aree.length > 0) {
    for (const area of parentPerson.aree) {
      if (area.riporti && area.riporti.length > 0) {
        for (const riporto of area.riporti) {
          const areaNodeData: NodeData = {
            nome: riporto.nome,
            ruolo: riporto.ruolo,
            area: area.nome_area,
            level: 1,
          };
          if (riporto.societa) {
            areaNodeData.societa = riporto.societa;
          }
          const areaNodeId = generateNodeId(riporto.nome, riporto.ruolo, parentNodeIdGenerated);
          const areaNode = createNode(areaNodeId, areaNodeData);
          nodes.push(areaNode);

          edges.push({
            id: `${parentNodeIdGenerated}-${areaNodeId}`,
            source: parentNodeIdGenerated,
            target: areaNodeId,
            type: "smoothstep",
          });

          if (riporto.riporti && riporto.riporti.length > 0) {
            for (const subRiporto of riporto.riporti) {
              processPerson(subRiporto, riporto.ruolo, 2, nodes, edges, areaNodeId);
            }
          }

          if (riporto.team && riporto.team.length > 0) {
            for (const teamMember of riporto.team) {
              const teamNodeData: NodeData = {
                nome: teamMember.nome,
                ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
                level: 2,
              };
              const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, areaNodeId);
              const teamNode = createNode(teamNodeId, teamNodeData);
              nodes.push(teamNode);

              edges.push({
                id: `${areaNodeId}-${teamNodeId}`,
                source: areaNodeId,
                target: teamNodeId,
                type: "smoothstep",
              });
            }
          }
        }
      }

      if (area.team && area.team.length > 0) {
        for (const teamMember of area.team) {
          const teamNodeData: NodeData = {
            nome: teamMember.nome,
            ruolo: teamMember.posizione || "Team Member",
            area: area.nome_area,
            level: 1,
          };
          const teamNodeId = generateNodeId(
            teamMember.nome,
            teamNodeData.ruolo,
            parentNodeIdGenerated
          );
          const teamNode = createNode(teamNodeId, teamNodeData);
          nodes.push(teamNode);

          edges.push({
            id: `${parentNodeIdGenerated}-${teamNodeId}`,
            source: parentNodeIdGenerated,
            target: teamNodeId,
            type: "smoothstep",
          });
        }
      }
    }
  }

  if (parentPerson.team && parentPerson.team.length > 0) {
    for (const teamMember of parentPerson.team) {
      const teamNodeData: NodeData = {
        nome: teamMember.nome,
        ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
        level: 1,
      };
      const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, parentNodeIdGenerated);
      const teamNode = createNode(teamNodeId, teamNodeData);
      nodes.push(teamNode);

      edges.push({
        id: `${parentNodeIdGenerated}-${teamNodeId}`,
        source: parentNodeIdGenerated,
        target: teamNodeId,
        type: "smoothstep",
      });
    }
  }

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  const layoutConfig = getLayoutConfig();
  graph.setGraph(layoutConfig);

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  let positionedNodes = nodes.map((node) => {
    const nodePosition = graph.node(node.id);
    return {
      ...node,
      position: {
        x: nodePosition.x - NODE_WIDTH / 2,
        y: nodePosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  positionedNodes = reorganizeLevel3Nodes(positionedNodes, edges, layoutConfig);

  return {
    nodes: positionedNodes,
    edges,
    title,
  };
};

export const transformAreaToFlow = (
  _orgData: OrgData,
  parentPerson: OrgData["gruppo"]["organigramma"],
  area: {
    nome_area: string;
    responsabile?: { ruolo: string; nome: string };
    riporti?: OrgData["gruppo"]["organigramma"][];
    team?: Array<{ nome: string; posizione?: string; ruolo?: string }>;
  },
  title: string
): { nodes: Node<NodeData>[]; edges: Edge[]; title: string } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  const parentNodeId = generateNodeId(parentPerson.nome, parentPerson.ruolo);
  const parentNodeData: NodeData = {
    nome: parentPerson.nome,
    ruolo: parentPerson.ruolo,
    level: 0,
    altri_ruoli: parentPerson.altri_ruoli,
  };

  if (parentPerson.area) {
    parentNodeData.area = parentPerson.area;
  }
  if (parentPerson.societa) {
    parentNodeData.societa = parentPerson.societa;
  }

  const parentNode = createNode(parentNodeId, parentNodeData);
  nodes.push(parentNode);

  if (area.riporti && area.riporti.length > 0) {
    for (const riporto of area.riporti) {
      const areaNodeData: NodeData = {
        nome: riporto.nome,
        ruolo: riporto.ruolo,
        area: area.nome_area,
        level: 1,
      };
      if (riporto.societa) {
        areaNodeData.societa = riporto.societa;
      }
      const areaNodeId = generateNodeId(riporto.nome, riporto.ruolo, parentNodeId);
      const areaNode = createNode(areaNodeId, areaNodeData);
      nodes.push(areaNode);

      edges.push({
        id: `${parentNodeId}-${areaNodeId}`,
        source: parentNodeId,
        target: areaNodeId,
        type: "smoothstep",
      });

      if (riporto.riporti && riporto.riporti.length > 0) {
        for (const subRiporto of riporto.riporti) {
          processPerson(subRiporto, riporto.ruolo, 2, nodes, edges, areaNodeId);
        }
      }

      if (riporto.team && riporto.team.length > 0) {
        for (const teamMember of riporto.team) {
          const teamNodeData: NodeData = {
            nome: teamMember.nome,
            ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
            level: 2,
          };
          const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, areaNodeId);
          const teamNode = createNode(teamNodeId, teamNodeData);
          nodes.push(teamNode);

          edges.push({
            id: `${areaNodeId}-${teamNodeId}`,
            source: areaNodeId,
            target: teamNodeId,
            type: "smoothstep",
          });
        }
      }
    }
  }

  if (area.team && area.team.length > 0) {
    for (const teamMember of area.team) {
      const teamNodeData: NodeData = {
        nome: teamMember.nome,
        ruolo: teamMember.posizione || "Team Member",
        area: area.nome_area,
        level: 1,
      };
      const teamNodeId = generateNodeId(teamMember.nome, teamNodeData.ruolo, parentNodeId);
      const teamNode = createNode(teamNodeId, teamNodeData);
      nodes.push(teamNode);

      edges.push({
        id: `${parentNodeId}-${teamNodeId}`,
        source: parentNodeId,
        target: teamNodeId,
        type: "smoothstep",
      });
    }
  }

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  const layoutConfig = getLayoutConfig();
  graph.setGraph(layoutConfig);

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  let positionedNodes = nodes.map((node) => {
    const nodePosition = graph.node(node.id);
    return {
      ...node,
      position: {
        x: nodePosition.x - NODE_WIDTH / 2,
        y: nodePosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  positionedNodes = reorganizeLevel3Nodes(positionedNodes, edges, layoutConfig);

  return {
    nodes: positionedNodes,
    edges,
    title,
  };
};

export const getBusinessUnits = (
  person: OrgData["gruppo"]["organigramma"]
): Array<{
  area: {
    nome_area: string;
    responsabile?: { ruolo: string; nome: string };
    riporti?: OrgData["gruppo"]["organigramma"][];
    team?: Array<{ nome: string; posizione?: string; ruolo?: string }>;
  };
  title: string;
}> => {
  const businessUnits: Array<{
    area: {
      nome_area: string;
      responsabile?: { ruolo: string; nome: string };
      riporti?: OrgData["gruppo"]["organigramma"][];
      team?: Array<{ nome: string; posizione?: string; ruolo?: string }>;
    };
    title: string;
  }> = [];

  if (person.aree && person.aree.length > 0) {
    for (const area of person.aree) {
      const hasSubStructure =
        (area.riporti && area.riporti.length > 0) || (area.team && area.team.length > 0);

      if (hasSubStructure) {
        const title = `${person.ruolo} - ${person.nome} > ${area.nome_area}`;
        businessUnits.push({ area, title });
      }
    }
  }

  return businessUnits;
};

export const getSubOrganizations = (
  orgData: OrgData
): Array<{
  person: OrgData["gruppo"]["organigramma"];
  title: string;
  isMarcoVeronese?: boolean;
}> => {
  const subOrgs: Array<{
    person: OrgData["gruppo"]["organigramma"];
    title: string;
    isMarcoVeronese?: boolean;
  }> = [];

  const ceo = orgData.gruppo.organigramma;
  if (ceo.riporti && ceo.riporti.length > 0) {
    for (const riporto of ceo.riporti) {
      const hasSubStructure =
        (riporto.riporti && riporto.riporti.length > 0) ||
        (riporto.aree && riporto.aree.length > 0) ||
        (riporto.team && riporto.team.length > 0);

      if (hasSubStructure) {
        let title = `${riporto.ruolo} - ${riporto.nome}`;
        const isMarcoVeronese = riporto.nome === "Marco Veronese";

        if (riporto.aree && riporto.aree.length > 0 && !isMarcoVeronese) {
          const areaNames = riporto.aree.map((a) => a.nome_area).join(", ");
          title = `${riporto.ruolo} - ${riporto.nome} (${areaNames})`;
        }
        subOrgs.push({ person: riporto, title, isMarcoVeronese });
      }
    }
  }

  return subOrgs;
};

export const orgData: OrgData = {
  gruppo: {
    nome: "Fortitude Group",
    societa: ["Fortitude", "Bitrock", "ProActivity", "Waterstream"],
    organigramma: {
      ruolo: "CEO",
      nome: "Leo Pillon",
      altri_ruoli: ["Chief Sales Officer (ad interim)"],
      riporta_a: null,
      riporti: [
        {
          ruolo: "Chief Operating Officer",
          nome: "Marco Veronese",
          riporta_a: "CEO",
          aree: [
            {
              nome_area: "Operations",
              riporti: [
                {
                  ruolo: "Head of Engineering",
                  nome: "Franco Geraci",
                  riporta_a: "COO",
                  riporti: [
                    {
                      ruolo: "Senior Manager",
                      nome: "Simone Esposito",
                      riporta_a: "Head of Engineering",
                    },
                    {
                      ruolo: "Manager Software Quality Assurance",
                      nome: "Manuele Salvador",
                      riporta_a: "Head of Engineering",
                      team: [
                        {
                          nome: "Ilaria Stasuzzo",
                          posizione: "SQAE",
                        },
                        {
                          nome: "Giorgio Vendrame",
                          posizione: "SQAE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager",
                      nome: "Daniele Bonelli",
                      team: [
                        {
                          nome: "Cristian Bertuccioli",
                          posizione: "SSE",
                        },
                        {
                          nome: "Carmelo Calabrò",
                          posizione: "SSE",
                        },
                        {
                          nome: "Gianluca Cavalli",
                          posizione: "SE",
                        },
                        {
                          nome: "Anton Cucu",
                          posizione: "SE",
                        },
                        {
                          nome: "Bradley Gersh",
                          posizione: "SE",
                        },
                        {
                          nome: "Federico Gradizzi",
                          posizione: "JSE",
                        },
                        {
                          nome: "Mario Taccori",
                          posizione: "SE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager",
                      nome: "Matteo Gazzetta",
                      team: [
                        {
                          nome: "Claudio Vesco",
                          posizione: "SSE",
                        },
                        {
                          nome: "Vincenzo Aprea",
                          posizione: "SSE",
                        },
                        {
                          nome: "Matteo Livoli",
                          posizione: "SE",
                        },
                        {
                          nome: "Enrico Luongo",
                          posizione: "SE",
                        },
                        {
                          nome: "Marco Marice",
                          posizione: "SE",
                        },
                        {
                          nome: "Davide Pavan",
                          posizione: "SSE",
                        },
                        {
                          nome: "Marco Righi",
                          posizione: "SSE",
                        },
                        {
                          nome: "Federico Vidali",
                          posizione: "SE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager",
                      nome: "Simone Ripamonti",
                      team: [
                        {
                          nome: "Matteo Anselmi",
                          posizione: "DE",
                        },
                        {
                          nome: "Marco Gatti",
                          posizione: "DE",
                        },
                        {
                          nome: "Andrea Laspada",
                          posizione: "DE",
                        },
                        {
                          nome: "Lorenzo Rutigliano",
                          posizione: "DE",
                        },
                        {
                          nome: "Michael Tabolsky",
                          posizione: "SDE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager",
                      nome: "Luca Tronchin",
                      team: [
                        {
                          nome: "Cristian Bianco",
                          posizione: "SE",
                        },
                        {
                          nome: "Francesco Cadili",
                          posizione: "SSE",
                        },
                        {
                          nome: "Fabio Castello",
                          posizione: "JSE",
                        },
                        {
                          nome: "Francesco Malerba",
                          posizione: "SSE",
                        },
                        {
                          nome: "Giovanni Morlin",
                          posizione: "SE",
                        },
                        {
                          nome: "Claudia Salmaso",
                          posizione: "SSE",
                        },
                        {
                          nome: "Marco Tosini",
                          posizione: "SSE",
                        },
                        {
                          nome: "Danilo Ventura",
                          posizione: "SSE",
                        },
                      ],
                    },
                  ],
                },
                {
                  ruolo: "Head of Key Client",
                  nome: "Daniele Bergo",
                  team: [
                    {
                      ruolo: "Senior Key Client",
                      nome: "Moreno Brusauro",
                    },
                    {
                      ruolo: "Key Client",
                      nome: "Luca Savarese",
                    },
                    {
                      ruolo: "Key Client",
                      nome: "Michele Mazza",
                    },
                  ],
                },
                {
                  ruolo: "Head of AI",
                  nome: "Alessandro Conflitti",
                },
                {
                  ruolo: "Head of Data Engineering",
                  nome: "Antonio Barbuzzi",
                },
                {
                  ruolo: "Head of GoLive (ad interim)",
                  nome: "Franco Geraci",
                },
                {
                  ruolo: "Head of Waterstream (ad interim)",
                  nome: "Franco Geraci",
                },
                {
                  ruolo: "Head of Radicalbit Platform (ad interim)",
                  nome: "Antonio Barbuzzi",
                },
                {
                  ruolo: "Senior Manager FE",
                  nome: "Yi Zhang",
                  area: "Front-end, UI, UX e Mobile",
                  riporti: [
                    {
                      ruolo: "Manager FE",
                      nome: "Daniele Chiarello",
                      team: [
                        {
                          nome: "Luca Boudidat",
                          posizione: "FE",
                        },
                        {
                          nome: "Gastòn Diaz",
                          posizione: "FE",
                        },
                        {
                          nome: "Marika Fabiani",
                          posizione: "JFE",
                        },
                        {
                          nome: "Giuseppe Figliuolo",
                          posizione: "JFE",
                        },
                        {
                          nome: "Elhosain Halili",
                          posizione: "FE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager FE",
                      nome: "Mattia Ripamonti",
                      team: [
                        {
                          nome: "Marco Bartiromo",
                          posizione: "FE",
                        },
                        {
                          nome: "Davide Filippi",
                          posizione: "FE",
                        },
                        {
                          nome: "Andrea Mazza",
                          posizione: "SFE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager FE",
                      nome: "Daniel Zotti",
                      team: [
                        {
                          nome: "Massimiliano Attianese",
                          posizione: "JFE",
                        },
                        {
                          nome: "Gianluca La Rosa",
                          posizione: "JFE",
                        },
                        {
                          nome: "Davide Ghiotto",
                          posizione: "SFE",
                        },
                        {
                          nome: "Niccolò Naso",
                          posizione: "JFE",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager UI/UX",
                      nome: "Gabriella Moro",
                      team: [
                        {
                          nome: "Federico Bianchi",
                          posizione: "Junior",
                        },
                        {
                          nome: "Marinella Mastrosimone",
                          posizione: "Senior",
                        },
                        {
                          nome: "Claudia Miliziano",
                          posizione: "Senior",
                        },
                      ],
                    },
                    {
                      ruolo: "Manager Mobile",
                      nome: "Samantha Giro",
                      team: [
                        {
                          nome: "Mattia Contin",
                          posizione: "ME",
                        },
                        {
                          nome: "Davide Magli",
                          posizione: "ME",
                        },
                        {
                          nome: "Emanuele Maso",
                          posizione: "SME",
                        },
                        {
                          nome: "Federico Nessi",
                          posizione: "SME",
                        },
                      ],
                    },
                  ],
                },
                {
                  ruolo: "Scrum Master",
                  nome: "Fabio Mauro",
                },
                {
                  ruolo: "Architect",
                  nome: "Mauro Cortellazzi",
                },
                {
                  ruolo: "Product Owner",
                  nome: "Mauro Mariniello",
                },
                {
                  ruolo: "Manager BE",
                  nome: "Marco Riva",
                },
              ],
            },
            {
              nome_area: "Data Engineering",
              responsabile: {
                ruolo: "Head of Data Engineering",
                nome: "Antonio Barbuzzi",
              },
              team: [
                {
                  nome: "Nicola Manca",
                  posizione: "JDE",
                },
                {
                  nome: "Carlo Pignatiello",
                  posizione: "JDE",
                },
                {
                  nome: "Claudiu Pintilie",
                  posizione: "JDE",
                },
                {
                  nome: "Domenico Simone",
                  posizione: "DE",
                },
              ],
            },
          ],
        },
        {
          ruolo: "Chief Financial Officer",
          nome: "Enrico Sala",
          riporta_a: "CEO",
          aree: [
            {
              nome_area: "Amministrazione",
              riporti: [
                {
                  ruolo: "Head of Admin e Facility",
                  nome: "Debora Marighetto",
                  team: [
                    {
                      ruolo: "Admin Specialist",
                      nome: "Marta Chiribiri",
                    },
                    {
                      ruolo: "Admin Specialist",
                      nome: "Anamaria Juric",
                    },
                  ],
                },
                {
                  ruolo: "Grant and Tender Account Senior Manager",
                  nome: "Mirko Lazzarato",
                },
                {
                  ruolo: "System Administrator",
                  nome: "Matteo Bianchi",
                },
              ],
            },
          ],
        },
        {
          ruolo: "Direttore Generale ProActivity",
          nome: "Leonardo Cullurà",
          riporta_a: "CEO",
          societa: "ProActivity",
          aree: [
            {
              nome_area: "Vendite ProActivity",
              riporti: [
                {
                  ruolo: "Chief Sales Officer ProActivity",
                  nome: "Alessandro Peretti",
                },
              ],
            },
            {
              nome_area: "Engineering ProActivity",
              team: [
                {
                  ruolo: "Software Engineer",
                  nome: "Alessio Bizzotto",
                },
                {
                  ruolo: "Software Engineer – Junior",
                  nome: "Michael Bonini",
                },
                {
                  ruolo: "Software Engineer",
                  nome: "Nicola Carlucci",
                },
                {
                  ruolo: "Software Engineer - Senior",
                  nome: "Alessandro Conte",
                },
                {
                  ruolo: "Software Engineer - Senior",
                  nome: "Davide Frola",
                },
                {
                  ruolo: "Front-end Engineer",
                  nome: "Vincenzo Dell'Avvocato",
                },
                {
                  ruolo: "Front-end Engineer",
                  nome: "Agnese Di Marzio",
                },
                {
                  ruolo: "Front-end Engineer",
                  nome: "Stefano Frontini",
                },
                {
                  ruolo: "Front-end Engineer - Senior",
                  nome: "Giuseppe Ciullo",
                },
                {
                  ruolo: "Mobile Developer",
                  nome: "Enrico Fantini",
                },
                {
                  ruolo: "Mobile Developer",
                  nome: "Luigi Mazzarella",
                },
              ],
            },
          ],
        },
        {
          ruolo: "Chief Presales Officer",
          nome: "Michele Ridi",
          riporta_a: "CEO",
        },
        {
          ruolo: "Head Radicalbit Platform (ad interim)",
          nome: "Antonio Barbuzzi",
          riporta_a: "COO",
          area: "Radicalbit Platform",
          riporti: [
            {
              ruolo: "Scrum Master",
              nome: "Fabio Mauro",
            },
            {
              ruolo: "Architect",
              nome: "Mauro Cortellazzi",
            },
            {
              ruolo: "Product Owner",
              nome: "Mauro Mariniello",
            },
            {
              ruolo: "Manager BE",
              nome: "Marco Riva",
              team: [
                {
                  ruolo: "Software Engineer",
                  nome: "Daniele Tria",
                },
              ],
            },
            {
              ruolo: "Manager FE",
              nome: "Luca Tagliabue",
            },
          ],
        },
        {
          ruolo: "Chief HR Officer & Organization",
          nome: "Raffaella Volpato",
          riporta_a: "CEO",
          aree: [
            {
              nome_area: "Marketing",
              riporti: [
                {
                  ruolo: "Mktg & Communication Senior Manager",
                  nome: "Martina Casiraghi",
                  team: [
                    {
                      ruolo: "Digital Marketing Specialist",
                      nome: "Valentina Della Valle",
                    },
                    {
                      ruolo: "Marketing and Communication Specialist",
                      nome: "Chiara Schivo",
                    },
                  ],
                },
              ],
            },
            {
              nome_area: "HR",
              riporti: [
                {
                  ruolo: "RSGSI - Consulente esterno (Gerico)",
                  nome: "Eleonora De Vecchi",
                },
                {
                  ruolo: "Head of HR",
                  nome: "Cristina Del Vecchio",
                  riporti: [
                    {
                      ruolo: "Responsabile Selezione",
                      nome: "Melissa Gifuni",
                      team: [
                        {
                          ruolo: "Recruiter",
                          nome: "Carlotta Emili",
                        },
                        {
                          ruolo: "Recruiter",
                          nome: "Valentina Paris",
                        },
                      ],
                    },
                    {
                      ruolo: "Specialista Formazione e Sviluppo",
                      nome: "Giulia Migliore",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
