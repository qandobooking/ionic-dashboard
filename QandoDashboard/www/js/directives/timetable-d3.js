"use strict";

var defaultOptions = { onUpdate: function onUpdate() {}, ranges: [], onDoubleTap: function onDoubleTap() {} };

function timeTableIt(el) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];


  var w = el.clientWidth;
  var formatter = d3.time.format("%H:%M");
  var xPadding = 25;

  var svg = d3.select(el).append("svg").attr("width", w).attr("height", 100);

  var xScale = d3.time.scale().domain([moment({ hour: 0, minute: 0 }).toDate(), moment({ hour: 24, minute: 0 }).toDate()]).range([xPadding, w - xPadding]);

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
  }).on("dragend", function (d) {
    var t = d3.select(this);
    var num = t.attr('num');
    var range = options.ranges[num];
    var newStart = moment(xScale.invert(parseFloat(t.attr("x"))));
    var delta = range.start.diff(newStart);
    if (newStart.isSame(range.start)) {
      return;
    }
    range.start = newStart;
    range.end = range.end.subtract(delta);
    options.onUpdate(range);
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
  }).on("dragend", function (d) {
    var t = d3.select(this);
    var num = t.attr('num');
    var range = options.ranges[num];
    range.start = moment(xScale.invert(parseFloat(t.attr("x"))));
    options.onUpdate(range);
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
  }).on("dragend", function (d) {
    var t = d3.select(this);
    var num = t.attr('num');
    var range = options.ranges[num];
    range.end = moment(xScale.invert(parseFloat(t.attr("x")) + parseFloat(t.attr("width"))));
    options.onUpdate(range);
  });

  //data binding happens here
  var periodContainer = rangesContainer.selectAll('g.period').data(options.ranges);

  //enter logic
  var enterG = periodContainer.enter().append('g').attr('class', 'period');

  var rectangleContainer = enterG.append('g').attr('id', function (d, i) {
    return 'rectangle-container-' + i;
  }).attr("class", function (d, i) {
    return "rectangle-container group-" + i;
  });

  var controlsContainer = enterG.append('g').attr("class", function (d, i) {
    return "controls-container group-" + i;
  });

  //main rectangle
  rectangleContainer.append('rect').attr("class", function (d, i) {
    return "range range-group-" + i + " group-" + i;
  }).attr('height', 50).attr("x", function (d) {
    return xScale(d.start.toDate());
  }).attr('width', function (d) {
    return xScale(d.end.toDate()) - xScale(d.start.toDate());
  });

  //translate handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle translate-handle group-" + i + " range-group-" + i;
  }).attr("x", function (d) {
    return xScale(d.start.toDate());
  }).attr('height', 50).attr('width', function (d) {
    return xScale(d.end.toDate()) - xScale(d.start.toDate());
  }).style('opacity', 0).call(function (d) {
    var el = angular.element(d[0]);
    el.on('doubletap', function (t) {
      console.error(t);
      options.onDoubleTap(el);
    });
  }).call(dragTranslate);

  //left handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle left-handle group-" + i;
  }).attr('height', 60).attr('width', 4).attr("x", function (d) {
    return xScale(d.start.toDate());
  }).attr('y', -5).call(dragLeftHandle);

  //right handle
  controlsContainer.append('rect').attr("num", function (d, i) {
    return i;
  }).attr("class", function (d, i) {
    return "handle right-handle group-" + i;
  }).attr('height', 60).attr('width', 4).attr('x', function (d) {
    return xScale(d.start.toDate()) + xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4;
  }).attr('y', -5).call(dragRightHandle);

  //enter logic ends here

  //#TODO: add update logic ? (or simply redraw ...)

  //remove logic
  periodContainer.exit().remove();
}