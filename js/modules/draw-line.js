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
                //persist the points and the lines
                this.pointArray.forEach((point) => {
                    this.persistedPoints.push(point);
                })

                this.lineArray.forEach((line) => {
                    this.persistedLines.push(line);
                })

                this.pointArray = this.lineArray = [];
                console.log(this.persistedPoints, this.persistedLines);
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
    }

    addPoint(options) {
        let circle = this.makeCircle(options);
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
            radius: 10,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (options.e.layerX/this.canvas.getZoom()),
            top: (options.e.layerY/this.canvas.getZoom()),
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            lockMovementX: true,
            lockMovementY: true,
            id:id,
            objectCaching:false,
            class: 'point'
        });

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

         let line = new fabric.Line(points, {
            strokeWidth: 4,
            fill: '#000000',
            stroke: '#000000',
            class:'line',
            originX:'center',
            originY:'center',
            hasBorders: false,
            hasControls: false,
            objectCaching:false,
            lineData: {},
            id: id,
            lockMovementX: true,
            lockMovementY: true,

        });

        line.on('mousedown', (options) => {
            let selectedLine = options.target;
            selectedLine.set('stroke', '#b22ba4');
            this.displayLineInformation(selectedLine);
        });

        return line;
    }

    //this is just a method for the prototype
    displayLineInformation(line) {

        $('BODY').off('click', '#dismiss-data-'+line.id);
        $('BODY').off('click', '#add-data-'+line.id);
        $('BODY').off('click', '#delete-data-'+line.id);

        let htmlString = `
                <p><strong>Line ID:</strong> ${line.id}</p>
        `;

        if (typeof line.lineData.data != 'undefined') {
            htmlString += `
                <p><strong>Line Data:</strong> ${line.lineData.data}</p>
            `;
        }

        htmlString += `
                <p><a href="#" id="add-data-${line.id}" style="font-size: 10px;">Add Data</a></p>
        `
        if (typeof line.lineData.data != 'undefined') {
            htmlString += `
                <p><a href="#" id="clear-data-${line.id}" style="font-size: 10px;">Clear Data</a></p>
            `
        }
        htmlString += `
                <p><a href="#" id="dismiss-data-${line.id}" style="font-size: 10px;">Dismiss</a></p>
        `
        $('#information').html(htmlString);

        //set up event listeners for this line
        $('BODY').on('click', '#dismiss-data-'+line.id, () => {
            $('#information').html('');
            $('BODY').off('click', '#dismiss-data-'+line.id);
            $('BODY').off('click', '#add-data-'+line.id);
            $('BODY').off('click', '#delete-data-'+line.id);
        })

        //set up event listeners for this line
        $('BODY').on('click', '#add-data-'+line.id, () => {
            let dataToAdd = prompt('Add Data:', 'insert data here');
            line.lineData.data = dataToAdd;
            this.displayLineInformation(line);
        })

        //set up event listeners for this line
        $('BODY').on('click', '#clear-data-'+line.id, () => {

            if (confirm('Are you sure?')) {
                delete line.lineData.data;
                this.displayLineInformation(line);
            }
        })

    }

}
