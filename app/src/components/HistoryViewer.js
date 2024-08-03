import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

function HistoryViewer(props) {

  /*
  useEffect(() => {
    
    const data = props.navigator.getHistory()
    console.log('-----???', data)

    if (!data.length) return;

    d3.select("#tree-container").html("");

    // Step 1: Convert flat data to hierarchical structure
    const root = d3.stratify()
      .id(d => d.nodeId)
      .parentId(d => d.parentId)
      (data);

    // Step 2: Set up the SVG container
    const margin = { top: 20, right: 190, bottom: 30, left: 190 },
          width = 1960 - margin.left - margin.right,
          height = 900 - margin.top - margin.bottom;

    const svg = d3.select("#tree-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate("
            + margin.left + "," + margin.top + ")");

    // Step 3: Create the tree layout
    const tree = d3.tree()
      .size([height, width]);

    const treeData = tree(root);

    // Step 4: Draw the links
    const edge = svg.selectAll(".edge")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "edge")
      .style("fill", "none")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    // Step 5: Draw the nodes
    const node = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    node.append("circle")
      .attr("r", 3);

    // Step 6: Add labels
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -13 : 13)
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);
  }, [props.tab]);*/
  
  return (
    <div style={{width:"100%", marginBottom:"20px", textAlign:"center", background:'none'}}>
      <div id="tree-container"></div>
      {props.navigator.getHistory().map((wikiPage, index) => (
        <div key={"hist_"+index} style={{ marginTop:"16px"}}>{wikiPage.title}</div>
      ))}
    </div>
  );
}

export default HistoryViewer;




