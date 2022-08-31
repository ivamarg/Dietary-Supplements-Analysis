(() => {
var margin = {top: 40, right: 40, bottom: 40, left: 40}
    width = 1165,
    height = 450;

var svg = d3.select('div.graph4')
    .append('svg')
        .attr('width', width)
        .attr('height', height+100)
    .append('g')
        .attr('transform', 'translate(' + (margin.left+10) + ',' + margin.top+ ')');

d3.csv('data/graph4.csv').then((data) => {

    var x = d3.scaleLinear()
        .domain([0, 3700])
        .range([ 0, width -150]);
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
    svg.append('text')
        .attr('x', width-170)
        .attr('y', height+30)
        .text('Price')
        .style('text-transform', 'uppercase');

    var y = d3.scaleLinear()
        .domain([3.8, 5])
        .range([ height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));
    svg.append('text')
        .attr('x', -45)
        .attr('y', -27)
        .text('Rating')
        .attr('text-anchor', 'start')
        .style('text-transform', 'uppercase');

    var color = d3.scaleOrdinal()
        .domain(['Now_Foods', 'Solgar', 'Source_Naturals' ])
        .range([ '#076a64', '#fbcac5', '#fccc13']);

    var brand_label = d3.scaleOrdinal()
        .domain(['Now_Foods', 'Solgar', 'Source_Naturals'])
        .range([ 'Now Foods', 'Solgar', 'Source Naturals']);

    var shape = d3.scaleOrdinal()
        .domain(['Now_Foods', 'Solgar', 'Source_Naturals' ])
        .range([d3.symbol().size(400).type(d3.symbolTriangle)(),
        d3.symbol().size(400).type(d3.symbolSquare)(),
        d3.symbol().size(400).type(d3.symbolCircle)()]);
    var shape_big = d3.scaleOrdinal()
        .domain(['Now_Foods', 'Solgar', 'Source_Naturals' ])
        .range([d3.symbol().size(700).type(d3.symbolTriangle)(),
         d3.symbol().size(700).type(d3.symbolSquare)(),
         d3.symbol().size(700).type(d3.symbolCircle)()]);

    var highlight = function(d){

        var tooltip = d3.select('div.graph4')
            .append('div')
            .attr('class', 'tooltip')
            .style('color', '#8f9496c9')
            .style('width', '250px')
            .style('background-color', '#111')
            .style('border-radius', '5px')
            .style('padding', '5px');

        tooltip
            .html(d.Full_name)
            .style('position', 'absolute')
            .style('text-align', 'center')
            .style('font-size', '16px')
            .style('font-family', '"Poppins", sans-serif')
            .style('opacity', .9)
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');

        var selected_brand = d.Brand;

        //other dots on hover
        d3.selectAll('.dot')
            .style('opacity', .2);

        //dots of selected brand on hover
        d3.selectAll('.' + selected_brand)
            .attr('d', (d) => shape_big(d.Brand))
            .style('opacity', 1);

        //add brand name
        svg.append('g')
            .selectAll('label')
            .data(selected_brand[0])
            .enter()
            .append('text')
                .attr('class', 'label')
                .style('text-transform', 'uppercase')
                .attr('x', 900)
                .attr('y', -10)
                .style('fill', color(selected_brand))
                .text(brand_label(selected_brand))
                .style('alignment-baseline', 'middle')
                .style('opacity', .9);

        //add brand symbol
        svg.append('g')
            .selectAll('label')
            .data(selected_brand[0])
            .enter()
            .append('path')
                .attr('class', 'label')
                .attr('transform', 'translate(880,-10)')
                .attr('d',  (d) => shape(selected_brand))
                .style('fill', (d) => color(selected_brand))
                .style('stroke','#333')
                .style('stroke-width', '1px')
                .style('opacity', 1);
    };

    var doNotHighlight = function(){

        d3.selectAll('.tooltip')
            .remove();
    
        //delete label after hover
        d3.selectAll('.label')
            .remove();

        //return dots to their original state after hover
        d3.selectAll('.dot')
            .attr('d', (d) => shape(d.Brand))
            .style('opacity', .8);
    };

    // add dots
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('path')
            .attr('class', (d) => 'dot ' + d.Brand)
            .attr('transform', (d) => `translate(${x(d.Price)},${y(d.Rating)})`)
            .attr('d',  (d) => shape(d.Brand))
            .style('fill', (d) => color(d.Brand))
            .style('opacity', .8)
        .on('mouseover', highlight)
        .on('mouseleave', doNotHighlight)
        .style('cursor', 'pointer')
        .on('click', function(d) {
            window.open(`${d.Link}`);
        });
});
})();