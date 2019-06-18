import {fabric} from "FabricJS";
import $ from "jQuery";
import {canvasSelectionUtilities} from "../helpers/canvas-utilities.js";

export default class MovePoint {
    constructor(canvas, drawingObject, config) {
        this.pointMode = false;
        this.canvas = canvas;
        this.drawingObject = drawingObject;

        //set up pan control
        $('#' + config.pointControl).click(() => {
            this.pointMode = !this.pointMode;
            this.canvas.selection = !this.pointMode;
            (this.pointMode == true) ? $('#point-status').html('(On)') :
                $('#point-status').html('(Off)');
            (this.pointMode == true) ? this.enablePointSelection() :
                this.disablePointSelection();
        });
    }

    enablePointSelection() {
        this.drawingObject.persistedPoints.forEach((point) => {
            point.set('selectable', true);
            point.set('lockMovementX',false);
            point.set('lockMovementY', false);

            point.on('moving', (options) => {
                this.movePoint(options.target)
                this.drawingObject.calculateAngleCircle(options.target)
            });
        })
    }

    disablePointSelection() {
        this.drawingObject.persistedPoints.forEach((point) => {
            point.set('selectable',false);
            point.set('lockMovementX',true);
            point.set('lockMovementY', true);
        })
    }

    movePoint(point) {
        if(point.lineX1Y1 != null) {
            point.lineX1Y1.set('x1', point.getCenterPoint().x);
            point.lineX1Y1.set('y1', point.getCenterPoint().y);
        }

        if(point.lineX2Y2 != null) {
            point.lineX2Y2.set('x2', point.getCenterPoint().x);
            point.lineX2Y2.set('y2', point.getCenterPoint().y);
        }
        this.canvas.renderAll();
    }
}
