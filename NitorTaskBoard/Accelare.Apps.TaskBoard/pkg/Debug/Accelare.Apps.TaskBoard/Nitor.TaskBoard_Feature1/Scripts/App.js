(function () {
    'use strict';
    angular.module('MyApp', [])

        .controller('MyController', function ($scope, $http, $q, $compile) {

            $scope.GenerateUrl = function (itemId) {
                var url = hostweburl + "/Lists/" + listName + "/DispForm.aspx?ID=" + itemId;

                var options, mesg;


                options = { url: url, title: "List Item" };
                //message type is required for checking type of message in Listner
                //mesg = { type: "OpenDialog", options: options };

                SP.UI.ModalDialog.showModalDialog(options);
                //var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
                //target.postMessage(mesg, '*');
            }

            $scope.RedirectToList = function (itemId) {
                var url = hostweburl + "/Lists/" + listName + "/AllItems.aspx";

                var mesg, listUrl;

                //message type is required for checking type of message in Listner
                mesg = { type: "OpenList", listUrl: url };

                var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
                target.postMessage(mesg, '*');
            }

            //get Status from list
            $scope.getStatus = function () {
                var executor = new SP.RequestExecutor(appweburl);
                if (listName == 'undefined' || listName == '')
                    console.error('Configure List Name webpart property.');
                else {
                    executor.executeAsync(
                        {
                            url:
                                appweburl +
                                "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/fields?$filter=EntityPropertyName eq 'Status'&@target='" +
                                hostweburl + "'",

                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                $("#spanPageTitle").html(listName);
                                var jsonObject = JSON.parse(data.body);
                                $scope.statusCollection = jsonObject.d.results[0].Choices.results;
                                $scope.getPriorities();
                            },
                            error: function (data, errorCode, errorMessage) {
                                console.error(errorMessage);
                            }
                        }
                    );
                }
            }

            //get Priority from list
            $scope.getPriorities = function () {
                var executor = new SP.RequestExecutor(appweburl);
                executor.executeAsync(
                    {
                        url:
                            appweburl +
                            "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/fields?$filter=EntityPropertyName eq 'Priority'&@target='" +
                            hostweburl + "'",

                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var jsonObject = JSON.parse(data.body);
                            $scope.prioritiesCollection = jsonObject.d.results[0].Choices.results;

                            $scope.getListItems();
                            $scope.getListItemEntityTypeFullName();
                        },
                        error: function (data, errorCode, errorMessage) {
                            console.error(errorMessage);
                        }
                    }
                );
            }

            $scope.getListItems = function () {
                if (ViewName == 'undefined' || ViewName == '') {
                    $scope.getItemsFromList('');
                    console.error('Configure View Name webpart property.');
                }
                else
                    $scope.getItemsFromView();
            }

            $scope.getListItemEntityTypeFullName = function () {
                var executor = new SP.RequestExecutor(appweburl);
                executor.executeAsync(
                    {
                        url:
                            appweburl +
                            "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/?$select=ListItemEntityTypeFullName&@target='" +
                            hostweburl + "'",

                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {

                            var jsonObject = JSON.parse(data.body);
                            $scope.ListItemEntityTypeFullName = jsonObject.d.ListItemEntityTypeFullName;
                        },
                        error: function (data, errorCode, errorMessage) {
                            console.error(errorMessage);
                        }
                    }
                );
            }

            $scope.getItemsFromView = function () {
                var context;
                var factory;
                var appContextSite;
                var collList;
                var web;
                var taskListsTemp = new Array();
                context = new SP.ClientContext(appweburl);
                factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
                context.set_webRequestExecutorFactory(factory);
                appContextSite = new SP.AppContextSite(context, hostweburl);
                web = appContextSite.get_web();

                var list = web.get_lists().getByTitle(listName);
                var view = list.get_views().getByTitle(ViewName);
                context.load(view);

                context.executeQueryAsync(
                    function (sender, args) {
                        $scope.getItemsFromList("<View><Query>" + view.get_viewQuery() + "</Query></View>")
                    },
                    function (sender, args) {
                        console.error("error: " + args.get_message());
                    }
                );
            }

            $scope.getItemsFromList = function (queryText) {
                var context;
                var factory;
                var appContextSite;
                var collList;
                var web;
                var taskListsTemp = new Array();
                context = new SP.ClientContext(appweburl);
                factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
                context.set_webRequestExecutorFactory(factory);
                appContextSite = new SP.AppContextSite(context, hostweburl);
                web = appContextSite.get_web();

                var list = web.get_lists().getByTitle(listName);

                var query = new SP.CamlQuery();
                query.set_viewXml(queryText);

                var items = list.getItems(query);

                context.load(items);
                context.executeQueryAsync(
                    function () {
                        var listEnumerator = items.getEnumerator();
                        var i = 0;
                        $scope.tasks = [];
                        while (listEnumerator.moveNext()) {
                            var currentItem = listEnumerator.get_current();
                            var obj = {};
                            obj.Id = currentItem.get_item('ID');
                            obj.Status = currentItem.get_item('Status');
                            obj.Priority = currentItem.get_item('Priority');
                            obj.Title = currentItem.get_item('Title');

                            try {
                                if (ColumnOne == '') {
                                    if (currentItem.get_item("AssignedTo") != null)
                                        obj.Column1 = currentItem.get_item("AssignedTo")[0].get_lookupValue();
                                    else
                                        obj.Column1 = '';
                                }
                                else {
                                    if (ColumnOne == "AssignedTo") {
                                        obj.Column1 = currentItem.get_item("AssignedTo")[0].get_lookupValue();
                                    }
                                    else {

                                        obj.Column1 = currentItem.get_item(ColumnOne);
                                    }
                                }
                            } catch (e) {
                                obj.Column1 = '';
                            }

                            try {
                                if (ColumnTwo == '') {
                                    if (currentItem.get_item("DueDate") != null) {
                                        var date = new Date(currentItem.get_item("DueDate").toString());
                                        obj.Column2 = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                                    }
                                    else
                                        obj.Column2 = '';
                                }
                                else {
                                    if (ColumnTwo == "DueDate") {
                                        var date = new Date(currentItem.get_item("DueDate").toString());
                                        obj.Column2 = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                                    }
                                    else {
                                        obj.Column2 = currentItem.get_item(ColumnTwo);
                                    }
                                }
                            } catch (e) {
                                obj.Column2 = '';
                            }

                            try {
                                if (ItemHealth == '')
                                    obj.ItemHealth = $scope.GetStyle(currentItem.get_item('ItemHealth'));
                                else
                                    obj.ItemHealth = $scope.GetStyle(currentItem.get_item(ItemHealth));
                            } catch (e) {
                                obj.ItemHealth = $scope.GetStyle('');
                            }

                            obj.DemoReady = currentItem.get_item(DemoReady);
                            obj.ConsultSolution = currentItem.get_item(ConsultSolution);
                            $scope.tasks.push(obj);

                            i++;
                        }
                        //alert("items retrieved: " + i);

                        setTimeout(function () {
                            $scope.$apply(function () {
                                //$scope.tasks = jsonObject.d.results;
                                //$scope.calculatePercentage($scope.tasks);
                                $scope.generateHtml();
                                $compile($(".task-board-area"))($scope);
                                //$scope.getCurrentUser();
                            });
                        }, 0);
                    },

                    function (sender, args) {
                        console.error("error in inner request: " + args.get_message());
                    }
                );

            }

            $scope.getCurrentUser = function () {
                $scope.currentUser;
                var executor = new SP.RequestExecutor(appweburl);
                executor.executeAsync(
                    {
                        method: "GET",
                        url: appweburl + "/_api/web/currentuser/?$expand=groups",
                        headers: { "Accept": "application/json;odata=verbose" },
                        success: function (data) {
                            var jsonObject = JSON.parse(data.body);
                            $scope.currentUser = jsonObject.d.Title;

                        },
                        error: function () {

                        }
                    });
            }

            $scope.GetStyle = function (obj) {
                if (obj == "null" || obj == undefined || obj == '')
                    return "5px solid #E6E6E6";
                else
                    return "5px solid " + obj;
            }

            $scope.generateHtml = function () {
                //create Columns
                var cols = new Array();
                $(".task-board-area").html("");

                $(".task-board-area").append("<div class=\"row top\"><div class=\"cell left\"></div></div>");

                cols = $scope.statusCollection;
                var itemCount = 1;
                for (var i = 0, n = cols.length; i < n; i++) {
                    $(".task-board-area .row.top").append('<div class="cell top"><span>' + cols[i] + '</span></div>')
                }

                //create Rows
                var rows = new Array();
                rows = $scope.prioritiesCollection;
                //create Cells
                var colLength = $(".task-board-area .row.top .cell").length;
                for (var i = 0, n = rows.length; i < n; i++) {
                    (function (id) {
                        $(".task-board-area").append('<div class="row" id="row' + $scope.removeSpacesAndBrackets(rows[i]) + '" priority="' + rows[i] + '"><div class="cell left"><span>' + rows[i] + '</span></div></div>');

                        var priority = rows[i];
                        for (var j = 0, total = colLength - 1; j < total; j++) {
                            (function (id) {

                                //$compile($("#item_" + itemCount))($scope);
                                var template = '<div class="cell connectedSortable" id="col' + $scope.removeSpacesAndBrackets(cols[j]) + '" status="' + cols[j] + '"><div class="item" ng-style="{\'border-left\': item.ItemHealth}" id="item_' + itemCount + '" ng-repeat="item in tasks | filter : { Status : \'' + cols[j] + '\'}:true | filter : { Priority : \'' + priority + '\'}:true"><span style="display:none;">{{item.Id}}</span><h5 ng-click="GenerateUrl(item.Id);" title="{{item.Title}}">{{item.Title}}</h5><h4 title="{{item.Column1}}">{{item.Column1}}</h4><span><span title="{{item.ConsultSolution}}">{{item.ConsultSolution == null ? "": item.ConsultSolution == "Solution Framework" ? "SF" : "CF"}}</span><span class="columnTwo" title="{{item.Column2}}">{{item.Column2}}</span><img title="{{item.DemoReady == true ? \'Demo Ready\':\'Demo Not Ready\'}}" class="demoReadyImg" ng-src="{{item.DemoReady == true ? \'../Images/Green.png\' :\'../Images/Red.png\'}}"></span></div></div>';
                                $(".task-board-area #row" + $scope.removeSpacesAndBrackets(rows[i])).not(".row.top").append(template);
                            }(j + 1));
                        }
                    }(i + 1));
                }

                $(".connectedSortable").sortable({
                    connectWith: ".connectedSortable",
                    placeholder: "ui-state-highlight"
                })

                $(".connectedSortable").droppable({
                    drop: function (event, ui) {
                        var status = $(this).attr("status");
                        var priority = $(this).parent().attr("priority");
                        var itemId = ui.draggable.find("span").html();
                        //console.log(itemId + ":" + status + ":" + priority);
                        var metadata = "{ '__metadata': { 'type': '" + $scope.ListItemEntityTypeFullName + "' }, Status: '" + status + "',Priority:'" + priority + "'}";
                        $scope.updateListItem(metadata, itemId);
                    }
                });
            }

            $scope.removeSpacesAndBrackets = function (param) {
                param = param.replace(/\s+/g, '');
                param = param.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                param = $.trim(param);
                return param;
            }

            $scope.updateListItem = function (metadata, itemId) {
                var executor = new SP.RequestExecutor(appweburl);
                executor.executeAsync(
                    {
                        url:
                            appweburl +
                            "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")?@target='" +
                            hostweburl + "'",
                        method: "POST",
                        body: metadata,
                        headers: {
                            "Accept": "application/json; odata=verbose",
                            "content-type": "application/json; odata=verbose",
                            "content-length": metadata.length,
                            "X-HTTP-Method": "MERGE", "IF-MATCH": "*"
                        },
                        success: function (data) {
                            //console.log("success: " + JSON.stringify(data));
                        },
                        error: function (err) {
                            console.error("error: " + JSON.stringify(err));
                        }
                    }
                );
            }

            // Function to retrieve a query string value.
            // For production purposes you may want to use
            //  a library to handle the query string.
            $scope.getQueryStringParameter = function (paramToRetrieve) {
                var params =
                    document.URL.split("?")[1].split("&");
                var strParams = "";
                for (var i = 0; i < params.length; i = i + 1) {
                    var singleParam = params[i].split("=");
                    if (singleParam[0] == paramToRetrieve)
                        return singleParam[1];
                }
            }


            // resources are in URLs in the form:
            // web_url/_layouts/15/resource

            //Get the URI decoded URLs.
            var scriptbase = hostweburl + "/_layouts/15/";
            var script1 = appweburl + "/_layouts/15/";
            var hostweburl =
                decodeURIComponent(
                    $scope.getQueryStringParameter("SPHostUrl")
                );
            var appweburl =
                decodeURIComponent(
                    $scope.getQueryStringParameter("SPAppWebUrl")
                );

            var listName =
                //decodeURIComponent(
                //    $scope.getQueryStringParameter("ListName")
                "My Tasks"
            //);

            var ViewName =
                decodeURIComponent(
                    $scope.getQueryStringParameter("ViewName")
                );

            var ItemHealth =
                //decodeURIComponent(
                //    $scope.getQueryStringParameter("ItemHealth")
                //);
                "ItemHealth"
            var ColumnOne =
                //decodeURIComponent(
                //    $scope.getQueryStringParameter("ColumnOne")
                //);
                "AssignedTo"
            var ColumnTwo =
                //decodeURIComponent(
                //    $scope.getQueryStringParameter("ColumnTwo")
                //);
                "VVersion"
            //alert(listName + " : " + ViewName);
            var DemoReady = "DemoReady"
            var ConsultSolution = "ConsultSolution"
            // Load the js files and continue to the successHandler
            setTimeout(function () {
                $.getScript(scriptbase + "SP.RequestExecutor.js", $scope.getStatus);
            }, 0);
        });
}());

