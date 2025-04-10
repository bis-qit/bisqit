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

    // Define chart dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const barWidth = 40; // Width of each bar
    const barPadding = 10; // Padding between bars
    const chartWidth = data.length * (barWidth + barPadding); // Dynamic width based on number of bars
    const containerWidth = svgRef.current.clientWidth;
    const width = Math.max(chartWidth, containerWidth) - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
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
      .attr("rx", 3) // Rounded corners
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

    // Add x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", ".5em")
      .attr("transform");

    // Add x-axis label
    svg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Measurement Outcome");

    // Add y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickFormat(d => `${(+d * 100).toFixed(0)}%`));

    // Add y-axis label
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 12)
      .attr("text-anchor", "middle")
      .text("Probability");

  }, [probabilities, svgRef.current?.clientWidth, svgRef.current?.clientHeight]);

  return (
    <div className="w-full h-full overflow-x-auto">
      <svg ref={svgRef} className="h-full"></svg>
    </div>
  );
}