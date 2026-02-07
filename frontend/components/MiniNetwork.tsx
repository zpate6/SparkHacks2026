// components/MiniNetwork.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PathNode { id: string; name: string; }

export default function MiniNetworkView({ fromId, toId }: { fromId: string, toId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [degree, setDegree] = useState<number | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/connections/path?from=${fromId}&to=${toId}`)
      .then(res => res.json())
      .then((path: PathNode[]) => {
        if (path && path.length >= 2) {
          setDegree(path.length - 1);
          renderPath(path);
        } else {
          setDegree(0);
          d3.select(svgRef.current).selectAll("*").remove();
        }
      });
  }, [fromId, toId]);

  const renderPath = (path: PathNode[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = svgRef.current?.clientWidth || 300;
    const height = 100;
    const xStep = d3.scalePoint<PathNode>().domain(path).range([50, width - 50]);

    const g = svg.append("g");

    // Dashed connecting line
    g.append("line")
      .attr("x1", xStep(path[0])!).attr("y1", 40)
      .attr("x2", xStep(path[path.length - 1])!).attr("y2", 40)
      .attr("stroke", "#dc2626").attr("stroke-width", 2).attr("stroke-dasharray", "4,4");

    // Nodes with Names
    const nodes = g.selectAll("g.node").data(path).join("g")
      .attr("transform", d => `translate(${xStep(d)}, 40)`);

    nodes.append("circle")
      .attr("r", (d, i) => i === 0 || i === path.length - 1 ? 10 : 6)
      .attr("fill", (d, i) => i === 0 || i === path.length - 1 ? "#dc2626" : "#3b82f6")
      .attr("stroke", "#fff");

    nodes.append("text")
      .text(d => d.name)
      .attr("y", 25) // Show name above the dot
      .attr("text-anchor", "middle")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-24 w-full bg-zinc-950 rounded-xl border border-zinc-800">
        <svg ref={svgRef} className="w-full h-full overflow-visible" />
      </div>
      <p className="text-center text-[10px] text-zinc-500 italic">
        {degree === 0 ? "No direct connection found" : `${degree} degree away`}
      </p>
    </div>
  );
}