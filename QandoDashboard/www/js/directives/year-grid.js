'use strict';

(function () {
  'use strict';

  angular.module('app').directive('yearGrid', yearGrid);

  function yearGrid(validateForm, $compile) {
    var directive = {
      link: link,
      scope: {
        ranges: '=',
        onToggle: '='
      },
      restrict: 'E',
      templateUrl: 'templates/directives/year-grid.html'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.monthsNames = moment.months();

      var days = [moment('0004-09-26')];

      var monthsChunked = _.chunk(_.range(12), 3);
      scope.monthsAndDaysChunked = monthsChunked.map(function (months) {
        return months.map(function (month) {
          var THE_YEAR = 4; // TODO: From scope
          var allDaysOfMonth = listDaysOfMonth(THE_YEAR, month).map(function (date) {
            var m = moment({ year: THE_YEAR, month: month, date: date });
            var selected = _.findIndex(days, function (d) {
              return m.isSame(d, 'day');
            }) >= 0;
            return {
              day: date,
              selected: selected
            };
          });
          var daysChunked = _.chunk(allDaysOfMonth, 7);
          daysChunked[daysChunked.length - 1] = fillForWeekList(_.last(daysChunked));
          return { month: month, daysChunked: daysChunked };
        });
      });

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
    };
  }
})();