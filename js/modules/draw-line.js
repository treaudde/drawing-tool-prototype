//based on example: https://codepen.io/durga598/pen/gXQjdw
import {fabric} from "FabricJS";
import $ from "jQuery";
import {canvasSelectionUtilities} from "../helpers/canvas-utilities.js";

export default class DrawLine {
    constructor(canvas, config) {
        this.drawingMode = false;
        this.canvas = canvas;
        this.lines = [];
        this.activeLine = null;
        this.max = 99999;
        this.min = 99;


        this.pointArray = new Array();
        this.lineArray = new Array();

        this.persistedPoints = new Array();
        this.persistedLines = new Array();

        //set up pan control
        $('#' + config.drawingControl).click(() => {
            this.drawingMode = !this.drawingMode;
            this.canvas.selection = !this.drawingMode;
            (this.drawingMode == true) ? $('#drawing-status').html('(On)') :
                $('#drawing-status').html('(Off)');

            (this.drawingMode == true) ? canvasSelectionUtilities.disableObjectSelection(this.canvas)
                : canvasSelectionUtilities.enableObjectSelection(this.canvas);

            if(this.drawingMode == false) {//remove the active line
                this.canvas.remove(this.activeLine);
                this.pointArray = this.lineArray = [];
            }
        })

        this.canvas.on('mouse:down', (options) => {
            if(this.drawingMode) {
                // if(options.target
                //     && this.pointArray.length > 0
                //     && options.target.id == this.pointArray[0].id
                //     && options.target.class == 'point'){
                //     this.completeDrawing(options);
                // }
                // else {
                    this.addPoint(options);
                // }
            }
        })

        this.canvas.on('mouse:move', (options) => {
            if (this.drawingMode && this.activeLine && this.activeLine.class == "line") {
                let pointer = this.canvas.getPointer(options.e);
                this.activeLine.set({ x2: pointer.x, y2: pointer.y });
                this.canvas.renderAll();
            }
        })

        // this.canvas.on('mouse:up', (e) => {
        //     if (this.drawingMode) {
        //
        //     }
        // })
    }

    addPoint(options) {
        let circle = this.makeCircle(options);
        if(this.pointArray.length == 0){
            circle.set({
                fill:'red'
            })
        }

        let line = this.makeLine(options);

        this.activeLine = line;

        this.pointArray.push(circle);
        this.lineArray.push(line);

        this.canvas.add(line);
        this.canvas.add(circle);
    }

    //can be used for snapping functionality
    // completeDrawing(options) {
    //     let circleCenterPoint = options.target.getCenterPoint();
    //     this.activeLine.set({
    //         x2: circleCenterPoint.x,
    //         y2: circleCenterPoint.y
    //     });
    //     this.lineArray.push(this.activeLine);
    //
    //     this.canvas.renderAll();
    //     this.remove
    //
    //     this.pointArray.forEach((point) => {
    //         this.persistedPoints.push(point);
    //     });
    //
    //     this.lineArray.forEach((line) => {
    //         this.persistedLines.push(line);
    //     });
    //
    //     //clear for the next image
    //     this.pointArray = [];
    //     this.lineArray = [];
    //
    //     console.log(this.persistedPoints);
    //     console.log(this.persistedLines);
    // }

    makeCircle(options) {
        let random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        let id = new Date().getTime() + random;
        let circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (options.e.layerX/this.canvas.getZoom()),
            top: (options.e.layerY/this.canvas.getZoom()),
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id,
            objectCaching:false,
            class: 'point'
        });

        circle.on('selected', this.determineConnectedLines);
        return circle;
    }

    makeLine(options) {
        let random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        let id = new Date().getTime() + random;

        let points = [
            (options.e.layerX/this.canvas.getZoom()),
            (options.e.layerY/this.canvas.getZoom()),
            (options.e.layerX/this.canvas.getZoom()),
            (options.e.layerY/this.canvas.getZoom())
        ];

         return new fabric.Line(points, {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            class:'line',
            originX:'center',
            originY:'center',
            hasBorders: false,
            hasControls: false,
            objectCaching:false,
            id: id
        });
    }

    determineConnectedLines(options){
        console.log(options);
    }
}
