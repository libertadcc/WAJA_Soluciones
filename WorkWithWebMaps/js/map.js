var mapMain;
var legendLayers;
var webmapId = "7d987ba67f4640f0869acb82ba064228";

require([
    "dojo/dom",
    "esri/arcgis/utils",
    "esri/dijit/Legend","esri/dijit/BasemapGallery",
    "dojo/ready",
    "dojo/parser"],
    function (dom, arcgisUtils, Legend,BasemapGallery,
        ready, parser) {
        ready(function () {
            parser.parse();
            arcgisUtils.createMap('7d987ba67f4640f0869acb82ba064228', 'cpCenter')
                .then(function (response) {
                    console.log(response);
                    let capasLeyenda = arcgisUtils.getLegendLayers(response);
                    console.log('capasLeyenda', capasLeyenda);
                    var leyendaWidget = new Legend({
                        map: response.map,
                        layerInfos: capasLeyenda
                    }, 'divLegend');
                    leyendaWidget.startup();

                    let titleMap = response.itemInfo.item.title;
                    dom.byId('title').innerHTML = titleMap;

                    var basemapGallery = new BasemapGallery({
                        showArcGISBasemaps: true,
                        map: response.map
                    }, "basemapGallery");
                    basemapGallery.startup();
                });
        });
    });
