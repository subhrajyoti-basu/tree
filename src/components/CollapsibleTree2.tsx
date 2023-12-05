"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "@/app/data/data";
import { updateXPosition } from "@/lib/updatePosition";

interface tree{
  width: number
}
const valueToObj: any = {};
data.forEach((item) => {
  valueToObj[item.value] = { name: item.value, children: [] };
});

// Create the root node of the tree
let formatedData: any;
data.forEach((item) => {
  if (!item.parent) {
    formatedData = valueToObj[item.value];
  } else {
    valueToObj[item.parent].children.push(valueToObj[item.value]);
  }
});

const CollapsibleTree = ({width = 1300}: tree) => {
  const ref = useRef(null);
  const height = 500;
  // const width = 1300;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 40;

  // updateXPosition(root, height, width);
  const root1 = d3.hierarchy(formatedData);
  const treeLayout = d3.tree().size([height, width]);
  // const diagonal = d3
  //   .linkHorizontal()
  //   .x((d) => d.x)
  //   .y((d) => d.y);

  function diagonal(d: any) {
    const x0 = d.source.x;
    const y0 = d.source.y;
    const x1 = d.target.x;
    const y1 = d.target.y;
    return `M${x0} ${y0} L${x0 + (x1 - x0) - 15} ${y0} L${
      x0 + (x1 - x0) - 15
    } ${y1} L${x1} ${y1}`;
  }
  treeLayout(root1);
  updateXPosition(root1, 40, width - 10);

  useEffect(() => {
    const svg = d3
      // .create("svg")
      .select(ref.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)

      .attr("style", "max-width: 100%; height: auto;")
      .style("font", "14px sans-serif");

    const group = svg
      .append("g")
      .attr("transform", "translate(5,20)")
      .call(render, root1);

    // .x((d) => d.y)
    // .y((d) => d.x);
    function renderLine(group:any, root:any) {
      
      const links = root.links();
      const llink = group
        .selectAll("path")
        .data(links.slice(0, root.children.length))
        .enter()
        .append("g")
        

      llink
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 1)
        .attr("stroke-linejoin", "round")
        .attr("stroke-location", "center")
        .attr("stroke-width", 1)
        .attr("d", (d:any) => (d.source === root1 ? null : diagonal(d)));
    }

    function render(group:any, root:any) {
      const node = group
        .selectAll("g")
        .data(root.children)
        .enter()
        .append("g")
        .attr("cursor", "pointer");

      // console.log(links);

      // .attr("d", (d) => console.log(d));

      node
        .append("rect")
        .attr("fill", "white")
        .attr("x", (d:any) => d.x)
        .attr("y", (d:any) => d.y - 15)
        .attr("width", 190)
        .attr("stroke", "#000")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("stroke-width", "0.2px")
        .attr("height", 30);

      const text = node
        .append("text")
        .attr("x", (d:any) => d.x + 5)
        .attr("y", (d:any) => d.y)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr("fill-opacity", (d:any) => (d.children ? 1 : 0.7))

        .on("click", (e: Event, d:any) => expand(d));

      text
        .selectAll("text")
        .data((d:any) => d.data.name.split(" "))
        .enter()
        .append("tspan")
        // .attr("dy", (d, i, nodes) => console.log(d, i, nodes))
        .text((d:any) => d);
    }

    function expand(d:any) {
      console.log(d);
      if (d.children) {
       remove(d)
        group.append("g").attr('class', `line-${d.depth}`).call(renderLine, d).lower();
        group.append("g").attr('class', `node-${d.depth}`).call(render, d);
      }
    }

    function remove(d:any) {
      for(let i = d.depth; i <= 6; i++ ){

        group.selectAll(`g.line-${i}`).remove()
        group.selectAll(`g.node-${i}`).remove()
      }
    }

    return () => {
      svg.remove();
    };
  }, []);

  return (
    <div>
      <h1>Collapsible Tree</h1>
      <div ref={ref}></div>
    </div>
  );
};

export default CollapsibleTree;
