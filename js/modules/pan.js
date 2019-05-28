import {fabric} from "FabricJS";
import $ from "jQuery";


export default class Pan {

    constructor(canvas, config) {
        this.canvasWidth = canvas.getWidth();
        this.canvasHeight = canvas.getHeight();
        this.canvas = canvas;
        this.canvasElements = null;
        this.panMode = false

        this.mouseDown = false;

        this.canvas.on('mouse:down', () => {
            this.mouseDown = true
        });

        this.canvas.on('mouse:up', () => {
            this.mouseDown = false;
        });

        this.canvas.on('mouse:move', (e) => {
            if (this.mouseDown && this.panMode) {
                this.panToByMouseCoords(e.e.movementX, e.e.movementY);
            }
        })

        this.canvasElements = $('.canvas-container canvas').toArray();

        //set up pan control
        $('#' + config.panControl).click(() => {
            this.panMode = !this.panMode;
            this.canvas.selection = !this.panMode;
            (this.panMode == true) ? $('#pan-status').html('(On)') :
            $('#pan-status').html('(Off)');

            (this.panMode == true) ? this.disableObjectSelection() : this.enableObjectSelection();
        })
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

    panToByMouseCoords(xDelta, yDelta) {
        this.canvasElements.forEach((elementValue) => {
            elementValue = $(elementValue);
            let currentTop = Number(elementValue.css("top").replace(/[^\d\.\-]/g, '') );
            let currentLeft = Number(elementValue.css("left").replace(/[^\d\.\-]/g, '') );

            console.log("panToByMouseCoords:: (currentTop, yDelta): (" + currentTop + ", " + yDelta +")" +", (currentLeft, xDelta): (" + currentLeft + ", " + xDelta +")");

            currentTop = this.zoomCalcYpos(currentTop + yDelta);
            currentLeft = this.zoomCalcXpos(currentLeft + xDelta);
            elementValue.css("top", currentTop);
            elementValue.css("left", currentLeft);
        });
    }

    zoomCalcXpos(xPos) {
        if (xPos > 0){
            return 0;
        }
        if (xPos + this.canvas.getWidth() < this.canvasWidth){
            return this.canvasWidth - this.canvas.getWidth();
        }
        return xPos;
    }

    zoomCalcYpos(yPos) {
        if (yPos > 0){
            return 0;
        }
        if (yPos + this.canvas.getHeight() < this.canvasHeight) {
            return this.canvasHeight - this.canvas.getHeight();
        }
        return yPos;
    }
}






