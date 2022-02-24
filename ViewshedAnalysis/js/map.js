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

    "esri/tasks/Geoprocessor",
    "esri/tasks/FeatureSet",
    "esri/tasks/LinearUnit",

    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/array"],
    function (Map, Draw, Graphic, graphicsUtils, 
        
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color,

        Geoprocessor, FeatureSet,LinearUnit,
        
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
            var gp = new Geoprocessor('http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed');

            
            mapMain.on("load", function () {
                // Step: Set the spatial reference for output geometries
                // console.log('mapMain', mapMain);
                gp.outSpatialReference = mapMain.spatialReference;
            });

            // Collect the input observation point
            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-end", calculateViewshed);
            tbDraw.activate(Draw.POINT);

            function calculateViewshed(evt) {
                // console.log('calculateViewshed', evt);
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
                // Input_Observation_Point: featureSet
                var inputPoint = new FeatureSet();
                // console.log('inputPoint', inputPoint);
                inputPoint.features.push(graphicViewpoint);
                // console.log('inputPoint2', inputPoint);

                // Step: Prepare the second input parameter
                // Viewshed_Distance distance units
                var vwDist = new LinearUnit();
                vwDist.distance = 5;
                vwDist.units = 'esriMiles';

                // Step: Build the input parameters into a JSON-formatted object
                var params = {
                    'Input_Observation_Point': inputPoint,
                    'Viewshed_Distance': vwDist
                };
                console.log('params', params);

                // Step: Wire and execute the Geoprocessor
                gp.execute(params);
                gp.on("execute-complete", displayViewshed);


            }

            function displayViewshed(results, messages) {
                console.log('displayViewshed', results)
                // polygon symbol for drawing results
                var sfsResultPolygon = new SimpleFillSymbol();
                sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
                sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

                // Step: Extract the array of features from the results
                var arrayFeatures = results.results[0].value.features;


                // loop through results
                array.forEach(arrayFeatures, function (feature) {
                    // Step: Symbolize and add each graphic to the map's graphics layer
                    console.log('feature', feature);

                    var viewshedPolygon = new Graphic(feature.geometry, sfsResultPolygon);
                    mapMain.graphics.add(viewshedPolygon);


                });

                // update the map extent
                var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);
                mapMain.setExtent(extentViewshed, true);
            }

        });
    });
