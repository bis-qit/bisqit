"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ProbabilityChartProps {
  probabilities: { [outcome: string]: number };
}

export default function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !probabilities) return;

    // Convert probabilities to array format
    const data = Object.entries(probabilities).map(([outcome, probability]) => ({
      outcome,
      probability,
    })).sort((a, b) => a.outcome.localeCompare(b.outcome));

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Define chart dimensions with appropriate margins
    const margin = { top: 15, right: 20, bottom: 35, left: 40 };
    
    // Determine minimum bar width based on number of outcomes
    const minBarWidth = 40; // Minimum width for each bar
    const barPadding = 10;
    const totalWidth = Math.max(300, data.length * (minBarWidth + barPadding));
    
    // Set height to be proportional but reasonable
    const height = 180;
    const width = totalWidth - margin.left - margin.right;

    // Create SVG with fixed dimensions for the container
    const svg = d3.select(svgRef.current)
      .attr("width", totalWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.outcome))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.probability) || 0.1])
      .nice()
      .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.outcome) || 0)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.probability))
      .attr("height", d => height - y(d.probability))
      .attr("fill", "steelblue")
      .attr("rx", 3)
      .attr("ry", 3);

    // Add probability values on top of bars
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => (x(d.outcome) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.probability) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => d.probability > 0.01 ? `${(d.probability * 100).toFixed(1)}%` : "");

    // Add x-axis with better positioning
    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    
    // Adjust x-axis labels if needed for many outcomes
    if (data.length > 8) {
      xAxis.selectAll("text")
        .attr("y", 10)
        .attr("x", -5)
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    }

    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(+d * 100).toFixed(0)}%`));

  }, [probabilities]);

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[220px]">
      <svg ref={svgRef} />
    </div>
  );
}