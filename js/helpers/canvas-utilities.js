export let canvasSelectionUtilities = {
    disableObjectSelection: (canvas) => {
        canvas.getObjects().forEach((element) => {
            if(element.class != 'loadaed-image') {
                element.set('selectable', false);
            }
        })
    },

    enableObjectSelection: (canvas) => {
        canvas.getObjects().forEach((element) => {
            if(element.class != 'loadaed-image') {
                element.set('selectable', true);
            }
        })
    }

}
