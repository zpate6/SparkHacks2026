// app/network-web/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BottomNav } from '@/components/BottomNav';

// Interfaces matching your GraphDataResponse.java DTOs
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  profession: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
}

export default function D3NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch data from your Spring Boot backend
    fetch('http://localhost:8080/api/connections/graph')
      .then((res) => res.json())
      .then((data: { nodes: GraphNode[]; links: GraphLink[] }) => {
        // Check if the graph is empty
      if (data.nodes.length === 0) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Construct your own profile as the central starting point
        const selfNode: GraphNode = {
          id: 'me',
          label: 'You', 
          profession: 'Computer Science Student', // Personalized based on your major
          x: width / 2,
          y: height / 2,
          fx: width / 2, // Fix the node in the center
          fy: height / 2
        };

        renderGraph({ nodes: [selfNode], links: [] });
      } else {
        renderGraph(data);
      }
        setLoading(false);
      })
      .catch((err) => console.error("Error loading graph:", err));
  }, []);

  const renderGraph = (data: { nodes: GraphNode[]; links: GraphLink[] }) => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;


    // Clear previous SVG content
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // 2. Setup Zooming
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform)));

    // 3. Setup Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // 4. Draw Links
    const link = g.append("g")
      .attr("stroke", "#444")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => d.type === 'WORKED_WITH' ? 2 : 1);

    // 5. Draw Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
        window.location.href = `/portfolio/${d.id}`; // Navigates to user portfolio
      });

      
      if (data.nodes.length === 1) {
         node.select("circle")
            .transition()
            .duration(2000)
            .attr("r", 12)
            .transition()
            .duration(2000)
            .attr("r", 8)
            .on("end", function() { d3.select(this).dispatch("pulse"); }); 
      }

    // Color code based on Profession
    const colorScale = (profession: string) => {
      switch (profession?.toUpperCase()) {
        case 'STUDIO': return '#ef4444';
        case 'PRODUCER': return '#3b82f6';
        case 'DIRECTOR': return '#10b981';
        case 'ACTOR': return '#f59e0b';
        default: return '#9ca3af';
      }
    };

    node.append("circle")
      .attr("r", 8)
      .attr("fill", d => colorScale(d.profession))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Add Labels
    node.append("text")
      .text(d => d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("class", "pointer-events-none select-none");

    // 6. Animation Ticks
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  };


  // Drag Helper
  function drag(simulation: d3.Simulation<GraphNode, undefined>) {
    return d3.drag<any, GraphNode>()
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <div className="absolute top-10 left-10 z-10 text-white">
        <p className="text-zinc-400">Drag to explore. Click to view Portfolio.</p>
      </div>
      {loading && (
        <div className="flex h-screen items-center justify-center text-white">
          Building connections...
        </div>
      )}
      <svg ref={svgRef} className="h-full w-full cursor-move" />
      <BottomNav></BottomNav>
    </div>
  );
}