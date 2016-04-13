"use strict";

var defaultOptions = {
  onUpdate: function onUpdate() {}, ranges: [], onDoubleTap: function onDoubleTap() {},
  readOnly: true,
  minStep: 10
};

function timeTableIt(el) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  var formatter = d3.time.format("%H:%M");
  var xPadding = 25;
  var w, computedRanges, oneHour;

  options = Object.assign({}, defaultOptions, options);

  var d3el = d3.select(el);
  var svg = d3el.append("svg").style("transform", "translate3d(0,0,0)");

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
    var width = parseFloat(t.attr("width"));

    var x = parseFloat(t.attr('x') || 0) + delta;
    var dragDate = moment(xScale.invert(x));
    var mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    var xx = moment({ hour: dragDate.hour(), minute: mins });
    var newx = xScale(xx);

    var nxx = newx + width;

    _.each(computedRanges, function (rr, i2) {
      if (nxx >= rr.x && i2 != i && computedRanges[i].x <= rr.x) {
        newx = rr.x - width;
      }
    });
    _.each(computedRanges, function (rr, i2) {
      if (newx <= rr.x + rr.width && i2 != i && computedRanges[i].x >= rr.x + rr.width) {
        newx = rr.x + rr.width;
      }
    });

    var oldx = computedRanges[i].x;
    var deltar = newx - oldx;

    if (d3.event.dx <= 0 && deltar > 0) {
      return;
    }
    if (nxx > w - xPadding) {
      return;
    }

    computedRanges[i].x = newx;

    svg.selectAll(".group-" + num).each(function (gg) {
      var e = d3.select(this);
      var newX = parseFloat(e.attr('x') || 0) + deltar;
      e
      //.transition()
      //.ease('elastic')
      .attr('x', newX);
    });
  }).on("dragend", function (d, i) {
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

    var x = d3.event.x;
    x = Math.max(x, xPadding);
    x = Math.min(x, w - xPadding);

    var dragDate = moment(xScale.invert(x));
    var mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    var xx = moment({ hour: dragDate.hour(), minute: mins });
    var newx = xScale(xx);

    var t = d3.select(this);
    var num = t.attr('num');

    var stop = false;
    _.each(computedRanges, function (rr, i2) {
      if (newx <= rr.x + rr.width && i2 != i && computedRanges[i].x >= rr.x + rr.width) {
        newx = rr.x + rr.width;
        return;
      }
    });

    var oldx = computedRanges[i].x;
    computedRanges[i].x = newx;
    computedRanges[i].width = -computedRanges[i].x + oldx + computedRanges[i].width;
    t
    //.transition().ease('elastic')
    .attr("x", computedRanges[i].x);

    svg.selectAll(".range-group-" + num).each(function (gg) {
      var e = d3.select(this);
      e
      //.transition()
      //.ease('elastic')
      .attr('x', computedRanges[i].x).attr('width', computedRanges[i].width);
    });
  }).on("dragend", function (d, i) {
    var t = d3.select(this);
    var num = t.attr('num');
    var range = options.ranges[num];
    range.start = moment(xScale.invert(parseFloat(t.attr("x"))));
    options.onUpdate(range);
  });

  //drag handler for right handle
  var dragRightHandle = d3.behavior.drag().on("drag", function (d, i) {

    var x = d3.event.x;
    x = Math.max(x, xPadding);
    if (x >= w - xPadding) {
      return;
    }

    var dragDate = moment(xScale.invert(x));
    var mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    var xx = moment({ hour: dragDate.hour(), minute: mins });
    var newx = xScale(xx);

    var t = d3.select(this);
    var num = t.attr('num');

    var stop = false;
    _.each(computedRanges, function (rr, i2) {
      if (newx >= rr.x && i2 != i && computedRanges[i].x <= rr.x) {
        newx = rr.x;
      }
    });

    computedRanges[i].width = newx - computedRanges[i].x;
    t
    //.transition().ease('elastic')
    .attr("x", newx - parseFloat(t.attr('width')));

    svg.selectAll(".range-group-" + num).each(function (d) {
      var e = d3.select(this);
      e
      //.transition().ease('elastic')
      .attr('width', computedRanges[i].width);
    });
  }).on("dragend", function (d, i) {
    var t = d3.select(this);
    var num = t.attr('num');
    var range = options.ranges[num];
    range.end = moment(xScale.invert(parseFloat(t.attr("x")) + parseFloat(t.attr("width"))));
    options.onUpdate(range);
  });

  function redraw() {

    w = el.clientWidth;

    svg.attr("width", w).attr("height", 100);

    //rangesContainer.selectAll("*").remove();
    xScale.range([xPadding, w - xPadding]);

    oneHour = xScale(moment({ minutes: 30 }).toDate());

    computedRanges = _.map(options.ranges, function (d) {
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
    }).attr("class", function (d, i) {
      var out = "range range-group-" + i + " group-" + i;
      if (!d.id) {
        out += " range-unsaved";
      }
      return out;
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
        var ela = angular.element(el[0]);
        ela.on('hold', function (t) {
          options.onDoubleTap(ela, d, i);
        });
      }).call(dragTranslate);

      //left handle
      //controlsContainer
      enterG2.append('rect').attr("num", function (d, i) {
        return i;
      }).attr("class", function (d, i) {
        return "handle left-handle group-" + i;
      }).attr('height', 60).attr('width', 12).attr('opacity', 0).attr("x", function (d, i) {
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      }).attr('y', -5).call(dragLeftHandle).transition().attr('opacity', 1);

      //right handle
      //controlsContainer
      enterG2.append('rect').attr("num", function (d, i) {
        return i;
      }).attr("class", function (d, i) {
        return "handle right-handle group-" + i;
      }).attr('height', 60).attr('width', 12).attr('opacity', 0).attr('x', function (d, i) {
        //return xScale(d.start.toDate()) + xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4
        return computedRanges[i].x + computedRanges[i].width - 12;
      }).attr('y', -5).call(dragRightHandle).transition().attr('opacity', 1);

      //update logic

      periodControlContainer.select('.translate-handle').attr("x", function (d, i) {
        return computedRanges[i].x;
      }).attr('width', function (d, i) {
        return computedRanges[i].width;
      });

      periodControlContainer.select('.left-handle').attr("x", function (d, i) {
        return computedRanges[i].x;
      });

      periodControlContainer.select('.right-handle').attr('x', function (d, i) {
        return computedRanges[i].x + computedRanges[i].width - 12;
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
    },
    setRanges: function setRanges(ranges) {
      setTimeout(function () {
        options.ranges = ranges;
        redraw();
      }, 0);
    },
    setId: function setId(range, id) {
      setTimeout(function () {
        range = _.find(options.ranges, range);
        range.id = id;
        redraw();
      }, 0);
    }
  };
}