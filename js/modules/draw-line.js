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

            (this.drawingMode == true) ?  this.setUpDrawingMode() :
                this.tearDownDrawingMode();
        })

        this.canvas.on('mouse:down', (options) => {
            if(this.drawingMode) {
                this.addPoint(options);
            }
        })

        this.canvas.on('mouse:move', (options) => {
            if (this.drawingMode && this.activeLine && this.activeLine.class == "line") {
                let pointer = this.canvas.getPointer(options.e);
                this.activeLine.set({ x2: Math.floor(pointer.x), y2: Math.floor(pointer.y) });
                this.canvas.renderAll();
                this.calculateAngleLine(this.activeLine);
                //this.snapDetection(pointer);
            }
        })
    }

    setUpDrawingMode() {
        $('#drawing-status').html('(On)')
        canvasSelectionUtilities.disableObjectSelection(this.canvas)
        $('CANVAS').css('cursor', 'cell');
    }

    tearDownDrawingMode() {
        $('#drawing-status').html('(Off)')
        canvasSelectionUtilities.enableObjectSelection(this.canvas);
        $('CANVAS').css('cursor', 'pointer');
        this.processDrawing();
    }


    // snapDetection(pointer) {
    //     let combinedPoints = this.persistedPoints.concat(this.pointArray);
    //     for(let x = 0; x<combinedPoints.length; x++) {
    //         let point = combinedPoints[x];
    //         let centerX = point.getCenterPoint().x;
    //         let centerY = point.getCenterPoint().y;
    //
    //         let logString =  `x:  ${Math.abs(pointer.x - centerX)} - ${pointer.x}, y:  ${Math.abs(pointer.y - centerY)} - ${pointer.y}`;
    //
    //         let inSnapRange = (Math.abs(pointer.x - centerX) <= this.snapRange) ||
    //             (Math.abs(pointer.y - centerY) <= this.snapRange);
    //         let lineOrigin = (Math.abs(pointer.x - this.activeLine.x1) <= this.snapRange) ||
    //             (Math.abs(pointer.y - this.activeLine.y1) <= this.snapRange);
    //
    //         if(inSnapRange && !lineOrigin) {
    //             console.log('snap!');
    //             console.log(logString);
    //             this.activeLine.set('x2', centerX);
    //             this.activeLine.set('y2', centerY);
    //         }
    //     }
    // }

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

            let inRange = (number, min, max) => {
                return ((number - min) * (number - max) <= 0);
            }


            //get the center point of the circle as it corresponds to one end a line
            let centerPoint = point.getCenterPoint();
            for (let x = 0; x<this.persistedLines.length; x++) {
                let line = this.persistedLines[x];

                let maxValueX = centerPoint.x + 10;
                let minValueX = centerPoint.x - 10;

                let maxValueY = centerPoint.y + 10;
                let minValueY = centerPoint.y - 10;

                if(this.activeLine !== null && line.id === this.activeLine.id) {
                    this.persistedLines.splice(x,1);
                    continue;
                }

                if (inRange(line.x1, minValueX, maxValueX) && inRange(line.y1, minValueY, maxValueY)) {
                    point.set('lineX1Y1', line);
                    line.set('x1', centerPoint.x);
                    line.set('y1', centerPoint.y);
                }

                if (inRange(line.x2, minValueX, maxValueX) && inRange(line.y2, minValueY, maxValueY)) {
                    point.set('lineX2Y2', line);
                    line.set('x2', centerPoint.x);
                    line.set('y2', centerPoint.y);
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


    calculateAngleCircle(point) {
        if(point.lineX1Y1 !== null && point.lineX2Y2 !== null) { // moving cir
            let angle = this._calculateAngle(point.lineX1Y1, point.lineX2Y2)

            if(Math.floor(angle) == 90) {
                point.lineX1Y1.set('fill', 'green');
                point.lineX2Y2.set('fill', 'green');

                point.lineX1Y1.set('stroke', 'green');
                point.lineX2Y2.set('stroke', 'green');
            } else {
                point.lineX1Y1.set('fill', 'black');
                point.lineX2Y2.set('fill', 'black');

                point.lineX1Y1.set('stroke', 'black');
                point.lineX2Y2.set('stroke', 'black');
            }
        }
    }

    calculateAngleLine(line) {
        if(this.activeLine && this.lineArray.length > 1) {
            //get the last active line
            let lastLine = this.lineArray[this.lineArray.length -2];

            let angle = this._calculateAngle(line, lastLine);

            if(Math.floor(angle) == 90) {
                lastLine.set('fill', 'green');
                this.activeLine.set('fill', 'green');

                lastLine.set('stroke', 'green');
                this.activeLine.set('stroke', 'green');
            } else {
                lastLine.set('fill', 'black');
                this.activeLine.set('fill', 'black');

                lastLine.set('stroke', 'black');
                this.activeLine.set('stroke', 'black');
            }
        }
    }


    _calculateAngle(line1, line2) {
        let y21 = line1.get('y1');
        let y22 = line1.get('y2');
        let y11 = line2.get('y1');
        let y12 = line2.get('y2');

        let x21 = line1.get('x1');
        let x22 = line1.get('x2');
        let x11 = line2.get('x1');
        let x12 = line2.get('x2');

        let angle1 = Math.atan2(y11 - y12, x11 - x12);
        let angle2 = Math.atan2(y21 - y22, x21 - x22);

        let angle = angle1 - angle2;
        angle = angle * 180 / Math.PI;
        if (angle < 0)
            angle = -angle;
        if (360 - angle < angle)
            angle = 360 - angle;

        return angle;
    }
}
