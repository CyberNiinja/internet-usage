import { responsivefy } from "./helper.js";
export const chartOne = () => {
  // Toggle data sets
  const totalBtn = document.getElementById("button-total");
  const percentageBtn = document.getElementById("button-percentage");

  if (totalBtn) {
    totalBtn.addEventListener("click", () => {
      totalBtn.classList.add("button--active");
      percentageBtn.classList.remove("button--active");
      chart(true);
    });
  }

  if (percentageBtn) {
    percentageBtn.addEventListener("click", () => {
      percentageBtn.classList.add("button--active");
      totalBtn.classList.remove("button--active");

      chart(false);
    });
  }
  chart(true);
};

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#chart-1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

export const chart = (toggle = true) => {
  d3.selectAll("#chart-1 > svg > g > *").remove();

  //Read the data
  d3.csv(
    "./src/data/101.csv",

    // When reading the csv, I must format variables:
    function (d) {
      return {
        value: d.num,
        internetAccess: d["Internetzugang"],
        languageArea: d["Sprachgebiet"],
        homeSize: d["Haushaltsgrösse"],
        financialSituation: d["Subjektive finanzielle Situation des Haushalts"],
        absolute: d["Absolut / relativ"],
        date: d3.timeParse("%Y")(d["Jahr"]),
        result: d["Resultat"],
      };
    }
  ).then(
    // Now I can use this dataset:
    function (data) {
      var home = "";
      if (toggle) {
        home = "Anzahl Haushalte";
      } else {
        home = "Anteil (in % aller Haushalte)";
      }

      // Filter data
      const filteredData = data.filter(
        (d) =>
          d.value !== '"..."' &&
          d.internetAccess === "Haushalte mit Internetzugang" &&
          d.languageArea === "Schweiz" &&
          d.homeSize === "Haushaltsgrösse - Total" &&
          d.financialSituation === "Finanzielle Situation  - Total" &&
          d.absolute === home &&
          d.result === "Wert"
      );
      console.log(filteredData);
      // Add X axis --> it is a date format
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(filteredData, function (d) {
            return d.date;
          })
        )
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(filteredData, function (d) {
            return +d.value;
          }),
        ])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
      // Its opacity is set to 0: we don't see it by default.
      const tooltip = d3
        .select("#chart-1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip");

      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      const mouseover = function (event, d) {
        tooltip
          .html(d3.timeFormat("%Y")(d.date) + ": " + d.value)
          .style("opacity", 1)
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 60 + "px");
        d3.select(this).style("stroke", "black");
        console.log(d);
      };

      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      const mouseleave = function (d) {
        tooltip.transition().duration(200).style("opacity", 0);
        d3.select(this).style("stroke", "none");
      };

      // Add the line
      svg
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.value);
            })
        );

      // Add the circles
      svg
        .selectAll("circle")
        .data(filteredData)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("stroke", "none")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.value))
        .attr("r", 3)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);
    }
  );
};
