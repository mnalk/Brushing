// https://observablehq.com/@lisilinhart/brushing-example@217
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# suicide overview`
)});
  main.variable(observer("width")).define("width", function(){return(
500
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("padding")).define("padding", function(){return(
50
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/mnalk/9774fb9b221cfad2d21c387ff2e417ca/raw/10e00da7d61cfa82beb9a74e33fa26d48c04d05c/Suicide_Rates.csv")
)});
  main.variable(observer("x")).define("x", ["d3","data","padding","width"], function(d3,data,padding,width){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => Number(d.year))).nice()
    .range([padding, width-padding])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","padding"], function(d3,data,height,padding){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => Number(d.suicides_no))).nice()
    .range([height-padding, padding])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","padding","d3","x","width","data"], function(height,padding,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - padding / 2})`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width - padding)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(data.x))
)});
  main.variable(observer("yAxis")).define("yAxis", ["padding","d3","y","data"], function(padding,d3,y,data){return(
g => g
    .attr("transform", `translate(${padding / 2},0)`)
    .call(d3.axisLeft(y).ticks(2))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))
)});
  main.variable(observer("viewof selection")).define("viewof selection", ["d3","DOM","width","height","xAxis","yAxis","data","x","y","padding"], function(d3,DOM,width,height,xAxis,yAxis,data,x,y,padding)
{
  // create new SVG element
  const svg = d3.select(DOM.svg(width, height))
      .style("font", "12px sans-serif")
      .style("background-color", "#eee")
      .property("value", []);
  
  // append Axis
  svg.append("g")
      .call(xAxis);
  svg.append("g")
      .call(yAxis);

  // create a centered group
  const g = svg.selectAll("g")
        .data(data)
        .enter()
          .append("g")
          .attr("transform",d => `translate(${x(d.year)},${y(d.suicides_no)})`);
 
  // append circle
  g.append("circle")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("r", 3);

  // append brushing
  svg.append("g")
      .call(d3.brush()
          .extent([[padding / 2, padding / 2], [width - padding / 2, height - padding / 2]])
          .on("start brush end", brushed));
  
  // brushing function
  function brushed() {
    let value = [];
    if (d3.event.selection) {
      const [[x0, y0], [x1, y1]] = d3.event.selection;
      const cond = d => x0 <= x(d.year) && x(d.year) < x1 && y0 <= y(d.suicides_no) && y(d.suicides_no) < y1;
      value = data.filter(cond);
      
      svg.selectAll("circle")
        .attr("fill", (d) => {
          if(cond(d)) return 'red'
          return 'none';
        })
    }
    svg.property("value", value).dispatch("input");
  }
  
 
  return svg.node();
}
);
  main.variable(observer("selection")).define("selection", ["Generators", "viewof selection"], (G, _) => G.input(_));
  main.variable(observer()).define(["selection"], function(selection){return(
selection
)});
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height"], function(d3,DOM,width,height)
{
  // create new SVG element
  const svg = d3.select(DOM.svg(width, height))
      .style("font", "14px sans-serif")
      .style("background-color", "#eee")
      .property("value", []);

  return svg.node();
}
);
  return main;
}
