import {fabric} from "FabricJS";
import $ from "jQuery";

export default class DrawLine {
    constructor(canvas, config) {
        this.drawingMode = false;
        this.canvas = canvas;

        //set up pan control
        $('#' + config.drawingControl).click(() => {
            this.drawingMode = !this.drawingMode;
            this.canvas.selection = !this.drawingMode;
            (this.drawingMode == true) ? $('#drawing-status').html('(On)') :
                $('#drawing-status').html('(Off)')
        })
    }

    drawPoint() {

    }

    drawLine() {
        //add a line
        let polylinePoints = [
            new fabric.Point(50, 10),
            new fabric.Point(500, 10),
            new fabric.Point(500, 500),
            new fabric.Point(50, 500),
            new fabric.Point(50, 10)
        ];


        let line = new fabric.Polyline(polylinePoints, {
            stroke: true,
            strokeWidth: 5,
            color:'black',
            fill: 'transparent',
            class: 'polyline'
        })

        polylinePoints.forEach((point) => {
            this.canvas.add(new fabric.Circle({
                radius: 7,
                fill: '#f3f702',
                strokeWidth: 1,
                left: (point.x / this.canvas.getZoom()),
                top: (point.y / this.canvas.getZoom()),
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX:'center',
                originY:'center',
                class: 'circle'
            }));
        })

        this.canvas.add(line);
    }

}
//
// var canvas = new fabric.Canvas('canvas');
// var polygonCount = 1;
// var startDrawingPolygon;
// var ArrayLength;
// var addTexture = false;
// var circleCount = 1;
// var fillColor = "rgba(46, 240, 56, 0.5)";
//
// function done() {
//     startDrawingPolygon = false;
//     ArrayLength = circleCount;
//     circleCount = 1;
//     var tempCount = 0;
//     var objects = canvas.getObjects();
//     var points = [];
//     for (var i = 0; objects.length > i; i++) {
//         if (objects[i].polygonNo === polygonCount) {
//             points.push({
//                 x: objects[i].left,
//                 y: objects[i].top
//             });
//             canvas.renderAll();
//         }
//     }
//     console.log(points)
//     window["polygon" + polygonCount] = new fabric.Polygon(points, {
//         fill: fillColor,
//         PolygonNumber: polygonCount,
//         name: "Polygon",
//         selectable: false,
//         noofcircles: ArrayLength,
//         objectCaching: false
//     });
//     canvas.add(window["polygon" + polygonCount]);
//     canvas.sendToBack(window["polygon" + polygonCount])
//     canvas.renderAll();
//     polygonCount++;
// }
//
// function Addpolygon() {
//     startDrawingPolygon = true;
// }
//
// canvas.on('object:moving', function(option) {
//     var object = option.target;
//     canvas.forEachObject(function(obj) {
//         if (obj.name == "Polygon") {
//             if (obj.PolygonNumber == object.polygonNo) {
//                 var points = window["polygon" + object.polygonNo].get("points");
//                 points[object.circleNo - 1].x = object.left;
//                 points[object.circleNo - 1].y = object.top;
//                 window["polygon" + object.polygonNo].set({
//                     points: points
//                 });
//             }
//         }
//     })
//     canvas.renderAll();
// });
//
// canvas.on('mouse:down', function(option) {
//     if (option.target && option.target.name == "draggableCircle") {
//         return;
//     } else {
//         if (addTexture) {
//             console.log(option);
//         }
//         if (startDrawingPolygon) {
//             var pointer = canvas.getPointer(option.e);
//             circle = new fabric.Circle({
//                 left: pointer.x,
//                 top: pointer.y,
//                 radius: 7,
//                 hasBorders: false,
//                 hasControls: false,
//                 polygonNo: polygonCount,
//                 name: "draggableCircle",
//                 circleNo: circleCount,
//                 fill: "rgba(0, 0, 0, 0.5)",
//                 hasRotatingPoint: false,
//                 originX: 'center',
//                 originY: 'center'
//             });
//             canvas.add(circle);
//             circleCount++;
//         }
//     }
// });
//
//
// var min = 99;
// var max = 999999;
// var polygonMode = true;
// var pointArray = new Array();
// var lineArray = new Array();
// var activeLine;
// var activeShape = false;
// var canvas
// $(window).load(function(){
//     prototypefabric.initCanvas();
//     $('#create-polygon').click(function() {
//         prototypefabric.polygon.drawPolygon();
//     });
// });
// var prototypefabric = new function () {
//     this.initCanvas = function () {
//         canvas = window._canvas = new fabric.Canvas('c');
//         canvas.setWidth($(window).width());
//         canvas.setHeight($(window).height()-$('#nav-bar').height());
//         //canvas.selection = false;
//
//         canvas.on('mouse:down', function (options) {
//             if(options.target && options.target.id == pointArray[0].id){
//                 prototypefabric.polygon.generatePolygon(pointArray);
//             }
//             if(polygonMode){
//                 prototypefabric.polygon.addPoint(options);
//             }
//         });
//         canvas.on('mouse:up', function (options) {
//
//         });
//         canvas.on('mouse:move', function (options) {
//             if(activeLine && activeLine.class == "line"){
//                 var pointer = canvas.getPointer(options.e);
//                 activeLine.set({ x2: pointer.x, y2: pointer.y });
//
//                 var points = activeShape.get("points");
//                 points[pointArray.length] = {
//                     x:pointer.x,
//                     y:pointer.y
//                 }
//                 activeShape.set({
//                     points: points
//                 });
//                 canvas.renderAll();
//             }
//             canvas.renderAll();
//         });
//     };
// };
//
//
//
// prototypefabric.polygon = {
//     drawPolygon : function() {
//         polygonMode = true;
//         pointArray = new Array();
//         lineArray = new Array();
//         activeLine;
//     },
//     addPoint : function(options) {
//         var random = Math.floor(Math.random() * (max - min + 1)) + min;
//         var id = new Date().getTime() + random;
//         var circle = new fabric.Circle({
//             radius: 5,
//             fill: '#ffffff',
//             stroke: '#333333',
//             strokeWidth: 0.5,
//             left: (options.e.layerX/canvas.getZoom()),
//             top: (options.e.layerY/canvas.getZoom()),
//             selectable: false,
//             hasBorders: false,
//             hasControls: false,
//             originX:'center',
//             originY:'center',
//             id:id,
//             objectCaching:false
//         });
//         if(pointArray.length == 0){
//             circle.set({
//                 fill:'red'
//             })
//         }
//         var points = [(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom()),(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom())];
//         line = new fabric.Line(points, {
//             strokeWidth: 2,
//             fill: '#999999',
//             stroke: '#999999',
//             class:'line',
//             originX:'center',
//             originY:'center',
//             selectable: false,
//             hasBorders: false,
//             hasControls: false,
//             evented: false,
//             objectCaching:false
//         });
//         if(activeShape){
//             var pos = canvas.getPointer(options.e);
//             var points = activeShape.get("points");
//             points.push({
//                 x: pos.x,
//                 y: pos.y
//             });
//             var polygon = new fabric.Polygon(points,{
//                 stroke:'#333333',
//                 strokeWidth:1,
//                 fill: '#cccccc',
//                 opacity: 0.3,
//                 selectable: false,
//                 hasBorders: false,
//                 hasControls: false,
//                 evented: false,
//                 objectCaching:false
//             });
//             canvas.remove(activeShape);
//             canvas.add(polygon);
//             activeShape = polygon;
//             canvas.renderAll();
//         }
//         else{
//             var polyPoint = [{x:(options.e.layerX/canvas.getZoom()),y:(options.e.layerY/canvas.getZoom())}];
//             var polygon = new fabric.Polygon(polyPoint,{
//                 stroke:'#333333',
//                 strokeWidth:1,
//                 fill: '#cccccc',
//                 opacity: 0.3,
//                 selectable: false,
//                 hasBorders: false,
//                 hasControls: false,
//                 evented: false,
//                 objectCaching:false
//             });
//             activeShape = polygon;
//             canvas.add(polygon);
//         }
//         activeLine = line;
//
//         pointArray.push(circle);
//         lineArray.push(line);
//
//         canvas.add(line);
//         canvas.add(circle);
//         canvas.selection = false;
//     },
//     generatePolygon : function(pointArray){
//         var points = new Array();
//         $.each(pointArray,function(index,point){
//             points.push({
//                 x:point.left,
//                 y:point.top
//             });
//             canvas.remove(point);
//         });
//         $.each(lineArray,function(index,line){
//             canvas.remove(line);
//         });
//         canvas.remove(activeShape).remove(activeLine);
//         var polygon = new fabric.Polygon(points,{
//             stroke:'#333333',
//             strokeWidth:0.5,
//             fill: 'red',
//             opacity: 1,
//             hasBorders: false,
//             hasControls: false
//         });
//         canvas.add(polygon);
//
//         activeLine = null;
//         activeShape = null;
//         polygonMode = false;
//         canvas.selection = true;
//     }
// };
