var mapMain;

// @formatter:off
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Legend",
    "esri/dijit/OverviewMap",
    "dojo/ready",
    "dojo/parser",
    "dojo/on",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"],
    function (Map, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapToggle, Legend, OverviewMap,
        ready, parser, on,
        BorderContainer, ContentPane) {
        // @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            extentInitial = new Extent(
                {
                    "xmin": -14385844.055243533,
                    "ymin": 3797385.5935797184,
                    "xmax": -13886863.134598035,
                    "ymax": 5309004.264946962,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                }
            );

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
            //mapMain.addLayer(lyrUSA);

            /*
             * Step: Add the earthquakes layer to the map
             */
            var lyrQuakes = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
            lyrQuakes.setDefinitionExpression("MAGNITUDE >= 2.0");

            /*
            * Step: Revise code to use the addLayers() method
            */
            mapMain.addLayers([lyrUSA]);

            /*
             * Step: Add the BaseMapToggle widget to the map
             */
            var toggle = new BasemapToggle({
                map: mapMain,
                // basemap: "topo"
            }, "BasemapToggle");
            toggle.startup();


            var overviewMapDijit = new OverviewMap({
                map: mapMain,
                visible: true,
                attachTo: 'bottom-right'
            });
            overviewMapDijit.startup();


            /*
             * Step: Add a legend once all layers have been added to the map
             */
            mapMain.on("layers-add-result", function () {
                var dijitLegend = new Legend({
                    map: mapMain,
                    arrangement: Legend.ALIGN_RIGHT,
                    layerInfos: [{
                        layer: lyrQuakes,
                        title: 'Titulo terremotos'
                    }, {
                        layer: lyrUSA,
                        title: "EEUU"
                    }]
                }, "divLegend");
                dijitLegend.startup();
            });

        });
    });
