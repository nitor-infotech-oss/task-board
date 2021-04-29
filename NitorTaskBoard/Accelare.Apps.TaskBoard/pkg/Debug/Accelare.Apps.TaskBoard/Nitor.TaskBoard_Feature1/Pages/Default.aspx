<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
<%--    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>--%>
    <script src="../Scripts/jquery-3.4.1.min.js"></script>
    <script src="../Scripts/jquery-ui-1.12.1.min.js"></script>
    <script src="../Scripts/jquery-ui.js"></script>
    <script src="../Scripts/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="../Scripts/angular.min.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
      <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
         <link rel="Stylesheet" type="text/css" href="../Content/Style.css" />   
    <link rel="stylesheet" href="../Content/Fonts/font-awesome.min.css">

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Task Board
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

     <div class="container-fluid no-padding" >
        <div class="header-wrapper">
        </div>

        <div class="content-wrapper" ng-app="MyApp" ng-controller="MyController">
          <%--  <div>
                <span id="spanPageTitle" ng-click="RedirectToList();"></span>
                <i id="imgRefresh" ng-click="getListItems();" title="Refresh" class="fa fa-refresh" aria-hidden="true"></i>  
            </div>--%>

            <div class="taskboard-container-main">
                <div class="parent-wrapper">
                    <div class="title top">Stage in Framework</div>
                    <div class="title left">Framework Name</div>
                    <div class="task-board-area">
                    </div>
                </div>
            </div>
        </div>
        <!--  End content-wrapper -->
    </div>
</asp:Content>
