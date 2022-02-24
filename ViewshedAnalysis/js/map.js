var mapMain;

require([
    "esri/map",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/graphicsUtils",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",

    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/array"],
    function (Map, Draw, Graphic, graphicsUtils, 
        
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color,
        
        ready, parser, on, array) {

        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 12
            });

            // Step: Construct the Geoprocessor



            mapMain.on("load", function () {
                // Step: Set the spatial reference for output geometries
    


            });

            // Collect the input observation point
            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-end", calculateViewshed);
            tbDraw.activate(Draw.POINT);

            function calculateViewshed(evt) {

                // clear the graphics layer
                mapMain.graphics.clear();

                // marker symbol for drawing viewpoint
                var smsViewpoint = new SimpleMarkerSymbol();
                smsViewpoint.setSize(12);
                smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
                smsViewpoint.setColor(new Color([0, 0, 0]));

                // add viewpoint to the map
                var graphicViewpoint = new Graphic(evt.geometry, smsViewpoint);
                mapMain.graphics.add(graphicViewpoint);

                // Step: Prepare the first input parameter



                // Step: Prepare the second input parameter



                // Step: Build the input parameters into a JSON-formatted object



                // Step: Wire and execute the Geoprocessor



            }

            function displayViewshed(results, messages) {

                // polygon symbol for drawing results
                var sfsResultPolygon = new SimpleFillSymbol();
                sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
                sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

                // Step: Extract the array of features from the results



                // loop through results
                array.forEach(arrayFeatures, function (feature) {
                    // Step: Symbolize and add each graphic to the map's graphics layer
    


                });

                // update the map extent
                var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);
                mapMain.setExtent(extentViewshed, true);
            }

        });
    });
