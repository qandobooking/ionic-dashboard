const defaultOptions = { 
  onUpdate : () => {}, ranges:[], onDoubleTap : () => {},
  readOnly : true 
}

function timeTableIt(el, options={}){

  const formatter = d3.time.format("%H:%M");
  const xPadding = 25;
  

  options = Object.assign({}, defaultOptions, options);
  
  const d3el = d3.select(el)
  const svg = d3el
    .append("svg");

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

  //drag handler for translate handle
  const dragTranslate = d3.behavior.drag()
  .on("drag", function(d,i) {
    const delta = d3.event.dx;
    const t = d3.select(this);
    const num = t.attr('num');
    svg.selectAll(".group-" + num)
    .each(function(gg){
      const e = d3.select(this);
      e.attr('x', parseFloat(e.attr('x') || 0)+delta);
    });
  })
  .on("dragend", function(d){
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
      options.onUpdate(range);
  });

  //drag handler for left handle
  const dragLeftHandle = d3.behavior.drag()
  .on("drag", function(d,i) {
    const delta = d3.event.dx;
    const t = d3.select(this);
    const num = t.attr('num');
    t.attr("x", parseFloat(t.attr("x")) + delta);
    
    svg.selectAll(".range-group-" + num)
    .each(function(gg){
      const e = d3.select(this);
      e.attr('x', parseFloat(e.attr('x') || 0)+delta);
      e.attr('width', parseFloat(e.attr('width'))-delta);
    });
    
  })
  .on("dragend", function(d){
    const t = d3.select(this);
    const num = t.attr('num');
    const range = options.ranges[num];
    range.start = moment(xScale.invert(parseFloat(t.attr("x"))));
    options.onUpdate(range);
      
  });

  //drag handler for right handle
  const dragRightHandle = d3.behavior.drag()
  .on("drag", function(d,i) {
    const delta = d3.event.dx;
    const t = d3.select(this);
    const num = t.attr('num');
    t.attr("x", parseFloat(t.attr("x")) + delta);
    
    svg.selectAll(".range-group-" + num)
    .each(function(d){
      const e = d3.select(this);
      e.attr('width', parseFloat(e.attr('width'))+delta);
    });

    
    
  })
  .on("dragend", function(d){
      const t = d3.select(this);
      const num = t.attr('num');
      const range = options.ranges[num];
      range.end = moment(xScale.invert(parseFloat(t.attr("x")) +parseFloat(t.attr("width"))));
      options.onUpdate(range);
  });

  //#TODO :USE ME FOR SNAPPING  
  const oneHour = xScale(moment({minutes:5}).toDate())
    
  

  function redraw(){
    
    const w = el.clientWidth;

    svg
    .attr("width", w)
    .attr("height", 100);
    
    //rangesContainer.selectAll("*").remove();
    xScale 
    .range([ xPadding, w-xPadding ]);

    const computedRanges = _.map(options.ranges, d => {
      d.x = xScale(d.start.toDate());
      d.width = xScale(d.end.toDate()) - xScale(d.start.toDate());
      //#TODO: this is a fix for negative widths, these data should not exist
      d.width = d.width < 0 ? 0 : d.width;  
      return d
    })

    timeAxis
    .call(xAxis);

    
    //data binding happens here
    const periodContainer = rangesContainer
    .selectAll('g.period')
    .data(options.ranges);

    const periodControlContainer = rangesContainer
    .selectAll('g.handlex')
    .data(options.ranges);

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
    .attr("x", function(d, i){
       //return xScale(d.start.toDate());
       return computedRanges[i].x;
    })
    .attr('width', function(d, i){
      //return xScale(d.end.toDate()) - xScale(d.start.toDate())  
      return computedRanges[i].width;
    });

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
        el = angular.element(el[0]);
        el.on('hold', function(t){
          console.log("d",d, i);
          options.onDoubleTap(el, d.weekday, i);
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
      .attr('width', 4)
      .attr("x", function(d, i){
        //return xScale(d.start.toDate());
        return computedRanges[i].x;
      })
      .attr('y', -5)
      .call(dragLeftHandle);
      
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
      .attr('width', 4)
      .attr('x', function(d, i){
        //return xScale(d.start.toDate()) + xScale(d.end.toDate()) - xScale(d.start.toDate()) - 4 
        return computedRanges[i].x + computedRanges[i].width;
      })
      .attr('y', -5)
      .call(dragRightHandle)
      
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
      .attr("x", function(d, i){
        return computedRanges[i].x;
      })
      .attr('x', function(d, i){
        return computedRanges[i].x + computedRanges[i].width;
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