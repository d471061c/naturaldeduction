import { clearCanvas } from './graphics.js'

const EVENT_TYPE = {
    mouseDown: 1,
    mouseUp: 2,
    mouseMove: 3,
    touchStart: 4,
    touchEnd: 5,
    touchCancel: 6,
    touchMove: 7
};


/**
 * Resize the canvas to the screen
 * @param {canvas} canvas canvas (html-element)
 */
const resizeCanvasToScreen = (canvas) => () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Returns ctx (context 2D) and canvas (html-element)
 * @param {string} canvasId Id for newly created canvas
 */
const setupCanvas = (canvasId) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvasId);

    const resize = resizeCanvasToScreen(canvas)
    resize() 

    window.addEventListener('resize', resize, false);
    window.addEventListener('orientationchange', resize, false);

    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    return { canvas, ctx }
}

/**
 * Catch event, stop its default method and from propagating.
 * @param {event} event Event from a listener
 */
const catchEvent = (event) => {
    event.stopPropagation();
    event.preventDefault();
}

/**
 * Run engine with given objects
 * @param {context2d} ctx context2d from canvas
 * @param {canvas} canvas canvas (html-element)
 * @param {[DeductionRule]} content Array of deduction rules
 */
const runEngine = (ctx, canvas, content) => {
    window.onload = () => {
        const update = () => {
            content.forEach((object) => {
                object.update();
            });
        }
    
        const render = (ctx) => {
            clearCanvas(ctx, canvas);
            ctx.beginPath();
            ctx.save();
    
            content.forEach((object) => {
                object.render(ctx);
            });
    
            ctx.restore();
        }
    
        const mainloop = () => {
            update();
            render(ctx);
            requestAnimationFrame(mainloop);
        }
    
        canvas.addEventListener('mousedown', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.mouseDown, event);
            });
        });
    
        canvas.addEventListener('mouseup', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.mouseUp, event);
            });
        });
    
        canvas.addEventListener('mousemove', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.mouseMove, event);
            });
        });
    
        canvas.addEventListener('touchstart', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.touchStart, event);
            });
        });
    
        canvas.addEventListener('touchend', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.touchEnd, event);
            });
        });
    
        canvas.addEventListener('touchcancel', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.touchCancel, event);
            });
        });
    
        canvas.addEventListener('touchmove', (event) => {
            catchEvent(event);
            content.forEach((object) => {
                object.onEvent(EVENT_TYPE.touchMove, event);
            });
        });
        
        mainloop(ctx);
    }
}

export {
    EVENT_TYPE,
    setupCanvas,
    runEngine
}