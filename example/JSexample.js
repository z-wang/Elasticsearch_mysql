/*
 * Copyright 2015 Goldman Sachs.
 */
define([
    './module'
], function(services) {
    'use strict';

    services.factory('elasticsearchService', [
            '$http',
            '$q',
            'envConfig',
        function($http, $q, envConfig) {

        //set elasticsearch cluster info.
        var url = '/CobeApp/ES',
            Host = envConfig.elasticsearch.host,
            Index = envConfig.elasticsearch.index;

        return {
            makeQueryByType : function(typeName, query, queryType, aggregationName) {
            /*
             *  typeName is the type that will be updated
             *  query should be reasonable query string passed in.
             *  queryType can be 'filter', 'query' or 'aggregation', according to elasticsearch docs. Default case will be 'filter'.
             *  aggregationName only used when queryType is 'aggregation'.
             */
                var defered = $q.defer(),
                    attr = {
                        params: {
                            host: Host,
                            index: Index,
                            type: typeName,
                            terms: "_search",
                            query: query
                        }
                    };
                $http.get(url, attr).
                    success(function(data){
                        var processedData  = [];
                        switch (queryType){
                            case 'aggregation':
                                processedData = data.aggregations[aggregationName].buckets;
                                break;
                            //[ZW] todo add more cases. example: 'filter' and 'query'
                            default:
                                data.hits.hits.forEach(function(it, index){
                                    it._source.id = index;
                                    processedData.push(it._source);
                                });
                        }
                        defered.resolve(processedData);
                    }).
                    error(function(data){
                        defered.reject(data);
                    });
                return defered.promise;
            },
            createFilterQuery : function(filterKey, filterValue, size) {
                var filter = {};
                filter[filterKey] = filterValue;

                var queryObj = {
                    from : 0,
                    size : (size) ? size:1000,
                    query : {
                        filtered : {
                            filter : {
                                term : filter
                            }
                        }
                    }
                };
                return JSON.stringify(queryObj);
            },
            createRangeQuery: function(field, from, to, size){
                var range = {};
                range[field] = { gte: from, lte: to };
                //greater than or equal to 'from', less than or equal to 'to'

                var queryObj = {
                    from : 0,
                    size : (size) ? size:1000,
                    query : {
                        filtered : {
                            filter : {
                                range : range
                            }
                        }
                    }
                };
                return JSON.stringify(queryObj);
            },
            createGetAllQuery: function(max) {
                var queryObj = {
                    from : 0,
                    size : (max) ? max:10
                };
                return JSON.stringify(queryObj);
            }
        };
    }]);
});
