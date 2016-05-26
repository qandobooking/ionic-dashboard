const defaultOptions = { 
  onUpdate : () => {},  onDoubleTap : () => {},
  onEmptyClick: (r) => { },
  readOnly : true,
  minStep : 10,
  minDuration : 120,
  extraArgs : {}
}

const handleWidth = 20;




function timeTableIt(el, options={}){

  const formatter = d3.time.format("%H:%M");
  const xPadding = 25;
  var w, computedRanges, oneHour;
  angular.forEach(defaultOptions, (v, k) => {
    if (options[k] === undefined){
      options[k] = defaultOptions[k]
    }
  })
  
  const d3el = d3.select(el)
  const svg = d3el
    .append("svg")
    .style("transform", "translate3d(0,0,0)");

  const xScale = d3.time.scale()
  .domain([ moment({hour:0, minute:0}).toDate(), 
      moment({hour:24, minute:0}).toDate() ]);

  //top axis
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .ticks(24)
    .tickFormat(formatter);

  const timeAxis = svg.append('g')
    .attr("transform", function(d){
        return "translate(0, 30)";
    })
    .attr('class', 'timeAxis')

  const rangesContainer = svg.append('g')
  .attr("transform", function(d){
      return "translate(0, 30)";
  });


  //utility function for preparing ranges for d3 viz
  const prepareRange = d => {
      d.x = xScale(d.start.toDate());
      d.width = xScale(d.end.toDate()) - xScale(d.start.toDate());
      //#TODO: this is a fix for negative widths, these data should not exist
      d.width = d.width < 0 ? 0 : d.width;  
      return d
    }

  //drag handler for translate handle
  const dragTranslate = d3.behavior.drag()
  .on("drag", function(d,i) {

    rangesContainer
    .selectAll('.period-add')
    .style("opacity", .2)

    const delta = d3.event.dx;
    
    const t = d3.select(this);
    const num = t.attr('num');
    const width = parseFloat(t.attr("width"));

    let x = parseFloat(t.attr('x')||0) + delta;
    let dragDate = moment(xScale.invert(x))
    let mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    let xx = moment({hour:dragDate.hour(), minute:mins})
    let newx = xScale(xx);

    const nxx = newx + width;
    
    _.each(computedRanges, (rr, i2) => {
      if(nxx >= rr.x && i2 != i && computedRanges[i].x <= rr.x){
        newx = rr.x - width;
      }
    })
    _.each(computedRanges, (rr, i2) => {
      if(newx <= rr.x + rr.width && i2 != i && computedRanges[i].x >= rr.x + rr.width){
        newx = rr.x + rr.width;
      }
    })

    let oldx = computedRanges[i].x;
    let deltar = newx - oldx;
    
    if(d3.event.dx <= 0 && deltar > 0) {
      return
    }
    if(nxx > w - xPadding) {
      return
    }

    computedRanges[i].x = newx;
    
    svg.selectAll(".group-" + num)
    .each(function(gg){
      const e = d3.select(this);
      const newX = parseFloat(e.attr('x') || 0) + deltar;
      e
      //.transition()
      //.ease('elastic')
      .attr('x', newX);
    });

    

  })
  .on("dragend", function(d, i){
      rangesContainer
      .selectAll('.period-add')
      .style("opacity", 1)

      const t = d3.select(this);
      const num = t.attr('num');
      const range = options.ranges[num];

      
      const newStart = moment(xScale.invert(parseFloat(t.attr("x"))));
      const delta = range.start.diff(newStart);
      if(newStart.isSame(range.start)){
        return;
      }
      range.start = newStart;
      range.end = range.end.subtract(delta)
      //redraw() updates labels, etc. #TODO: check performance
      redraw()
      options.onUpdate(range);
      
  });

  //drag handler for left handle
  const dragLeftHandle = d3.behavior.drag()
  .on("drag", function(d,i) {

    rangesContainer
    .selectAll('.period-add')
    .style("opacity", .2)
    
    let x = d3.event.x;
    x = Math.max(x, xPadding);
    x = Math.min(x, w - xPadding);

    

    let dragDate = moment(xScale.invert(x))
    let mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    let xx = moment({hour:dragDate.hour(), minute:mins})

    let newx = xScale(xx);
    
    const t = d3.select(this);
    const num = t.attr('num');
    
    //#TODO: use this
    //let minDelta = xScale(moment({minute:options.minDuration}));
    if(newx > d.x + d.width) {
      newx = d.x + d.width;
    }
    
    _.each(computedRanges, (rr, i2) => {
      if((newx <= rr.x + rr.width && i2 != i && computedRanges[i].x >= rr.x + rr.width)){
        newx = rr.x + rr.width;
        return
      }
    })
    
    
    let oldx = computedRanges[i].x;
    computedRanges[i].x = newx;
    computedRanges[i].width = - computedRanges[i].x + oldx + computedRanges[i].width;
    t
    //.transition().ease('elastic')
    .attr("x", computedRanges[i].x);
    
    svg.selectAll(".range-group-" + num)
    .each(function(gg){
      const e = d3.select(this);
      e
      //.transition()
      //.ease('elastic')
      .attr('x', computedRanges[i].x)
      .attr('width', computedRanges[i].width);
    });
    
  })
  .on("dragend", function(d, i){

    rangesContainer
    .selectAll('.period-add')
    .style("opacity", 1)

    const t = d3.select(this);
    const num = t.attr('num');
    const range = options.ranges[num];
    range.start = moment(xScale.invert(parseFloat(t.attr("x"))));
    //redraw() updates labels, etc. #TODO: check performance
    redraw()
    options.onUpdate(range);

  });

  //drag handler for right handle
  const dragRightHandle = d3.behavior.drag()
  .on("drag", function(d,i) {

    rangesContainer
    .selectAll('.period-add')
    .style("opacity", .2)

    let x = d3.event.x;
    x = Math.max(x, xPadding);
    if (x >= w - xPadding){
      return
    }
     

    let dragDate = moment(xScale.invert(x))
    let mins = Math.round(dragDate.minute() / options.minStep) * options.minStep;
    let xx = moment({hour:dragDate.hour(), minute:mins})
    let newx = xScale(xx);

    
    const t = d3.select(this);
    const num = t.attr('num');

    if(newx < d.x) {
      newx = d.x;
    }
    
    
    _.each(computedRanges, (rr, i2) => {
      if(newx >= rr.x && i2 != i && computedRanges[i].x <= rr.x){
        newx = rr.x;
      }
    })

    computedRanges[i].width = newx - computedRanges[i].x;
    t
    //.transition().ease('elastic')
    .attr("x", newx - parseFloat(t.attr('width')));
    
    svg.selectAll(".range-group-" + num)
    .each(function(d){
      const e = d3.select(this);
      e
      //.transition().ease('elastic')
      .attr('width', computedRanges[i].width);
    });
    
  })
  .on("dragend", function(d, i){

      rangesContainer
      .selectAll('.period-add')
      .style("opacity", 1);

      const t = d3.select(this);
      const num = t.attr('num');
      const range = options.ranges[num];
      range.end = moment(xScale.invert(parseFloat(t.attr("x")) +parseFloat(t.attr("width"))));
      //redraw() updates labels, etc. #TODO: check performance
      redraw()
      options.onUpdate(range);

  });

  

  function redraw(){
    
    w = el.clientWidth;

    svg
    .attr("width", w)
    .attr("height", 100);
    
    //rangesContainer.selectAll("*").remove();
    xScale 
    .range([ xPadding, w-xPadding ]);

    oneHour = xScale(moment({minutes:30}).toDate());
    computedRanges = _.map(options.ranges, prepareRange);
    let emptyRanges = [];
    
    timeAxis
    .call(xAxis);

    
    //data binding happens here
    const periodContainer = rangesContainer
    .selectAll('g.period')
    .data(options.ranges);


    const periodControlContainer = rangesContainer
    .selectAll('g.handlex')
    .data(options.ranges);



    if(!options.readOnly){
      let sortedComputedRanges = _.sortBy(computedRanges, item => item.start.toDate()) ;
      _.each(sortedComputedRanges, (r, idx) => {
        if (idx == 0){
          emptyRanges.push({ start : moment({hour:0}), end:r.start });
          
        }

        if(idx > 0 ) {
          emptyRanges.push({ start:sortedComputedRanges[idx-1].end,  end:r.start })
        }

        if (idx == sortedComputedRanges.length -1){
         emptyRanges.push({ start:r.end, end:moment({hour:24})}) 
        }

      })

      emptyRanges = _.filter(emptyRanges, r =>  r.end.diff(r.start, 'hours') >= 1);
      if(computedRanges.length == 0){
        emptyRanges.push({
          start:moment({ hour:0 }),
          end:moment({ hour:24})
        })
      }
      emptyRanges = _.map(emptyRanges, prepareRange);

    }

    //add rectangle

    const periodAddContainer = rangesContainer
    .selectAll('g.period-add')
    .data(emptyRanges, function(d, i){
      return d.x + "-" + d.width
    });

    
    const enterAddG = periodAddContainer
    .enter()
    .append('g')
    .attr('class', 'period-add');

    enterAddG
    .append('rect')
    .attr('height', 50)
    .attr("x", function(d, i){
       return d.x;
    })
    .attr('width', function(d, i){
      return d.width;
    })
    .on('click', function(d){
      options.onEmptyClick(d, options.extraArgs);
    })


    

    rangesContainer
    .selectAll('.period-add')
    .attr("x", function(d, i){
       return d.x;
    })
    .attr('width', function(d, i){
      return d.width;
    })

    periodAddContainer.exit().remove()
    
    



    //enter logic
    const enterG = periodContainer
    .enter()
    .append('g')
    .attr('class', 'period');

    //main rectangle
    enterG
    .append('rect')
    .attr("class", function(d,i){
        let out = `range range-group-${i} group-${i}`;
        if(!d.id){
          out += " range-unsaved"
        }
        return out
    })
    .attr('height', 50)
    //#TODO: THIS IS DUPLICATED. UPDATE IS ENOUGH
    .attr("x", function(d, i){
       //return xScale(d.start.toDate());
       return computedRanges[i].x;
    })
    .attr('width', function(d, i){
      //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
      return computedRanges[i].width;
    });


    enterG
    .append('text')
    .attr("class", function(d,i){
        let out = `label label-left group-${i}`;
        return out
    })
    enterG
    .append('text')
    .attr("class", function(d,i){
        let out = `label label-right group-${i}`;
        return out
    })


    //update logic
     
    periodContainer
    .select('.range')
    .attr("x", function(d, i){
       return computedRanges[i].x;
    })
    .attr('width', function(d, i){
      //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
      return computedRanges[i].width;
    })
    .attr("class", function(d,i){
        let out = `range range-group-${i} group-${i}`;
        if(!d.id){
          out += " range-unsaved"
        }
        return out
    });

    periodContainer
    .select('.label-left')
    .attr("x", function(d, i){
       //return xScale(d.start.toDate());
       return computedRanges[i].x;
    })
    .attr("y", 65)
    .text(function(d, i){
      //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
      return d.start.format('HH:mm')
    })

    periodContainer
    .select('.label-right')
    .attr("x", function(d, i){
       //return xScale(d.start.toDate());
       return computedRanges[i].x + computedRanges[i].width;
    })
    .attr("y", 65)
    .text(function(d, i){
      //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
      return d.end.format('HH:mm')
    })



    //remove logic
    periodContainer
    .exit()
    .remove()


    
    

    if (!options.readOnly) {
      //translate handle
      //controlsContainer
      //data binding happens here
      
      //enter logic
      const enterG2 = periodControlContainer
      .enter()
      .append('g')
      .attr('class', 'handlex');

      enterG2
      .append('rect')
      .attr("num", function(d,i){
        return i;
      })
      .attr("class", function(d,i){
        return `handle translate-handle group-${i} range-group-${i}`;
      })
      .attr("x", function(d, i){
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      })
      .attr('height', 50)
      .attr('width', function(d, i){
        //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
        return computedRanges[i].width;
      })
      .style('opacity', 0)
      .each(function(d, i){
        var el = d3.select(this);
        var ela = angular.element(el[0]);
        ela.on('hold', function(t){
          options.onDoubleTap(ela, d, i);
        })
      })
      .call(dragTranslate);

      //left handle
      //controlsContainer
      enterG2
      .append('rect')
      .attr("num", function(d,i){
        return i;
      })
      .attr("class", function(d,i){
          return "handle left-handle group-"+i;
      })
      .attr('height', 60)
      .attr('width', handleWidth)
      .attr('opacity', 0)
      .attr("x", function(d, i){
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      })
      .attr('y', -5)
      .call(dragLeftHandle)
      .transition()
      .attr('opacity', 1)

      
      //right handle
      //controlsContainer
      enterG2
      .append('rect')
      .attr("num", function(d,i){
        return i;
      })
      .attr("class", function(d,i){
          return "handle right-handle group-"+i;
      })
      .attr('height', 60)
      .attr('width', handleWidth)
      .attr('opacity', 0)
      .attr('x', function(d, i){
        //return xScale(d.start.toDate()) + xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4 
        return computedRanges[i].x + computedRanges[i].width - handleWidth;
      })
      .attr('y', -5)
      .call(dragRightHandle)
      .transition()
      .attr('opacity', 1)
      
      //update logic
      
      periodControlContainer
      .select('.translate-handle')
      .attr("x", function(d, i){
        return computedRanges[i].x;
      })
      .attr('width', function(d, i){
        return computedRanges[i].width;
      });

      periodControlContainer
      .select('.left-handle')
      .attr("x", function(d, i){
        return computedRanges[i].x;
      })

      periodControlContainer
      .select('.right-handle')
      .attr('x', function(d, i){
        return computedRanges[i].x + computedRanges[i].width - handleWidth;
      });
      
      //remove logic
      periodControlContainer.exit().remove();

    } else {
      periodControlContainer.remove()
    }

    
  
  }

  redraw();

  return {
    redraw : redraw,
    getRanges : function(){
      return options.ranges
    },
    setReadonly : function(ro){
      setTimeout(function(){
        options.readOnly = ro;
        redraw();  
      }, 0);
    },
    setRanges : function(ranges){
      setTimeout(function(){
        options.ranges = ranges;
        redraw();  
      }, 0);
    },
    setId : function(range, id){
      setTimeout(function(){
        range = _.find(options.ranges, range);
        range.id = id;
        redraw();  
      }, 0);
    }
  }



}
