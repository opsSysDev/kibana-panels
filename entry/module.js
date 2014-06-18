/** @scratch /panels/5
 * include::panels/terms.asciidoc[]
 */

/** @scratch /panels/terms/0
 * == terms
 * Status: *Stable*
 *
 * A table, bar chart or pie chart based on the results of an Elasticsearch terms facet.
 *
 */
define([
  'angular',
  'app',
  'underscore',
  'jquery',
  'kbn',
  'config'
],
function (angular, app, _, $, kbn, config) {
  'use strict';

  var module = angular.module('kibana.panels.entry', []);
  app.useModule(module);

  module.controller('entry', function($scope, querySrv, dashboard, filterSrv, fields) {
    $scope.panelMeta = {
      modals : [
        {
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }
      ],
      //editorTabs : [
      //  {title:'Queries', src:'app/partials/querySelect.html'}
      //],
      status  : "Stable",
      description : "Displays All dashboard"};

    // Set and populate defaults
    var _d = {
      /** @scratch /panels/terms/5
       * === Parameters
       *
       * field:: The field on which to computer the facet
       */
      field   : '_type',
      /** @scratch /panels/terms/5
       * exclude:: terms to exclude from the results
       */
      exclude : [],
      /** @scratch /panels/terms/5
       * missing:: Set to false to disable the display of a counter showing how much results are
       * missing the field
       */
      missing : true,
      /** @scratch /panels/terms/5
       * other:: Set to false to disable the display of a counter representing the aggregate of all
       * values outside of the scope of your +size+ property
       */
      other   : true,
      /** @scratch /panels/terms/5
       * size:: Show this many terms
       */
      size    : 10,
      /** @scratch /panels/terms/5
       * order:: count, term, reverse_count or reverse_term
       */
      order   : 'count',
      style   : { "font-size": '10pt'},
      /** @scratch /panels/terms/5
       * donut:: In pie chart mode, draw a hole in the middle of the pie to make a tasty donut.
       */
      donut   : false,
      /** @scratch /panels/terms/5
       * tilt:: In pie chart mode, tilt the chart back to appear as more of an oval shape
       */
      tilt    : false,
      /** @scratch /panels/terms/5
       * lables:: In pie chart mode, draw labels in the pie slices
       */
      labels  : true,
      /** @scratch /panels/terms/5
       * arrangement:: In bar or pie mode, arrangement of the legend. horizontal or vertical
       */
      arrangement : 'horizontal',
      /** @scratch /panels/terms/5
       * chart:: table, bar or pie
       */
      chart       : 'bar',
      /** @scratch /panels/terms/5
       * counter_pos:: The location of the legend in respect to the chart, above or below.
       */
      counter_pos : 'above',
      /** @scratch /panels/terms/5
       * spyable:: Set spyable to false to disable the inspect button
       */
      spyable     : true,
      /** @scratch /panels/terms/5
       * ==== Queries
       * queries object:: This object describes the queries to use on this panel.
       * queries.mode::: Of the queries available, which to use. Options: +all, pinned, unpinned, selected+
       * queries.ids::: In +selected+ mode, which query ids are selected.
       */
      queries     : {
        mode        : 'all',
        ids         : []
      },
    };
    _.defaults($scope.panel,_d);

    $scope.init = function () {
      $scope.hits = 0;

      $scope.$on('refresh',function(){
        $scope.get_data();
      });
      $scope.get_data();

    };

    $scope.get_data = function() {
        var request = $scope.ejs.Request().indices(config.kibana_index).types('dashboard');
        request.size(1000).doSearch(
          // Success
          function(result) {
            var entries = {}
            for (var i in result['hits']['hits']){
                var _source = result['hits']['hits'][i]['_source'];
                
                var mainclass = 'Other';
                if ('mainclass' in _source){
                    mainclass = _source['mainclass'];
                }
                var subclass = 'IIS' == mainclass || 'MOBILE' == mainclass ? '其它' : '';
                if ('subclass' in _source){
                    subclass = _source['subclass'];
                }

                if (mainclass in entries){
                    if (subclass in entries[mainclass]){
                        entries[mainclass][subclass].push(_source['title']);
                    } else{
                        entries[mainclass][subclass] = [_source['title']];
                    }
                }else{
                    entries[mainclass] = {};
                    entries[mainclass][subclass] = [_source['title']];
                }
            }


            var entriesList = [];

            for(var mainclass in entries){
                var One = {};

                One['title'] = mainclass;
                
                One['data'] = [];
                for (var subclass in entries[mainclass]){
                    entries[mainclass][subclass].sort(function(x,y){
                        if (x.toLowerCase()>y.toLowerCase())
                            return 1;
                        return -1;
                    });
                    One['data'].push({title:subclass,data:entries[mainclass][subclass]});
                }

                //sort IIS on subclass
                if ('IIS' == mainclass){
                    One['data'].sort(function(x,y){
                        var sortedTitles = ['公共服务','酒店','机票','火车票','攻略社区','无线'];
                        var lastones = [ "团队游", "商旅", "套餐", "邮轮", "地面业务", "用车", "主题游"];

                        if (lastones.indexOf(x['title']) != -1 && lastones.indexOf(y['title']) != -1){
                            return lastones.indexOf(x['title']) - lastones.indexOf(y['title']);
                        }
                        if (lastones.indexOf(x['title']) != -1){
                            return 1;
                        }
                        if (lastones.indexOf(y['title']) != -1){
                            return -1;
                        }

                        if (sortedTitles.indexOf(x['title']) == -1){
                            return 1;
                        }
                        if (sortedTitles.indexOf(y['title']) == -1){
                            return -1;
                        }

                        return sortedTitles.indexOf(x['title']) - sortedTitles.indexOf(y['title']);
                    });
                }

                else if ('MOBILE' == mainclass){
                    One['data'].sort(function(x,y){
                        var sortedTitles = ['Trace','Client','RestFul'];

                        if (sortedTitles.indexOf(x['title']) == -1){
                            return 1;
                        }
                        if (sortedTitles.indexOf(y['title']) == -1){
                            return -1;
                        }
                        return sortedTitles.indexOf(x['title']) - sortedTitles.indexOf(y['title']);
                    });
                }

                entriesList.push(One);
            }

            //sort on MainClass
            entriesList.sort(function(x,y){
                var sortedTitles = ['4xx-5xx','IIS','MOBILE','Cloud','OPS'];

                if (sortedTitles.indexOf(x['title']) == -1){
                    return 1;
                }
                if (sortedTitles.indexOf(y['title']) == -1){
                    return -1;
                }
                return sortedTitles.indexOf(x['title']) - sortedTitles.indexOf(y['title']);
            });


            $scope.entriesList = entriesList;
            return result;
          },
          // Failure
          function() {
            return false;
          }
        );
    };

    $scope.set_refresh = function (state) {
      $scope.refresh = state;
    };

    $scope.close_edit = function() {
      if($scope.refresh) {
        $scope.get_data();
      }
      $scope.refresh =  false;
    };

  });

});
