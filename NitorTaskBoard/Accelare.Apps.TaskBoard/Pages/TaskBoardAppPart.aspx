<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.ddslick.min.js"></script>
    <script type="text/javascript" src="../Scripts/html5shiv.min.js"></script>
    <script type="text/javascript" src="../Scripts/respond.min.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular.min.js"></script>
     <script type="text/javascript" src="../Scripts/App.js"></script>


    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
     <link rel="Stylesheet" type="text/css" href="../Content/Style.css" />   
    <link rel="stylesheet" href="../Content/Fonts/font-awesome.min.css">
   

</head>
<body
    <div class="container-fluid no-padding" >
        <div class="header-wrapper">
        </div>

        <div class="content-wrapper" ng-app="MyApp" ng-controller="MyController">
            <div>
                <span id="spanPageTitle" ng-click="RedirectToList();"></span>
                <i id="imgRefresh" ng-click="getListItems();" title="Refresh" class="fa fa-refresh" aria-hidden="true"></i>  
            </div>

            <div class="taskboard-container-main">
                <div class="parent-wrapper">
                    <div class="title top">Task Status</div>
                    <div class="title left">Priority</div>
                    <div class="task-board-area">
                    </div>
                </div>
            </div>
        </div>
        <!--  End content-wrapper -->
    </div>
</body>
</html>
