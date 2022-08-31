(() => {
var margin = {top: 40, right: 40, bottom: 40, left: 40}
    width = 1165,
    height = 590;

var svg = d3.select('div.graph1')
    .append('svg')
        .attr('width', width)
        .attr('height', height+20)
    .append('g');

d3.csv('data/graph1.csv').then((data) => {

    var x = d3.scaleLinear()
        .domain([0, 3300])
        .range([margin.left, width-margin.left-margin.right]);
    svg.append('g')
        .attr('transform', 'translate(0,' + (height-margin.bottom+60) + ')')
        .call(d3.axisBottom(x).ticks(5));
    svg.append('text')
        .attr('x', width-130)
        .attr('y', height+60)
        .text('Mean price')
        .style('text-transform', 'uppercase');

    var y = d3.scaleLinear()
        .domain([4, 5])
        .range([height-margin.top-margin.bottom+70, 20]);
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top-10) + ')')
        .call(d3.axisLeft(y));
    svg.append('text')
        .attr('x', 0)
        .attr('y', 13)
        .text('Mean rating')
        .attr('text-anchor', 'start')
        .style('text-transform', 'uppercase');

    var z = d3.scaleSqrt()
        .domain([21, 2565])
        .range([5, 50]);

    var colors = d3.scaleOrdinal(['#fbcac5', '#fccc13', '#076a64', '#dca358', '#fbf3eb']);

    var brand_label = d3.scaleOrdinal()
        .domain(['Vitamins','Minerals', 'Amino-Acids', 'Fish-Oil-Omegas-EPA-DHA', 'Greens-Superfoods'])
        .range([ 'Vitamins', 'Minerals', 'Amino acids', 'Fish Oil & Omegas', 'Greens & Superfoods']);

    var tooltip = d3.select('div.graph1')
        .append('div')
        .attr('class', 'tooltip')
        .style('pointer-events', 'none')
        .style('transition', '0.2s')
        .style('color', '#8f9496c9')
        .style('width', '200px')
        .style('opacity', 0)
        .style('background-color', '#111')
        .style('border-radius', '5px')
        .style('padding', '5px');

    var showTooltip = function(d) {
        tooltip
            .html('Category: ' + d.Category + '<br/>Rating: '  + d.Rating + '<br/>Price: ' + d.Price)
            .style('position', 'absolute')
            .style('text-align', 'center')
            .style('font-size', '16px')
            .style('font-family', '"Poppins", sans-serif')
            .style('opacity', .9)
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');
    };

    var hideTooltip = function(d) {
        tooltip
            .style('opacity', 0);
    };

    var selected = function(d){
        d3.selectAll('.bubbles')
            .transition().duration(300)
            .style('opacity', .1);
        d3.selectAll('.'+d.replace(/\s+/g, ''))
            .transition().duration(300)
            .style('opacity', 1);
    };
    var lisr = function(d) {
    vidget
        .html("Country: " + d.Country + "<br/> Place:")
        }

    var noSelected = function(d){
        d3.selectAll('.bubbles')
            .transition().duration(150)
            .style('opacity', .9);
    };

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('class', (d) => 'bubbles ' + d.Supplements.replace(/\s+/g, ''))
            .attr('cx', (d) => x(d.Price))
            .attr('cy', (d) => y(d.Rating))
            .attr('r', (d) => z(d.Count_review))
            .style('fill', (d) => colors(d.Supplements))
        .on('mouseover', showTooltip)
        .on('mouseleave', hideTooltip);

    svg.selectAll('myCircle')
        .data(['Vitamins','Minerals', 'Amino-Acids', 'Fish-Oil-Omegas-EPA-DHA', 'Greens-Superfoods'])
        .enter()
        .append('circle')
            .attr('cx', 900)
            .attr('cy', (d,i) => i*35 + 30)
            .attr('r', 10)
            .style('fill', (d) => colors(d))
            .style('stroke','#333')
            .style('stroke-width', '1px')
            .on('mouseover', selected)
            .on('mouseleave', noSelected);

    svg.selectAll('myText')
        .data(['Vitamins','Minerals', 'Amino-Acids', 'Fish-Oil-Omegas-EPA-DHA', 'Greens-Superfoods'])
        .enter()
        .append('text')
            .attr('x', 900 + 20)
            .attr('y', (d,i) => i*35 + 30)
            .style('fill', d => colors(d))
            .text((d) => brand_label(d))
            .style('alignment-baseline', 'middle')
        .on('mouseover', selected)
        .on('mouseleave', noSelected);
});
})();