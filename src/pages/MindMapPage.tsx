import React, { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Position } from 'react-flow-renderer';

function parseSummaryToFlow(summary: string) {
  // For demo: treat each sentence as a child of the root
  const children = summary.split(/(?<=[.!?])\s+/).filter(Boolean);
  const nodes = [
    {
      id: 'root',
      data: { label: 'Summary' },
      position: { x: 0, y: 250 },
      style: { background: '#6366f1', color: '#fff', borderRadius: 18, fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #6366f133', padding: 12, minWidth: 180 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    ...children.map((c, i) => ({
      id: `child-${i}`,
      data: { label: c },
      position: { x: 350, y: i * 120 },
      style: { background: '#a5b4fc', color: '#1e293b', borderRadius: 18, fontSize: 16, boxShadow: '0 2px 8px #6366f133', padding: 10, minWidth: 220 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    })),
  ];
  const edges = children.map((_, i) => ({
    id: `e-root-child-${i}`,
    source: 'root',
    target: `child-${i}`,
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }));
  return { nodes, edges };
}

const MindMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary || '';
  const selectedLanguage = location.state?.selectedLanguage || 'en';
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => parseSummaryToFlow(summary), [summary]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // For expand/collapse, you can add logic to dynamically add/remove children nodes

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-8">
      <Card className="w-full max-w-6xl mb-8 bg-gray-900 border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Mind Map</span>
            <Button onClick={() => navigate(-1)} variant="outline" size="sm">Back</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-300 text-sm">Language: <span className="font-semibold">{selectedLanguage}</span></div>
          <div style={{ width: '100%', height: '600px', background: '#18181b', borderRadius: 16 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              panOnDrag
              zoomOnScroll
              minZoom={0.2}
              maxZoom={2}
              defaultZoom={1}
              style={{ background: '#18181b', borderRadius: 16 }}
            >
              <Background color="#6366f1" gap={32} />
              <MiniMap nodeColor={() => '#6366f1'} maskColor="#18181b" />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindMapPage; 