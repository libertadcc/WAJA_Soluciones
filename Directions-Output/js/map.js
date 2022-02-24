var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/dijit/Directions",

        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Directions,
              parser, ready,
              BorderContainer, ContentPane) {
        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });

            //Step: Add the Directions widget
            var dijitDirections = new Directions(
                {
                    map: mapMain,
                    routeTaskUrl: "http://utility.arcgis.com/usrsvcs/appservices/OM1GNiiACNJceMRn/rest/services/World/Route/NAServer/Route_World"
                }, 
                "divDirections"
            );
            dijitDirections.startup();


            // dijitDirections.setDirectionsLanguage("es")

        });
    });
