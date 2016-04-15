(function(){
  'use strict';

  angular
    .module('app')
    .directive('yearGrid', yearGrid);

  function yearGrid(validateForm, $compile, $window) {
    var directive = {
      link,
      scope: {
        closingDays: '=',
        onDayToggled : '=',
        year : '=',
      },
      restrict: 'E',
      templateUrl: 'templates/directives/year-grid.html'
    };
    return directive;

    function link(scope, element, attrs) {

      const MONTH_CHUNK_SIZE = $window.innerWidth >= 420 ? 3 : 2;

      scope.useYear = typeof scope.year !== 'undefined';
      const year = scope.useYear ? parseInt(scope.year) : 4;

      scope.monthsNames = moment.months();

      const monthsChunked = _.chunk(_.range(12), MONTH_CHUNK_SIZE);
      scope.monthsAndDaysChunked = monthsChunked.map(months => {
        return months.map(month => {
          let allDaysOfMonth = listDaysOfMonth(year, month);
          // Shift by weekday
          if (scope.useYear) {
            allDaysOfMonth = shiftedByWeekday(year, month, allDaysOfMonth);
          }
          // Map into UI util objects
          allDaysOfMonth = allDaysOfMonth.map(date => {
            const m = moment({ year, month, date });
            const selected = _.findIndex(scope.closingDays, d => m.isSame(d, 'day')) >= 0;
            return {
              date,
              month,
              selected,
            };
          });
          // Chunk by week
          let daysChunked = _.chunk(allDaysOfMonth, 7);
          daysChunked[daysChunked.length - 1] = fillForWeekList(_.last(daysChunked));
          return { month, daysChunked };
        });
      });

      scope.onDayCellToggled = function(dayCell) {
        const { date, month, selected } = dayCell;
        const m = moment({ year, month, date });
        scope.onDayToggled(m, !selected);
        // Update UI object
        dayCell.selected = !dayCell.selected;
      };

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

      // Shift days by weekday
      function shiftedByWeekday(year, month, days) {
        const firstDayOfMonth = moment({ year, month, date: days[0] });
        const nullShiftFilled = _.fill(_.range(firstDayOfMonth.isoWeekday() - 1), null);
        return _.concat(nullShiftFilled, days);
      }

    };
  }
})();
