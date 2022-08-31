(() => {
var margin = {top: 40, right: 40, bottom: 40, left: 40}
    width = 1165,
    height = 590,
    radius = 240;

var arc = d3.arc()
    .innerRadius(radius/2)
    .outerRadius(radius);

var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

var svg = d3.select('div.graph3')
    .append('svg')
        .attr('width', width)
        .attr('height', height)
    .append('g')
        .attr('transform', 'translate(' + (width / 2 - 200) + ',' + height / 2 +')');

d3.csv('data/graph3.csv').then((data) => {

    var pie = d3.pie()
        .value((d) => d.Now_Foods)
        .sort(null);

    var color = d3.scaleOrdinal([ '#fbcac5', '#076a64', '#dca358','#fbf3eb','#fccc13']);

    var path = svg.datum(data)
        .selectAll('path')
        .data(pie)
        .enter()
        .append('path')
            .attr('fill', (d,i) => color(i))
            .attr('d', arc)
            .each(function(d) {this._current = d;});

    var polyline = svg.datum(data)
        .selectAll('polyline')
        .data(pie)
        .enter()
        .append('polyline')
            .attr('stroke', '#333')
            .style('fill', 'none')
            .attr('stroke-width', 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d);
              var posB = outerArc.centroid(d);
              var posC = outerArc.centroid(d);
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              posC[0] = radius * 1.25 * (midangle < Math.PI ? 1 : -1);
              return [posA, posB, posC];
            });

    var label = svg
        .selectAll('allLabels')
        .data(pie)
        .enter()
        .append('text')
            .text((d) => d.data.Supplements)
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 1.25 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? 'start' : 'end');
            });

    d3.selectAll('input.graph3').on('change', change);

    function change() {

        var value = this.value;

        pie.value((d) => d[value]);

        path = path.data(pie);
        path.transition().duration(950)
            .attrTween('d',function tween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return (t) => arc(i(t));
        });

        polyline = polyline.data(pie);
        polyline.transition().duration(0).delay((d, i) => i * 130)
            .attrTween('points', function(d){
                var i = d3.interpolate(this._current, d);
                this._current = i(0);
                return function(t) {
                    var d2 = i(t);
                    var posC = outerArc.centroid(d);
                    var midangle = d2.startAngle + (d2.endAngle - d2.startAngle) / 2;
                    posC[0] = radius * 1.25 * (midangle < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), posC];
                };
            });

        label = label.data(pie);
        label.transition().duration(0).delay((d, i) => i * 130)
            .attrTween('transform', function(d){
                this._current = this._current || d;
                var i = d3.interpolate(this._current, d);
                this._current = i(0);
                return function(t) {
                    var d2 = i(t);
                    var pos = outerArc.centroid(d2);
                    var midangle = d2.startAngle + (d2.endAngle - d2.startAngle) / 2;
                    pos[0] = radius * 1.25 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                };
            });

    };
});
})();

