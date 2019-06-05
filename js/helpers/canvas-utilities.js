export let canvasSelectionUtilities = {
    disableObjectSelection: (canvas) => {
        canvas.getObjects().forEach((element) => {
            if(element.class != 'loaded-image') {
                element.set('selectable', false);
            }
        })
    },

    enableObjectSelection: (canvas) => {
        canvas.getObjects().forEach((element) => {
            if(element.class != 'loaded-image') {
                element.set('selectable', true);
            }
        })
    }

}
