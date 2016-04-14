(function(){
  'use strict';

  angular
    .module('app')
    .directive('yearGrid', yearGrid);

  function yearGrid(validateForm, $compile) {
    var directive = {
      link,
      scope: {
        ranges: '=',
        onToggle : '=',
      },
      restrict: 'E',
      templateUrl: 'templates/directives/year-grid.html'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.monthsNames = moment.months();

      const days = [moment('0004-09-26')];

      const monthsChunked = _.chunk(_.range(12), 3);
      scope.monthsAndDaysChunked = monthsChunked.map(months => {
        return months.map(month => {
          const THE_YEAR = 4; // TODO: From scope
          const allDaysOfMonth = listDaysOfMonth(THE_YEAR, month).map(date => {
            const m = moment({ year: THE_YEAR, month, date });
            const selected = _.findIndex(days, d => m.isSame(d, 'day')) >= 0;
            return {
              day: date,
              selected
            };
          });
          let daysChunked = _.chunk(allDaysOfMonth, 7);
          daysChunked[daysChunked.length - 1] = fillForWeekList(_.last(daysChunked));
          return { month, daysChunked };
        });
      });

      // List of all day of month using current year in scope
      function listDaysOfMonth(year, month) {
        const lastDayOfMonth = moment({ month, year }).endOf('month').date();
        return _.range(1, lastDayOfMonth + 1);
      }

      // New list filled by null for a 7 length (week)
      function fillForWeekList(days) {
        const nullDiffFilled = _.fill(_.range(7 - days.length), null);
        return _.concat(days, nullDiffFilled);
      }

    };
  }
})();
