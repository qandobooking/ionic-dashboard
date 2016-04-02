"use strict";

var defaultOptions = { onUpdate: function onUpdate() {}, ranges: [] };

function timeTableIt(el) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];


  var w = el.clientWidth;
  var formatter = d3.time.format("%H:%M");

  var svg = d3.select(el).append("svg").attr("width", w).attr("height", 100);

  var xScale = d3.time.scale().domain([moment({ hour: 0, minute: 0 }).toDate(), moment({ hour: 24, minute: 0 }).toDate()]).range([25, w - 25]);

  //top axis
  var xAxis = d3.svg.axis().scale(xScale).orient('top').ticks(24).tickFormat(formatter);

  var timeAxis = svg.append('g').attr("transform", function (d) {
    return "translate(0, 30)";
  }).attr('class', 'timeAxis').call(xAxis);

  var rangesContainer = svg.append('g').attr("transform", function (d) {
    return "translate(0, 30)";
  });

  //#TODO :USE ME FOR SNAPPING 
  var oneHour = xScale(moment({ minutes: 5 }).toDate());

  //drag handler for translate handle
  var dragTranslate = d3.behavior.drag().on("drag", function (d, i) {
    var delta = d3.event.dx;
    var t = d3.select(this);
    var num = t.attr('num');
    svg.selectAll(".group-" + num).each(function (gg) {
      var e = d3.select(this);
      e.attr('x', parseFloat(e.attr('x') || 0) + delta);
    });
    //calculate new start and use it on dragend
    t.attr("translate-start", xScale.invert(delta));
  }).on("dragend", function (d) {
    var t = d3.select(this);
    console.log("translate start", t.attr("translate-start"));
  });

  //drag handler for left handle
  var dragLeftHandle = d3.behavior.drag().on("drag", function (d, i) {
    var delta = d3.event.dx;
    var t = d3.select(this);
    var num = t.attr('num');
    t.attr("x", parseFloat(t.attr("x")) + delta);

    svg.selectAll(".range-group-" + num).each(function (gg) {
      var e = d3.select(this);
      e.attr('x', parseFloat(e.attr('x') || 0) + delta);
      e.attr('width', parseFloat(e.attr('width')) - delta);
    });

    //calculate new start and use it on dragend
    t.attr("new-start-delta", xScale.invert(delta));
  }).on("dragend", function (d) {
    var t = d3.select(this);
    console.log("new-start-delta", t.attr("new-start-delta"));
  });

  //drag handler for right handle
  var dragRightHandle = d3.behavior.drag().on("drag", function (d, i) {
    var delta = d3.event.dx;
    var t = d3.select(this);
    var num = t.attr('num');
    t.attr("x", parseFloat(t.attr("x")) + delta);

    svg.selectAll(".range-group-" + num).each(function (d) {
      var e = d3.select(this);
      e.attr('width', parseFloat(e.attr('width')) + delta);
    });

    //calculate new start and use it on dragend
    t.attr("new-end-delta", xScale.invert(delta));
  }).on("dragend", function (d) {
    var t = d3.select(this);
    console.log("new-end-delta", t.attr("new-end-delta"));
  });

  //data binding happens here
  var periodContainer = rangesContainer.selectAll('g.period').data(options.ranges);

  //enter logic
  var enterG = periodContainer.enter().append('g').attr('class', 'period');

  var rectangleContainer = enterG.append('g').attr('id', function (d, i) {
    return 'rectangle-container-' + i;
  }).attr("class", function (d, i) {
    return "rectangle-container group-" + i;
  }).attr("transform", function (d) {
    return "translate(" + xScale(d.start.toDate()) + ", 0)";
  });

  var controlsContainer = enterG.append('g').attr("class", function (d, i) {
    return "controls-container group-" + i;
  }).attr("transform", function (d) {
    return "translate(" + xScale(d.start.toDate()) + ", 0)";
  });

  //main rectangle
  rectangleContainer.append('rect').attr("class", function (d, i) {
    return "range range-group-" + i + " group-" + i;
  }).attr('height', 50).attr('width', function (d) {
    return xScale(d.end.toDate()) - xScale(d.start.toDate());
  });

  //translate handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle translate-handle group-" + i + " range-group-" + i;
  }).attr('x', 0).attr('height', 50).attr('width', function (d) {
    return xScale(d.end.toDate()) - xScale(d.start.toDate());
  }).style('opacity', 0).call(dragTranslate);

  //left handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle left-handle group-" + i;
  }).attr('height', 60).attr('width', 4).attr('x', 0).attr('y', -5).call(dragLeftHandle);

  //right handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle right-handle group-" + i;
  }).attr('height', 60).attr('width', 4).attr('x', function (d) {
    return xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4;
  }).attr('y', -5).call(dragRightHandle);

  //enter logic ends here

  //#TODO: add update logic ? (or simply redraw ...)

  //remove logic
  periodContainer.exit().remove();
}