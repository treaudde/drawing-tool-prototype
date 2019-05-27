import {fabric} from "FabricJS";
import $ from "jQuery";
import Zoom from "./zoom.js"
import Pan from "./pan.js"

let initDrawingToolPrototype = () => {
    const canvas =  new fabric.Canvas('c');
    let imagePath = 'https://www.saint-joseph.org/wp-content/uploads/2019/02/OSJMR-grand-projet-amenagement-2019-header.jpg';

    //set up zoom
    const zoomObject = new Zoom(canvas, {
        zoomInTrigger: 'zoom-in',
        zoomOutTrigger: 'zoom-out',
        zoomResetTrigger: 'reset-zoom',
        zoomMax: 20,
        scaleFactor: 1.1
    });

    //set up Pan
    const panObject = new Pan(canvas, {panControl: 'pan-mode'});

    fabric.Image
        .fromURL(
            imagePath,
            (oImg) => {
                oImg.set({
                    top: 0,
                    left: 0
                });
                oImg.set('selectable', false);

                canvas.setWidth(oImg.width);
                canvas.setHeight(oImg.height);
                canvas.add(oImg);
            }
        )
}


$(document).ready(() => {
    initDrawingToolPrototype();
});
