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
        this.snapRange = 20;
        this.ranges = [];

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
                this.activeLine.set({ x2: Math.floor(pointer.x), y2: Math.floor(pointer.y) });
                this.canvas.renderAll();
                this.snapDetection(pointer);
            }
        })
    }

    snapDetection(pointer) {
        let combinedPoints = this.persistedPoints.concat(this.pointArray);
        for(let x = 0; x<combinedPoints.length; x++) {
            let point = combinedPoints[x];
            let centerX = point.getCenterPoint().x;
            let centerY = point.getCenterPoint().y;

            let logString =  `x:  ${Math.abs(pointer.x - centerX)} - ${pointer.x}, y:  ${Math.abs(pointer.y - centerY)} - ${pointer.y}`;

            let inSnapRange = (Math.abs(pointer.x - centerX) <= this.snapRange) ||
                (Math.abs(pointer.y - centerY) <= this.snapRange);
            let lineOrigin = (Math.abs(pointer.x - this.activeLine.x1) <= this.snapRange) ||
                (Math.abs(pointer.y - this.activeLine.y1) <= this.snapRange);

            if(inSnapRange && !lineOrigin) {
                console.log('snap!');
                console.log(logString);
                this.activeLine.set('x2', centerX);
                this.activeLine.set('y2', centerY);
                break;
            }
        }
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


        this.calculatePointLineIntersections();

        console.log(this.persistedPoints);
        console.log(this.persistedLines);

        this.pointArray = [];
        this.lineArray = [];
        this.activeLine = null;
        this.canvas.renderAll();
    }


    calculatePointLineIntersections() {
        //calculate point line intersections for moving points
        this.persistedPoints.forEach((point) => {
            point.set('lineX1Y1', null);
            point.set('lineX2Y2', null);

            //get the center point of the circle as it corresponds to one end a line
            let centerPoint = point.getCenterPoint();
            for (let x = 0; x<this.persistedLines.length; x++) {
                let line = this.persistedLines[x];

                if(this.activeLine !== null && line.id === this.activeLine.id) {
                    this.persistedLines.splice(x,1);
                    continue;
                }
                if (line.x1 == centerPoint.x && line.y1 == centerPoint.y) {
                    point.set('lineX1Y1', line);
                }

                if (line.x2 == centerPoint.x && line.y2 == centerPoint.y) {
                    point.set('lineX2Y2', line);
                }
            }
        });
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

    makeCircle(options) {
        let random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        let id = new Date().getTime() + random;
        let circle = new fabric.Circle({
            radius: 10,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: Math.floor(options.e.layerX/this.canvas.getZoom()),
            top: Math.floor(options.e.layerY/this.canvas.getZoom()),
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
            (Math.floor(options.e.layerX/this.canvas.getZoom())),
            (Math.floor(options.e.layerY/this.canvas.getZoom())),
            (Math.floor(options.e.layerX/this.canvas.getZoom())),
            (Math.floor(options.e.layerY/this.canvas.getZoom()))
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


    //delete line
    deleteLine(line) {
        this.canvas.remove(line);
        this.persistedLines.splice(this.persistedLines.indexOf(line),1);
        this.calculatePointLineIntersections();
        this.removePoints();
        //call twice because of quirkniness - should not have to do this
        this.calculatePointLineIntersections();
        this.removePoints();
    }

    removePoints() {
        //delete any straggling points
        this.persistedPoints.forEach((point, index) => {
            if(point.lineX1Y1 == null && point.lineX2Y2 == null) {
                console.log('point removed - ' + point.id);
                this.canvas.remove(point);
                this.persistedPoints.splice(index,1);
            }
        });

        this.canvas.renderAll();
    }

    //this is just a method for the prototype
    displayLineInformation(line) {
        console.log(line);
        $('BODY').off('click', '#dismiss-data-'+line.id);
        $('BODY').off('click', '#add-data-'+line.id);
        $('BODY').off('click', '#delete-data-'+line.id);
        $('BODY').off('click', '#delete-line-'+line.id);

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
                <p><a href="#" id="add-data-${line.id}" style="font-size: 12px;">Add Data</a></p>
        `
        if (typeof line.lineData.data != 'undefined') {
            htmlString += `
                <p><a href="#" id="clear-data-${line.id}" style="font-size: 12px;">Clear Data</a></p>
            `
        }
        htmlString += `
                <p><a href="#" id="dismiss-data-${line.id}" style="font-size: 12px;">Dismiss</a></p>
        `

        htmlString += `
                <p><a href="#" id="delete-line-${line.id}" style="font-size: 12px;">Delete Line</a></p>
        `

        $('#information').html(htmlString);

        //set up event listeners for this line
        $('BODY').on('click', '#dismiss-data-'+line.id, () => {
            $('#information').html('');
            $('BODY').off('click', '#dismiss-data-'+line.id);
            $('BODY').off('click', '#add-data-'+line.id);
            $('BODY').off('click', '#delete-data-'+line.id);
            $('BODY').off('click', '#delete-line-'+line.id);
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
            return false;
        })

        //set up event listeners for this line
        $('BODY').on('click', '#delete-line-'+line.id, () => {
            if (confirm('Are you sure?')) {
                this.deleteLine(line);
            }
            return false;
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
                <p><a href="#" id="dismiss-data-${circle.id}" style="font-size: 12px;">Dismiss</a></p>
        `
        $('#information').html(htmlString);

        //set up event listeners for this line
        $('BODY').on('click', '#dismiss-data-'+circle.id, () => {
            $('#information').html('');
            $('BODY').off('click', '#dismiss-data-'+circle.id);

        })
    }
}
