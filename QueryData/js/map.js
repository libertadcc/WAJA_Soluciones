// @formatter:off
require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",

        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/tasks/query",


        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/dom",

        "dojo/store/Memory",
        "dojo/date/locale",

        "dojo/_base/Color",
        "dojo/_base/declare",
        "dojo/_base/array",

        "dgrid/OnDemandGrid",
        "dgrid/Selection",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button"],
    function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer,
              SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
              Draw, Graphic, Query,
              ready, parser, on, dom,
              Memory, locale,
              Color, declare, array,
              Grid, Selection,
              BorderContainer, ContentPane, Button) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Initialize the dgrid
            var gridQuakes = new (declare([Grid, Selection]))({
                bufferRows: Infinity,
                columns: {
                    EQID: "ID",
                    UTC_DATETIME: {
                        "label": "Date/Time",
                        "formatter": function (dtQuake) {
                            return locale.format(new Date(dtQuake));
                        }
                    },
                    MAGNITUDE: "Mag",
                    PLACE: "Place"
                }
            }, "divGrid");

            // URL variables
            var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
            var sUrlQuakesLayer = "http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0";

            // Create the map
            var mapMain = new Map("divMap", {
                basemap: "satellite",
                center: [-119.65, 36.87],
                zoom: 4
            });

            // Construct the USA layer
            var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
                opacity: 0.5
            });
            lyrUSA.setVisibleLayers([0, 1, 3]);

            // Step: Specify the output fields

            var outFieldsLyr = ['EQID', 'MAGNITUDE', 'UTC_DATETIME', 'PLACE'];

            // Construct the Quakes layer
            var lyrQuakes = new FeatureLayer(sUrlQuakesLayer, {
                outFields: outFieldsLyr
            });
            lyrQuakes.setDefinitionExpression("magnitude >= 2.0");
            mapMain.addLayers([lyrUSA, lyrQuakes]);

            // Step: Wire the draw tool initialization function
            mapMain.on('load', initDrawTool);

            function initDrawTool() {
                // Step: Implement the Draw toolbar
                var toolbar = new Draw(mapMain);
                toolbar.activate(Draw.POLYGON);
                toolbar.on('draw-complete', displayPolygon);
            };
            

            function displayPolygon(evt) {
                console.log('evt', evt);
                // Get the geometry from the event object
                var geometryInput = evt.geometry;

                // Define symbol for finished polygon
                var tbDrawSymbol = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID, 
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_DASHDOT, 
                        new Color([255, 255, 0]), 
                        2), 
                    new Color([255, 255, 0, 0.2])
                ); 

                // Clear the map's graphics layer
                mapMain.graphics.clear();

                // Step: Construct and add the polygon graphic
                var polygon = new Graphic(geometryInput, tbDrawSymbol);
                mapMain.graphics.add(polygon);

                // Call the next function
                selectQuakes(geometryInput);
            }

            function selectQuakes(geometryInput) {
                console.log('geometryInput', geometryInput);
                // Define symbol for selected features
                var symbolSelected = new SimpleMarkerSymbol({
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "color": [0, 255, 0, 128],
                    "size": 6,
                    "outline": {
                        "color": [0, 255, 0, 214],
                        "width": 1
                    }
                });

                // Step: Initialize the query
                var query = new Query();
                query.geometry = geometryInput;
                
                // Step: Perform the selection
                lyrQuakes.selectFeatures(query);

                // Step: Set the selection symbol
                lyrQuakes.setSelectionSymbol(symbolSelected);

                // Step: Wire the layer's selection complete event
                lyrQuakes.on('selection-complete', populateGrid);
            }

            function populateGrid(results) {
                console.log('populate',results);
                var gridData;

                dataQuakes = array.map(results.features, function (feature) {
                    console.log('feature',feature)
                    return {
                        // Step: Reference the attribute field values
                        EQID: feature.attributes.EQID,
                        PLACE: feature.attributes.PLACE,
                        MAGNITUDE: feature.attributes.MAGNITUDE,
                        UTC_DATETIME: feature.attributes.UTC_DATETIME
                    }
                });
                console.log('dataQuakes', dataQuakes);
                // Pass the data to the grid
                var memStore = new Memory({
                    data: dataQuakes
                });
                gridQuakes.set("store", memStore);
            }

        });
    });
