import React, { useMemo } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Handle, 
  Position, 
  NodeProps 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useChat } from '../context/ChatContext';

// ----------------------------------------------------
// CUSTOM NODE COMPONENTS
// ----------------------------------------------------
const CustomCenterNode: React.FC<NodeProps> = () => {
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold font-display shadow-[0_8px_20px_rgba(124,92,255,0.4)] border-2 border-primary/60 relative">
      <span>You</span>
      {/* Handles to hook up edges */}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

const CustomContactNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className="w-12 h-12 rounded-full bg-white border border-primary/20 flex items-center justify-center text-primary font-bold shadow-glass group-hover:scale-105 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 relative">
        <span className="text-xs">{data.initials}</span>
        <Handle type="target" position={Position.Bottom} className="opacity-0" />
        <Handle type="target" position={Position.Top} className="opacity-0" />
      </div>
      <span className="text-[10px] font-semibold text-textMuted mt-1 bg-white/70 px-2 py-0.5 rounded-full border border-primary/60 max-w-[80px] truncate text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {data.label}
      </span>
    </div>
  );
};

const nodeTypes = {
  centerNode: CustomCenterNode,
  contactNode: CustomContactNode,
};

// ----------------------------------------------------
// MAIN NETWORK GRAPH
// ----------------------------------------------------
export const NetworkGraph: React.FC = () => {
  const { currentData } = useChat();

  const { nodes, edges } = useMemo(() => {
    // Get the top 5 contacts (excluding "You" if listed, though topInteractions has top contacts)
    const contacts = currentData.topInteractions
      .slice(0, 5)
      .map(item => item.name);

    // Center node coordinate
    const centerX = 150;
    const centerY = 130;
    const radius = 85;

    // Build React Flow Nodes
    const initialNodes: Node[] = [
      {
        id: 'you',
        type: 'centerNode',
        position: { x: centerX, y: centerY },
        data: {},
        draggable: true,
      }
    ];

    const initialEdges: Edge[] = [];

    // Distribute contact nodes in a circle
    contacts.forEach((name, index) => {
      const angle = (index * 2 * Math.PI) / contacts.length - Math.PI / 2;
      const posX = centerX + radius * Math.cos(angle);
      const posY = centerY + radius * Math.sin(angle);

      // Split name to get initials
      const nameParts = name.split(' ');
      const initials = nameParts.map(p => p[0]).join('').slice(0, 2).toUpperCase();

      const nodeId = `contact-${index}`;

      initialNodes.push({
        id: nodeId,
        type: 'contactNode',
        position: { x: posX + 8, y: posY + 8 }, // offset center alignment slightly for sizing
        data: { label: name, initials },
        draggable: true,
      });

      // Edge connecting You -> Contact
      initialEdges.push({
        id: `edge-you-to-${nodeId}`,
        source: 'you',
        target: nodeId,
        animated: true,
        style: { 
          stroke: index % 2 === 0 ? '#7C5CFF' : '#00A3FF', 
          strokeWidth: 1.5,
          opacity: 0.4
        },
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [currentData]);

  return (
    <div className="w-full h-full min-h-[180px] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
      />
    </div>
  );
};
