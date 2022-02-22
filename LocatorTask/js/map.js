var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/graphic",
       
        "esri/tasks/locator",

        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Graphic, Locator,
              SimpleMarkerSymbol, TextSymbol, Font,
              Color, array,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            var taskLocator;

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });

            /*
             * Step: Construct and bind the Locator task
             */
            taskLocator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            /*
             * Step: Wire the button's onclick event handler
             */
            on(dom.byId("btnLocate"), "click", doAddressToLocations);

            /*
             * Step: Wire the task's completion event handler
             */
            taskLocator.on("address-to-locations-complete", showResults);

            function doAddressToLocations() {
                mapMain.graphics.clear();

                /*
                 * Step: Complete the Locator input parameters
                 */
                var objAddress = {
                    "SingleLine": dom.byId("taAddress").value
                }
                var params = {
                    address: objAddress,
                    outFields: ["Loc_name"]
                }
                console.log('params', params)
                /*
                 * Step: Execute the task
                 */
                taskLocator.addressToLocations(params);

            }

            function showResults(candidates) {
                // Define the symbology used to display the results
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

                // loop through the array of AddressCandidate objects
                var geometryLocation;
                array.every(candidates.addresses, function (candidate) {

                    // if the candidate was a good match
                    if (candidate.score > 80) {

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                            locatorName: candidate.attributes.Loc_name
                        };

                        /*
                         * Step: Retrieve the result's geometry
                         */
                        geometryLocation = candidate.location;

                        /*
                         * Step: Display the geocoded location on the map
                         */
                        var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
                        mapMain.graphics.add(graphicResult);

                        // display the candidate's address as text
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        textSymbol.setOffset(0, -22);
                        mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

                        // exit the loop after displaying the first good match
                        return false;
                    }
                });

                // Center and zoom the map on the result
                if (geometryLocation !== undefined) {
                    mapMain.centerAndZoom(geometryLocation, 15);
                }
            }

        });

    });