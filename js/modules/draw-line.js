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

            if(this.drawingMode == false) { //process the canvas
                this.processDrawing();
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

    processDrawing() {
        this.canvas.remove(this.activeLine);
        //persist the points and the lines
        this.pointArray.forEach((point) => {
            this.persistedPoints.push(point);
        })

        this.lineArray.forEach((line) => {
            if(line.id != this.activeLine.id) {
                this.persistedLines.push(line);
            }
        })

        //calculate point line intersections for moving points
        this.persistedPoints.forEach((point) => {
            //get the center point of the circle as it corresponds to one end a line
            let centerPoint = point.getCenterPoint();
            for (let x = 0; x<this.persistedLines.length; x++) {
                let line = this.persistedLines[x];

                if(line.id === this.activeLine.id) {
                    console.log('yes active line');
                    delete this.persistedLines[x];
                    continue;
                }
                if (line.x1 == centerPoint.x && line.y1 == centerPoint.y) {
                    console.log('yes line 1');
                    point.set('lineX1Y1', line);
                }

                if (line.x2 == centerPoint.x && line.y2 == centerPoint.y) {
                    console.log('yes line 2');
                    point.set('lineX2Y2', line);
                }
            }
        });

        this.pointArray = this.lineArray = [];
        this.activeLine = null;
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
            radius: 20,
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
            class: 'point',
            lineX1Y1: null,
            lineX2Y2: null,
        });

        circle.on('mousedown',(options) => {
            let selectedCircle = options.target;
            this.displayCircleInformation(selectedCircle);
        })

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
            strokeWidth: 8,
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
            this.displayLineInformation(selectedLine);
        });

        return line;
    }

    //this is just a method for the prototype
    displayLineInformation(line) {

        console.log(line);
        $('BODY').off('click', '#dismiss-data-'+line.id);
        $('BODY').off('click', '#add-data-'+line.id);
        $('BODY').off('click', '#delete-data-'+line.id);

        let htmlString = `
                <p><strong>Line ID:</strong> ${line.id}</p>
                <p><strong>Coords:</strong> (${line.x1}, ${line.y1}) (${line.x2}, ${line.y2})</p>
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

    displayCircleInformation(circle) {
        console.log(circle);
        $('BODY').off('click', '#dismiss-data-'+circle.id);

        let htmlString = `
                <p><strong>Circle ID:</strong> ${circle.id}</p>
                <p><strong>Coords:</strong> (${circle.getCenterPoint().x}, ${circle.getCenterPoint().y})</p>
        `;

        htmlString += `
                <p><a href="#" id="dismiss-data-${circle.id}" style="font-size: 10px;">Dismiss</a></p>
        `
        $('#information').html(htmlString);

        //set up event listeners for this line
        $('BODY').on('click', '#dismiss-data-'+circle.id, () => {
            $('#information').html('');
            $('BODY').off('click', '#dismiss-data-'+circle.id);

        })

    }
}
