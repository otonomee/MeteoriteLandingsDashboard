import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";

function MeteoritesMap() {
  const [data, setData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const d3Container = useRef(null);
  const svgWidth = window.innerWidth;
  const svgHeight = window.innerHeight;

  useEffect(() => {
    axios
      .get("/meteorites_with_coordinates")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });

    // Load TopoJSON data and convert to GeoJSON
    d3.json("https://d3js.org/world-110m.v1.json").then((topology) => {
      const geoData = feature(topology, topology.objects.countries);
      console.log("GeoJSON data", geoData);
      setGeoData(geoData);
    });
  }, []);

  useEffect(() => {
    if (data && geoData && geoData.features && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Create projection
      const projection = d3
        .geoMercator()
        .scale(svgWidth / 6)
        .translate([svgWidth / 2, svgHeight / 2]);

      // Create path generator
      const path = geoPath().projection(projection);

      // Draw map
      const countries = svg.append("g").attr("id", "countries");
      countries.selectAll("path").data(geoData.features).enter().append("path").attr("d", path).style("fill", "#6B8E23"); // countries in darker color

      // Draw meteorites
      const meteorites = svg.append("g").attr("id", "meteorites");
      meteorites
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", (d) => Math.sqrt(d.count) * 2)
        .style("fill", "red")
        .style("opacity", 0.5)
        .on("mouseover", function (event, d) {
          const massKg = d.mass * 0.001;
          const massLb = d.mass * 0.00220462;
          const svgRect = d3Container.current.getBoundingClientRect();
          d3.select("#tooltip")
            .style("left", event.clientX - svgRect.left + "px")
            .style("top", event.clientY - svgRect.top + "px")
            .style("visibility", "visible")
            .text(`Name: ${d.name}, Mass: ${massKg.toFixed(2)} kg (${massLb.toFixed(2)} lb), Year: ${d.year}`);
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("visibility", "hidden");
        });
    }
  }, [data, geoData]);

  return (
    <div>
      <svg className="d3-component" width={svgWidth} height={svgHeight} ref={d3Container} />
      <div id="tooltip" style={{ position: "absolute", visibility: "hidden" }}></div>
    </div>
  );
}

export default MeteoritesMap;
