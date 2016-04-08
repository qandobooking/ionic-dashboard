"use strict";

var defaultOptions = {
  onUpdate: function onUpdate() {}, ranges: [], onDoubleTap: function onDoubleTap() {},
  readOnly: true
};

function timeTableIt(el) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  var formatter = d3.time.format("%H:%M");
  var xPadding = 25;

  options = Object.assign({}, defaultOptions, options);

  var d3el = d3.select(el);
  var svg = d3el.append("svg");

  var xScale = d3.time.scale().domain([moment({ hour: 0, minute: 0 }).toDate(), moment({ hour: 24, minute: 0 }).toDate()]);

  //top axis
  var xAxis = d3.svg.axis().scale(xScale).orient('top').ticks(24).tickFormat(formatter);

  var timeAxis = svg.append('g').attr("transform", function (d) {
    return "translate(0, 30)";
  }).attr('class', 'timeAxis');

  var rangesContainer = svg.append('g').attr("transform", function (d) {
    return "translate(0, 30)";
  });

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

  //#TODO :USE ME FOR SNAPPING 
  var oneHour = xScale(moment({ minutes: 5 }).toDate());

  function redraw() {

    var w = el.clientWidth;

    svg.attr("width", w).attr("height", 100);

    //rangesContainer.selectAll("*").remove();
    xScale.range([xPadding, w - xPadding]);

    var computedRanges = _.map(options.ranges, function (d) {
      d.x = xScale(d.start.toDate());
      d.width = xScale(d.end.toDate()) - xScale(d.start.toDate());
      //#TODO: this is a fix for negative widths, these data should not exist
      d.width = d.width < 0 ? 0 : d.width;
      return d;
    });

    timeAxis.call(xAxis);

    //data binding happens here
    var periodContainer = rangesContainer.selectAll('g.period').data(options.ranges);

    var periodControlContainer = rangesContainer.selectAll('g.handlex').data(options.ranges);

    //enter logic
    var enterG = periodContainer.enter().append('g').attr('class', 'period');

    //main rectangle
    enterG.append('rect').attr("class", function (d, i) {
      var out = "range range-group-" + i + " group-" + i;
      if (!d.id) {
        out += " range-unsaved";
      }
      return out;
    }).attr('height', 50).attr("x", function (d, i) {
      //return xScale(d.start.toDate());
      return computedRanges[i].x;
    }).attr('width', function (d, i) {
      //return xScale(d.end.toDate()) - xScale(d.start.toDate()) 
      return computedRanges[i].width;
    });

    //update logic
    periodContainer.select('.range').attr("x", function (d, i) {
      return computedRanges[i].x;
    }).attr('width', function (d, i) {
      //return xScale(d.end.toDate()) - xScale(d.start.toDate()) 
      return computedRanges[i].width;
    });

    //remove logic
    periodContainer.exit().remove();

    if (!options.readOnly) {
      //translate handle
      //controlsContainer
      //data binding happens here

      //enter logic
      var enterG2 = periodControlContainer.enter().append('g').attr('class', 'handlex');

      enterG2.append('rect').attr("num", function (d, i) {
        return i;
      }).attr("class", function (d, i) {
        return "handle translate-handle group-" + i + " range-group-" + i;
      }).attr("x", function (d, i) {
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      }).attr('height', 50).attr('width', function (d, i) {
        //return xScale(d.end.toDate()) - xScale(d.start.toDate()) 
        return computedRanges[i].width;
      }).style('opacity', 0).each(function (d, i) {
        var el = d3.select(this);
        el = angular.element(el[0]);
        el.on('doubletap', function (t) {
          options.onDoubleTap(el);
        });
      }).call(dragTranslate);

      //left handle
      //controlsContainer
      enterG2.append('rect').attr("num", function (d, i) {
        return i;
      }).attr("class", function (d, i) {
        return "handle left-handle group-" + i;
      }).attr('height', 60).attr('width', 4).attr("x", function (d, i) {
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      }).attr('y', -5).call(dragLeftHandle);

      //right handle
      //controlsContainer
      enterG2.append('rect').attr("num", function (d, i) {
        return i;
      }).attr("class", function (d, i) {
        return "handle right-handle group-" + i;
      }).attr('height', 60).attr('width', 4).attr('x', function (d, i) {
        //return xScale(d.start.toDate()) + xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4
        return computedRanges[i].x + computedRanges[i].width;
      }).attr('y', -5).call(dragRightHandle);

      //update logic
      periodControlContainer.select('.translate-handle').attr("x", function (d, i) {
        return computedRanges[i].x;
      }).attr('width', function (d, i) {
        return computedRanges[i].width;
      });

      periodControlContainer.select('.left-handle').attr("x", function (d, i) {
        return computedRanges[i].x;
      });

      periodControlContainer.select('.right-handle').attr("x", function (d, i) {
        return computedRanges[i].x;
      }).attr('x', function (d, i) {
        return computedRanges[i].x + computedRanges[i].width;
      });
      //remove logic
      periodControlContainer.exit().remove();
    } else {
      periodControlContainer.remove();
    }
  }

  redraw();

  return {
    redraw: redraw,
    setReadonly: function setReadonly(ro) {
      setTimeout(function () {
        options.readOnly = ro;
        redraw();
      }, 0);
    }
  };
}