var mapMain;
var widgetEditor;

// @formatter:off
require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService",
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/config",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, FeatureLayer, GeometryService, Editor, TemplatePicker, config,
              ready, parser, on, array,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-116.64, 34.37],
                zoom: 10
            });

            var flFirePoints, flFireLines, flFirePolygons;
            // Step: Construct the editable layers
            flFirePoints = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0", {
                outFields: ['*']
            });
            flFireLines = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1", {
                outFields: ['*']
            });
            flFirePolygons = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2", {
                outFields: ['*']
            });

            // Listen for the editable layers to finish loading
            mapMain.on("layers-add-result", initEditor);

            // add the editable layers to the map
            mapMain.addLayers([flFirePolygons, flFireLines, flFirePoints]);

            function initEditor(results) {

                // Map the event results into an array of layerInfo objects
                var layerInfosWildfire = array.map(results.layers, function (result) {
                    return {
                        featureLayer: result.layer
                    };
                });

                // Step: Map the event results into an array of Layer objects
                var layersWildfire = array.map(results.layers, function (result) {
                    return result.layer;
                });
                console.log('layersWildfire', layersWildfire);
                console.log('layerInfosWildfire', layerInfosWildfire);

                // Step: Add a custom TemplatePicker widget

                var tpCustom = new TemplatePicker({
                    featureLayers: layersWildfire,
                    columns: 2
                }, "divLeft");
                tpCustom.startup();
                // Step: Prepare the Editor widget settings
                var editorSettings = {
                    map: mapMain,
                    geometryService: new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
                    layerInfos: layerInfosWildfire,
                    toolbarVisible: true,
                    templatePicker: tpCustom,
                    createOptions: {
                        polygonDrawTools: [
                            Editor.CREATE_TOOL_FREEHAND_POLYGON, 
                            Editor.CREATE_TOOL_RECTANGLE, 
                            Editor.CREATE_TOOL_TRIANGLE, 
                            // Editor.CREATE_TOOL_CIRCLE
                        ]
                    },
                    toolbarOptions: {
                        reshapeVisible: true
                    },
                    enableUndoRedo: true,
                    maxUndoRedoOperations: 20
                };
                // Step: Build the Editor constructor's first parameter
                var editorParams = {
                    settings: editorSettings
                };
                // Step: Construct the Editor widget
                widgetEditor = new Editor(editorParams, "divTop");
                widgetEditor.startup();

            };

        });
    });
