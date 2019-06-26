import {fabric} from "FabricJS";
import $ from "jQuery";
import Zoom from "./zoom.js"
import Pan from "./pan.js"
import DrawLine from "./draw-line.js";
import MovePoint from "./move-point.js";

let initDrawingToolPrototype = () => {
    const canvas =  new fabric.Canvas('c');
    let imagePath = 'img/roof.jpeg';

    //set up zoom
    const zoomObject = new Zoom(canvas, {
        zoomInTrigger: 'zoom-in',
        zoomOutTrigger: 'zoom-out',
        zoomResetTrigger: 'reset-zoom',
        centerCanvasTrigger: 'center-canvas',
        zoomMax: 20,
        scaleFactor: 1.1
    });

    //fix the selectability of lines, seems to work after a zoom
    setInterval(() => {
        zoomObject.zoomInCanvas();
        zoomObject.zoomOutCanvas();
    }, 10000)

    //set up Pan
    const panObject = new Pan(canvas, {panControl: 'pan-mode'});

    //set up drawing
    const drawingObject = new DrawLine(canvas, {drawingControl: 'drawing-mode'});

    const pointModeObject = new MovePoint(canvas, drawingObject, {pointControl:'point-mode'})

    fabric.Image
        .fromURL(
            imagePath,
            (oImg) => {
                oImg.set({
                    top: 0,
                    left: 0,
                    class: 'loaded-image', //this is a property we set
                    selectable: false
                });

                canvas.setWidth(oImg.width);
                canvas.setHeight(oImg.height);
                canvas.add(oImg);
                zoomObject.setCanvasImage(oImg);
            }
        )
}


$(document).ready(() => {
    initDrawingToolPrototype();
});
