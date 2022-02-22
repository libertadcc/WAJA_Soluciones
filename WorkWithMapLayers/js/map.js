var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend",
        "esri/dijit/BasemapToggle",
        "dojo/ready",
        "dojo/parser",
        "dojo/on",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, Legend,BasemapToggle,
              ready, parser, on, 
              BorderContainer, ContentPane) {

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            var extentInitial = new Extent({
                "xmin": -14462706.515378611,
                "ymin": 3626924.807223475,
                "xmax": -12496134.65165812,
                "ymax": 5471197.425687718,
                "spatialReference": {
                    "wkid": 102100
                }
            });

            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "satellite",
                extent: extentInitial
            });

            /*
             * Step: Add the USA map service to the map
             */
            var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity: 0.5
            });

            lyrUSA.setVisibleLayers([0, 2,3]);

            //mapMain.addLayer(lyrUSA);

            // Step: Add the earthquakes layer to the map

            var lyrQuakes = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
            //mapMain.addLayer(lyrQuakes);
            lyrQuakes.setDefinitionExpression("MAGNITUDE >= 2")
            //Step: Revise code to use the addLayers() method
            mapMain.addLayers([lyrUSA, lyrQuakes]);

            var toggle = new BasemapToggle({
                map: mapMain
            }, 'BasemapToggle');

            toggle.startup();
            

        });
    });
