import type { OrgUser } from "@/app/server-actions/organigramma/fetchOrgUsers";
import type { Edge, Node } from "@xyflow/react";
import dagre from "dagre";

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
const LEVEL3_COLUMN_SPACING = 200;
const LEVEL3_ROW_SPACING = 110;
const COMPACT_VERTICAL_SPACING = 70;
const LEVEL3_START_SPACING = 120;

const getLayoutConfig = (): {
  rankdir: "TB" | "LR";
  nodesep: number;
  ranksep: number;
} => {
  return {
    rankdir: "TB",
    nodesep: HORIZONTAL_SPACING,
    ranksep: COMPACT_VERTICAL_SPACING,
  };
};

const generateNodeId = (userId: string): string => {
  return `user-${userId}`;
};

const createNode = (user: OrgUser, level: number): Node<NodeData> => {
  const nodeData: NodeData = {
    nome: user.name,
    ruolo: user.title || user.posizione || "Employee",
    level,
    altri_ruoli:
      user.altri_ruoli && user.altri_ruoli.length > 0
        ? user.altri_ruoli
        : undefined,
  };

  if (user.area?.name) {
    nodeData.area = user.area.name;
  }
  if (user.societa?.name) {
    nodeData.societa = user.societa.name;
  }
  if (user.posizione) {
    nodeData.posizione = user.posizione;
  }

  return {
    id: generateNodeId(user.id),
    type: "orgNode",
    position: { x: 0, y: 0 },
    data: nodeData,
  };
};

const reorganizeLevel3Nodes = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  _layoutConfig: { rankdir: "TB" | "LR" }
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

    const numColumns = Math.ceil(Math.sqrt(children.length));

    children.forEach((child, index) => {
      const row = Math.floor(index / numColumns);
      const col = index % numColumns;

      const x = parentX + (col - (numColumns - 1) / 2) * LEVEL3_COLUMN_SPACING;
      const y = parentY + LEVEL3_START_SPACING + row * LEVEL3_ROW_SPACING;

      const childIndex = updatedNodes.findIndex((n) => n.id === child.id);
      if (childIndex !== -1) {
        updatedNodes[childIndex] = {
          ...updatedNodes[childIndex],
          position: { x, y },
        };
      }
    });
  }

  return updatedNodes;
};

