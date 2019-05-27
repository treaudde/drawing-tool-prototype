import {fabric} from "FabricJS";
import $ from "jQuery";


export default class Zoom {

    constructor(canvas, config) {
        this.ZOOM_MAX = config.zoomMax;
        this.SCALE_FACTOR = config.scaleFactor;
        this.canvas = canvas;

        //set up the elements
        $('#' + config.zoomInTrigger).click(() => {
            this.zoomIn = !this.zoomIn;
            if(this.zoomIn) {
                this.zoomOut = false;
            }

            this.zoomInCanvas();

            return false;
        });

        $('#' + config.zoomOutTrigger).click(() => {
            this.zoomOut = !this.zoomOut;
            if(this.zoomOut) {
                this.zoomIn = false;
            }

            this.zoomOutCanvas();

            return false;
        })

        $('#' + config.zoomResetTrigger).click(() => {
            this.zoomOut = false;
            this.zoomIn = false


            this.resetZoomCanvas();

            return false;
        })
    }

    zoomInCanvas() {
        if (this.canvas.getZoom().toFixed(5) > this.ZOOM_MAX) {
            console.log("zoomIn: Error: cannot zoom-in anymore");
            return;
        }

        this.canvas.setZoom(this.canvas.getZoom() * this.SCALE_FACTOR);
        this.canvas.setHeight(this.canvas.getHeight() * this.SCALE_FACTOR);
        this.canvas.setWidth(this.canvas.getWidth() * this.SCALE_FACTOR);
        this.canvas.renderAll();
    }


    zoomOutCanvas() {
        if (this.canvas.getZoom().toFixed(5) <= 0.1) {
            console.log("zoomOut: Error: cannot zoom-out anymore");
            return;
        }

        this.canvas.setZoom(this.canvas.getZoom() / this.SCALE_FACTOR);
        this.canvas.setHeight(this.canvas.getHeight() / this.SCALE_FACTOR);
        this.canvas.setWidth(this.canvas.getWidth() / this.SCALE_FACTOR);
        this.canvas.renderAll();
    }

    resetZoomCanvas() {
        this.canvas.setHeight(this.canvas.getHeight() / this.canvas.getZoom() );
        this.canvas.setWidth(this.canvas.getWidth() / this.canvas.getZoom() );
        this.canvas.setZoom(1);

        this.canvas.renderAll();
    }
}
