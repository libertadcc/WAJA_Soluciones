// @formatter:off
require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",


    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",

    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/SimpleRenderer",
    "esri/layers/LayerDrawingOptions",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/dom",


        "dojo/_base/declare",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button"],
    function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer,
        SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color,
        ClassBreaksRenderer,SimpleRenderer, LayerDrawingOptions,
              ready, parser, on, dom,
              declare, array,
              BorderContainer, ContentPane, Button) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // URL variables
            var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
            var sUrlQuakesLayer = "http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0";


            // Create the map
            var mapMain = new Map("divMap", {
                basemap: "satellite",
                center: [-119.65, 36.87],
                zoom: 4
            });
           

            // Construct and wire a button to apply the renderer
            mapMain.on('layers-add-result', changeQuakesRenderer);


            // Construct the USA layer
            var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
                opacity: 0.5
            });
            lyrUSA.setVisibleLayers([0, 1, 3]);

            // Construct the Quakes layer
            var outFieldsQuakes = ["EQID", "UTC_DATETIME", "MAGNITUDE", "PLACE"];

            var lyrQuakes = new FeatureLayer(sUrlQuakesLayer, {
                outFields: outFieldsQuakes
            });

            lyrQuakes.setDefinitionExpression("MAGNITUDE >= 2.0");

            mapMain.addLayers([lyrUSA, lyrQuakes]);

            function changeQuakesRenderer() {
                console.log('changeQuakes')

                // construct a  symbol for earthquake features
                var quakeSymbol = new SimpleMarkerSymbol();
                quakeSymbol.setColor(new Color([255, 0, 0, 0.5]));
                quakeSymbol.setOutline(null);


                //Step: Construct and apply a simple renderer for earthquake features
                var rendererS = new SimpleRenderer(quakeSymbol);

                // Step: Construct symbol size info parameters for the quake renderer

                lyrQuakes.setRenderer(rendererS);


                // Step: Apply symbol size info to the quake renderer
                rendererS.setVisualVariables([{
                    type: "sizeInfo",
                    field: "MAGNITUDE",
                    minSize: 1,
                    maxSize: 50,
                    minDataValue: 0,
                    maxDataValue: 9
                }]);
            }
            // Evento click botón 
            on(dom.byId('progButtonNode'), 'click', changeCountiesRenderer);

            // Función que cambia el renderer de los condados
            function changeCountiesRenderer() {
                console.log('changeCountiesRenderer')
                // Simbología por defecto
                var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 0]));

                // Step: Construct a class breaks renderer
                 var cbrCountyPopDensity = new ClassBreaksRenderer(symDefault, 'pop00_sqmi');

                //Step: Define the class breaks
                cbrCountyPopDensity.addBreak({
                    minValue: 0,
                    maxValue: 10,
                    symbol: new SimpleFillSymbol().setColor(new Color([254, 240, 217]))
                });
                cbrCountyPopDensity.addBreak({
                    minValue: 10,
                    maxValue: 100,
                    symbol: new SimpleFillSymbol().setColor(new Color([253, 204, 138]))
                });
                cbrCountyPopDensity.addBreak({
                    minValue: 100,
                    maxValue: 1000,
                    symbol: new SimpleFillSymbol().setColor(new Color([252, 141, 89]))
                });
                cbrCountyPopDensity.addBreak({
                    minValue: 1000,
                    maxValue: 10000,
                    symbol: new SimpleFillSymbol().setColor(new Color([227, 74, 51]))
                });
                cbrCountyPopDensity.addBreak({
                    minValue: 10000,
                    maxValue: 100000,
                    symbol: new SimpleFillSymbol().setColor(new Color([179, 0, 0]))
                });

                // Step: Apply the renderer to the Counties layer
                var arrayStyle = [];
                var drawing = new LayerDrawingOptions();
                drawing.renderer = cbrCountyPopDensity;

                arrayStyle[3] = drawing;
                // lyrUSA = MapServer 
                lyrUSA.setLayerDrawingOptions(arrayStyle);

            }


        });
    });