const compactHigherLevels = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node<NodeData>[] => {
  const updated = [...nodes];

  const compactLevel2Horizontal = (
    nodesToCompact: Node<NodeData>[]
  ): Node<NodeData>[] => {
    const level2Nodes = nodesToCompact.filter((n) => n.data.level === 2);
    if (level2Nodes.length <= 1) return nodesToCompact;

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

    for (const [, children] of parentToChildren.entries()) {
      if (children.length <= 1) continue;

      const sortedChildren = [...children].sort(
        (a, b) => a.position.x - b.position.x
      );
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

  return compactLevel2Horizontal(updated);
};

const compactHigherLevelsWrapper = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node<NodeData>[] => {
  return compactHigherLevels(nodes, edges);
};

export const transformUsersToFlow = (
  users: OrgUser[]
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  if (users.length === 0) {
    return { nodes, edges };
  }

  const userMap = new Map<string, OrgUser>();
  const childrenMap = new Map<string, OrgUser[]>();

  for (const user of users) {
    userMap.set(user.id, user);
    if (user.referent_id) {
      if (!childrenMap.has(user.referent_id)) {
        childrenMap.set(user.referent_id, []);
      }
      childrenMap.get(user.referent_id)?.push(user);
    }
  }

  const findCEO = (): OrgUser | null => {
    for (const user of users) {
      if (!user.referent_id) {
        return user;
      }
    }
    return null;
  };

  const ceo = findCEO();
  if (!ceo) {
    return { nodes, edges };
  }

  const buildHierarchy = (
    user: OrgUser,
    level: number,
    parentNodeId?: string
  ): void => {
    const node = createNode(user, level);
    nodes.push(node);

    if (parentNodeId) {
      edges.push({
        id: `${parentNodeId}-${node.id}`,
        source: parentNodeId,
        target: node.id,
        type: "smoothstep",
      });
    }

    const children = childrenMap.get(user.id) || [];
    for (const child of children) {
      buildHierarchy(child, level + 1, node.id);
    }
  };

  buildHierarchy(ceo, 0);

  const layoutConfig = getLayoutConfig();
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: layoutConfig.rankdir,
    nodesep: layoutConfig.nodesep,
    ranksep: layoutConfig.ranksep,
  });

  for (const node of nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = graph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  const reorganizedNodes = reorganizeLevel3Nodes(
    layoutedNodes,
    edges,
    layoutConfig
  );
  const finalNodes = compactHigherLevelsWrapper(reorganizedNodes, edges);

  return { nodes: finalNodes, edges };
};

export const transformUsersToMainFlow = (
  users: OrgUser[]
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const ceo = users.find((u) => !u.referent_id);
  if (!ceo) {
    return { nodes: [], edges: [] };
  }

  const directReports = users.filter((u) => u.referent_id === ceo.id);
  const mainUsers = [ceo, ...directReports];

  return transformUsersToFlow(mainUsers);
};

export const transformUsersToSubOrgFlow = (
  users: OrgUser[],
  subOrgUserId: string
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const subOrgUser = users.find((u) => u.id === subOrgUserId);
  if (!subOrgUser) {
    return { nodes: [], edges: [] };
  }

  const getSubTree = (userId: string): OrgUser[] => {
    const user = users.find((u) => u.id === userId);
    if (!user) return [];

    const result = [user];
    const children = users.filter((u) => u.referent_id === userId);
    for (const child of children) {
      result.push(...getSubTree(child.id));
    }
    return result;
  };

  const subTreeUsers = getSubTree(subOrgUserId);
  return transformUsersToFlow(subTreeUsers);
};

export const getSubOrganizations = (
  users: OrgUser[]
): Array<{ user: OrgUser; title: string; isMarcoVeronese?: boolean }> => {
  const ceo = users.find((u) => !u.referent_id);
  if (!ceo) return [];

  const directReports = users.filter((u) => u.referent_id === ceo.id);
  const subOrgs: Array<{
    user: OrgUser;
    title: string;
    isMarcoVeronese?: boolean;
  }> = [];

  for (const report of directReports) {
    const hasChildren = users.some((u) => u.referent_id === report.id);
    if (hasChildren) {
      const isMarcoVeronese = report.name === "Marco Veronese";
      const title = `${report.title || report.posizione || "Employee"} - ${
        report.name
      }`;
      subOrgs.push({ user: report, title, isMarcoVeronese });
    }
  }

  return subOrgs;
};

export const getBusinessUnits = (
  user: OrgUser,
  allUsers: OrgUser[]
): Array<{ area: string; title: string }> => {
  const children = allUsers.filter((u) => u.referent_id === user.id);
  const areas = new Set<string>();

  for (const child of children) {
    if (child.area?.name) {
      areas.add(child.area.name);
    }
  }

  return Array.from(areas).map((areaName) => ({
    area: areaName,
    title: `${user.title || user.posizione || "Employee"} - ${
      user.name
    } (${areaName})`,
  }));
};

export const transformUsersToAreaFlow = (
  users: OrgUser[],
  parentUser: OrgUser,
  areaName: string
): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const parentChildren = users.filter(
    (u) => u.referent_id === parentUser.id && u.area?.name === areaName
  );

  const getAreaSubTree = (userId: string): OrgUser[] => {
    const user = users.find((u) => u.id === userId);
    if (!user) return [];

    const result = [user];
    const children = users.filter(
      (u) => u.referent_id === userId && u.area?.name === areaName
    );
    for (const child of children) {
      result.push(...getAreaSubTree(child.id));
    }
    return result;
  };

  const allAreaUsers = [parentUser];
  for (const child of parentChildren) {
    allAreaUsers.push(...getAreaSubTree(child.id));
  }

  return transformUsersToFlow(allAreaUsers);
};
