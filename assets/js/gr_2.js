(() => {
var margin = {top: 50, right: 20, bottom: 0, left: 40},
    width = 1120 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

var svg = d3.select('div.graph2')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom+200)
    .append('g')
        .attr('transform', 'translate(' + (margin.left+10) + ',' + margin.top + ')');

d3.csv('data/graph2.csv').then((data) => {

    var x = d3.scaleBand()
        .rangeRound([0, width-50])
        .padding(0.1)
        .domain(data.map((d) => d.Brand));
        
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
            .style('font-size', '16px')
            .style('font-family', '"Poppins", sans-serif')
            .attr('x', -10)
            .attr('y', -5)
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-80)');
    svg.append('text')
        .attr('x', width-70)
        .attr('y', height+35)
        .text('Brand')
        .style('text-transform', 'uppercase');

    var y = d3.scaleLinear()
        .domain([0, 250])
        .range([height, 0]);

    svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y).ticks(5));
    svg.append('text')
        .attr('x', -50)
        .attr('y', -35)
        .text('Frequency')
        .style('text-transform', 'uppercase');


    var tooltip = d3.select('div.graph2')
        .append('div')
            .attr('class', 'tooltip')
            .style('pointer-events', 'none')
            .style('transition', '0.2s')
            .style('color', '#8f9496c9')
            .style('opacity', 0)
            .style('background-color', '#111')
            .style('border-radius', '5px')
            .style('padding', '8px');

    var showTooltip = function(d) {
        tooltip
            .html('Brand: ' + d.Brand + '<br/>Supplements count: '  + d.Count)
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

    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d.Brand))
            .attr('width', 65)
            .attr('y', (d) => y(d.Count))
            .attr('height', (d) => height - y(d.Count))
            .on('mouseover', showTooltip)
            .on('mouseleave', hideTooltip);

    d3.select('input.graph2').on('change', change);


    function change() {

        var x0 = x.domain(data.sort(this.checked
            ? (a, b) => b.Count - a.Count
            : (a, b)  => d3.ascending(a.Brand, b.Brand))
            .map((d) => d.Brand))
            .copy();

        svg.selectAll('.bar')
            .sort((a, b) => x0(a.Brand) - x0(b.Brand));

        var transition = svg.transition().duration(950);

        transition.selectAll('.bar')
            .delay((d, i) => i * 40)
            .attr('x', (d) => x0(d.Brand));

        transition.select('.x.axis')
            .call(d3.axisBottom(x))
            .selectAll('g')
                .delay((d, i) => i * 40)
            .selectAll('text')
                .attr('y', -5);
    }
});
})();
