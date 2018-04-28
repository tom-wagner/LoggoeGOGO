import React from 'react';
import axios from 'axios';
import c3 from 'c3';
import jStat from 'jStat';
const d3 = require('d3');

function Random_normal_Dist(mean, sd, min_x, max_x, weight) {
    let data = [];
    for (var i = (min_x === undefined? (mean - 4 * sd) : 0); i < (max_x === undefined? (mean + 4 * sd): max_x); i += (max_x - min_x) / 1000) {
        let q = i
        let p = weight * jStat.normal.pdf(i, mean, sd);
        let arr = {
            "q": q,
            "p": p
        }
        data.push(arr);
    };
    return data;
}

function plot_gmm_data(means, sds, weights, X, hardClusters, duration, comments) {
    console.log('DURATION', duration);
    let normals = means
        .map((m, i) => (Random_normal_Dist(m, sds[i], 0, duration, weights[i])));
    let data = X.map((x_i, i) => ({
        time: x_i,
        color: hardClusters[i]
    }))
    plotNormals(normals, data, duration, comments)
}

function plotNormals(normals, data, duration, comments) {
    console.log('PLOTTING', normals, data);
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let min_d = d3.min(normals.map(arr => d3.min(arr, d => d.q)));
    let max_d = d3.max(normals.map(arr => d3.max(arr, d => d.q)));
    let max_p = d3.max(normals.map(arr => d3.max(arr, d => d.p)));

    let stack = d3.stack().keys(d3.range(normals.length)).value((d, key) => d[key].p)
    let layers0 = stack(d3.transpose(normals));

    var x = d3.scaleLinear()
        .domain([min_d, max_d]).nice()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .domain([0, max_p])
        .range([height, 0]);

    var svg = d3.select("#vis-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var z = d3.interpolateCool;

    var stack_area = d3.area()
        .x((d, i) => x(duration * i / 1000))
        .y0(d => y(d[1]))
        .y1(d => y(d[0]));

    var area = d3.area()
        .x((d, i) => x(d.q))
        .y0(y(0))
        .y1(d => y(d.p));

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("path")
        .data(layers0)
        .enter().append("path")
        .attr("d", stack_area)
        .attr("fill", (d, i) => colorScale(i))
        .on("mouseover", (d, i) => {
            svg.append("path")
                .datum(normals[i])
                .attr('id', 'line' + i.toString())
                .attr("fill", "none")
                .attr("d", line)
                .attr('stroke', 'black')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '15,15');
        })
        .on("mouseout", (d, i) => {
            d3.select('#line' + i.toString())
                .remove();
        });

    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    var line = d3.line()
        .x(function (d) { return x(d.q); })
        .y(function (d) { return y(d.p); });

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(0))
        .style('fill', d => colorScale(d.color))
        .style('opacity', 1)
        .style('stroke', 'black')
        .on("mouseover", (d, i) => {
            let t = 60 * d.time;
            let seconds = Math.round(t%60);
            let minutes = Math.round((t - t % 60)/60);
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(minutes + ':' + (seconds < 10? '0': '') + seconds + '<br/>' + comments[i] + "<br/>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
        
        ;
    svg.selectAll('dot')
        .data(data)
        .enter().append('line')
        .attr('x1', d => x(d.time))
        .attr('y1', y(y.domain()[1]))
        .attr('x2', d => x(d.time))
        .attr('y2', y(0.05 * y.domain()[0] + 0.95 * y.domain()[1]))
        .style('stroke', d => colorScale(d.color))
        .style('stroke-width', 50)
        .style('opacity', 0.1);

    svg.selectAll('dot')
        .data(data)
        .enter().append('line')
        .attr('x1', d => x(d.time))
        .attr('y1', y(y.domain()[1]))
        .attr('x2', d => x(d.time))
        .attr('y2', y(0.05 * y.domain()[0] + 0.95 * y.domain()[1]))
        .style('stroke', d => colorScale(d.color))
        .style('stroke-width', 1)
        .style('opacity', 1);
}

class Visualization extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
    const VIDEO_ID = this.props.videoId || 'ZK3O402wf1c';

    axios.get('/vis-data', {params: {videoId: VIDEO_ID}})
    .then(res => {
        console.log('got data', res);
        console.log('Video length:', res.data.length);
        let data = res.data.data;
        let comments = res.data.comments;
        console.log('COMMENTS', comments);
        plot_gmm_data(data[0], data[1], data[2], data[3], data[4], res.data.length, comments);
    })
    .catch(err => {
        console.log('error getting data', err);
    });
  }

  render() {
    return (
        <svg id="vis-svg"/>
    );
  }

}


export default Visualization;

