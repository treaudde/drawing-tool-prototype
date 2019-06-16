import {fabric} from "FabricJS";
import $ from "jQuery";


export default class Zoom {

    constructor(canvas, config) {
        this.ZOOM_MAX = config.zoomMax;
        this.SCALE_FACTOR = config.scaleFactor;
        this.canvas = canvas;
        this.canvasImage = null;


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

        $('#' + config.centerCanvasTrigger).click(() => {
            this.zoomOut = false;
            this.zoomIn = false;

            this.centerCanvas();

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


    centerCanvas() {
        //reset the canvas zoom
        this.resetZoomCanvas();

        //reset the pan if the canvas is panned
        let canvasElements = $('.canvas-container canvas').toArray();
        canvasElements.forEach((canvas) => {
            $(canvas).css('top', 0);
            $(canvas).css('left', 0);
        });

        let innerWidth = window.innerWidth;
        let innerHeight = window.innerHeight;

        //get the ratio of the canvas to the window
        let widthRatio = (this.canvasImage.width / innerWidth);
        let heightRatio = (this.canvasImage.height / innerHeight);
        let ratio = null;
        if (widthRatio > 1 &&  heightRatio > 1) { // image width and height are greater than the canvas
            //take the larger ratio
            ratio = (widthRatio > heightRatio) ? widthRatio : heightRatio;
        }
        else if (widthRatio > 1) {
            ratio = widthRatio;
        }
        else if (heightRatio > 1) {
            ratio = heightRatio;
        }

        //we have a ratio, zoom out to it, if the image fits the window, we don't need to center the canvas
        if (ratio !== null) {
            this.canvas.setZoom(this.canvas.getZoom() / ratio);
            this.canvas.setHeight(this.canvas.getHeight() / ratio);
            this.canvas.setWidth(this.canvas.getWidth() / ratio);
            this.canvas.renderAll();
        }
    }

    setCanvasImage(img){
        this.canvasImage = img;
    }
}
