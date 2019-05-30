import {fabric} from "FabricJS";
import $ from "jQuery";

export default class DrawLine {
    constructor(canvas, config) {
        this.drawingMode = false;
        this.canvas = canvas;
        this.lines = [];
        this.activeLine = null;
        this.drawingLine = false;

        //set up pan control
        $('#' + config.drawingControl).click(() => {
            this.drawingMode = !this.drawingMode;
            this.canvas.selection = !this.drawingMode;
            (this.drawingMode == true) ? $('#drawing-status').html('(On)') :
                $('#drawing-status').html('(Off)');

            (this.drawingMode == true) ? this.disableObjectSelection() : this.enableObjectSelection();
        })

        this.canvas.on('mouse:down', (e) => {
            if (this.drawingMode) {
                let pointer = this.canvas.getPointer(e);
                this.activeLine  = this.startLine(pointer);
            }
        })

        this.canvas.on('mouse:move', (e) => {
            if (this.drawingMode && this.drawingLine) {
                let pointer = this.canvas.getPointer(e);
                this.drawLine(pointer);
            }
        })

        // this.canvas.on('mouse:up', (e) => {
        //     if (this.drawingMode) {
        //
        //     }
        // })
    }

    startLine(pointer) {
        this.drawingLine = true;
        let point = new fabric.Circle({
            radius: 5,
            fill: '#ff0000',
            strokeWidth: 1,
            left: (pointer.x / this.canvas.getZoom()),
            top: (pointer.y / this.canvas.getZoom()),
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            class: 'point'
        });

        let initialPoint  = new fabric.Point(pointer.x, pointer.y);

        let line = new fabric.Polyline([initialPoint, initialPoint], {
            strokeWidth: 2,
            fill: '#000000',
            stroke: '#000000',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            objectCaching:false
        });

        this.canvas.add(line);
        this.canvas.add(point);

        this.activeLine = line;
        console.log(this.activeLine);
    }

    drawLine(pointer) {
        //console.log(this.activeLine);
       let points =  this.activeLine.get('points');
       let currentPoint = new fabric.Point(pointer.x, pointer.y);
       this.activeLine.set('points', [points[0], currentPoint]);
       this.canvas.renderAll();
    }

    endLine(pointer) {
        this.drawingLine  = false;
    }

    /**
     * Since we are moving the canvas we don't want individual elements moving
     */
    disableObjectSelection() {
        this.canvas.getObjects().forEach((element) => {
            if(element.class != 'loadaed-image') {
                element.set('selectable', false);
            }
        })
    }

    enableObjectSelection() {
        this.canvas.getObjects().forEach((element) => {
            if(element.class != 'loadaed-image') {
                element.set('selectable', true);
            }
        })
    }
}

//add a line
// let polylinePoints = [
//     new fabric.Point(50, 10),
//     new fabric.Point(500, 10),
//     new fabric.Point(500, 500),
//     new fabric.Point(50, 500),
//     new fabric.Point(50, 10)
// ];
//
//
// let line = new fabric.Polyline(polylinePoints, {
//     stroke: true,
//     strokeWidth: 5,
//     color:'black',
//     fill: 'transparent',
//     class: 'polyline'
// })
//
// polylinePoints.forEach((point) => {
//     this.canvas.add(new fabric.Circle({
//         radius: 7,
//         fill: '#f3f702',
//         strokeWidth: 1,
//         left: (point.x / this.canvas.getZoom()),
//         top: (point.y / this.canvas.getZoom()),
//         selectable: false,
//         hasBorders: false,
//         hasControls: false,
//         originX:'center',
//         originY:'center',
//         class: 'circle'
//     }));
// })
//
// this.canvas.add(line);
// console.log(line);