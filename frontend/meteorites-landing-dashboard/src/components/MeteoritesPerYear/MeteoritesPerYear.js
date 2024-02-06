import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

function MeteoritesPerYear() {
  const [data, setData] = useState(null);
  const d3Container = useRef(null);
  const svgWidth = window.innerWidth; // Set SVG width to width of screen

  useEffect(() => {
    axios
      .get("/meteorites_per_year")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Clear SVG
      svg.selectAll("*").remove();

      // Create scales
      const x = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.year), 2013])
        .range([0, svgWidth]); // Set range to width of screen

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .range([400, 0]);

      // Create and draw axes
      svg.append("g").attr("transform", "translate(0, 400)").call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));

      // Draw bars
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.count))
        .attr("width", svgWidth / data.length) // Set width of bars to width of screen divided by number of data points
        .attr("height", (d) => 400 - y(d.count));
    }
  }, [data]);

  return (
    <div>
      <h2>Meteorites Per Year</h2>
      <svg className="d3-component" width={svgWidth} height={400} ref={d3Container} /> {/* Set width of SVG to width of screen */}
    </div>
  );
}

export default MeteoritesPerYear;
