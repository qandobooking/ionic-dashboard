'use strict';

(function () {
  'use strict';

  angular.module('app').directive('yearGrid', yearGrid);

  function yearGrid(validateForm, $compile, $window) {
    var directive = {
      link: link,
      scope: {
        closingDays: '=',
        onDayToggled: '=',
        year: '='
      },
      restrict: 'E',
      templateUrl: 'templates/directives/year-grid.html'
    };
    return directive;

    function link(scope, element, attrs) {

      var MONTH_CHUNK_SIZE = $window.innerWidth >= 420 ? 3 : 2;

      scope.useYear = typeof scope.year !== 'undefined';
      var year = scope.useYear ? parseInt(scope.year) : 4;

      scope.monthsNames = moment.months();

      var monthsChunked = _.chunk(_.range(12), MONTH_CHUNK_SIZE);
      scope.monthsAndDaysChunked = monthsChunked.map(function (months) {
        return months.map(function (month) {
          var allDaysOfMonth = listDaysOfMonth(year, month);
          // Shift by weekday
          if (scope.useYear) {
            allDaysOfMonth = shiftedByWeekday(year, month, allDaysOfMonth);
          }
          // Map into UI util objects
          allDaysOfMonth = allDaysOfMonth.map(function (date) {
            // No map the shifted null cells
            if (date === null) {
              return null;
            }
            var m = moment({ year: year, month: month, date: date });
            var selected = _.findIndex(scope.closingDays, function (d) {
              return m.isSame(d, 'day');
            }) >= 0;
            return {
              date: date,
              month: month,
              selected: selected
            };
          });
          // Chunk by week
          var daysChunked = _.chunk(allDaysOfMonth, 7);
          daysChunked[daysChunked.length - 1] = fillForWeekList(_.last(daysChunked));
          return { month: month, daysChunked: daysChunked };
        });
      });

      scope.onDayCellToggled = function (dayCell) {
        var date = dayCell.date;
        var month = dayCell.month;
        var selected = dayCell.selected;

        var m = moment({ year: year, month: month, date: date });
        scope.onDayToggled(m, !selected, function () {
          dayCell.selected = selected;
        });
        // Update UI object
        dayCell.selected = !dayCell.selected;
      };

      // List of all day of month using current year in scope
      function listDaysOfMonth(year, month) {
        var lastDayOfMonth = moment({ month: month, year: year }).endOf('month').date();
        return _.range(1, lastDayOfMonth + 1);
      }

      // New list filled by null for a 7 length (week)
      function fillForWeekList(days) {
        var nullDiffFilled = _.fill(_.range(7 - days.length), null);
        return _.concat(days, nullDiffFilled);
      }

      // Shift days by weekday
      function shiftedByWeekday(year, month, days) {
        var firstDayOfMonth = moment({ year: year, month: month, date: days[0] });
        var nullShiftFilled = _.fill(_.range(firstDayOfMonth.isoWeekday() - 1), null);
        return _.concat(nullShiftFilled, days);
      }
    };
  }
})();