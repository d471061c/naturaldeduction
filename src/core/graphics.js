const GLOBAL_SETTINGS = {
    fontSize: 20,
    fontStyle: 'Arial',
    fontAlign: 'center',
    fontColor: '#000',
    defaultFillStyle: '#000'
};

/**
 * Fill rectangle to given (x, y)-coordinate
 * @param {context2d} ctx context2d from canvas
 * @param {int} x X-coordinate
 * @param {int} y Y-coordinate
 * @param {int} width Width of the rectangle
 * @param {int} height Height of the rectangle
 */
const fillRectangle = (ctx, x, y, width, height) => {
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

/**
 * Draw line from starting coordinate to ending coordinate
 * @param {context2d} ctx context2d from canvas
 * @param {int} sx Starting X-coordinate
 * @param {int} sy Starting Y-coordinate
 * @param {int} ex Ending X-coordinate
 * @param {int} ey Ending Y-coordinate
 */
const line = (ctx, sx, sy, ex, ey) => {
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
}


/**
 * Draw text on the canvas
 * @param {context2d} ctx context2d from canvas
 * @param {string} text Text to be displayed
 * @param {int} x X-coordinate of the text
 * @param {int} y Y-coordinate of the text
 */
const fillText = (ctx, text, x, y) => {
    ctx.font = `${GLOBAL_SETTINGS.fontSize}px ${GLOBAL_SETTINGS.fontStyle}`;
    ctx.textAlign = GLOBAL_SETTINGS.FontAlign; 
    ctx.fillText(text, x, y);
}

/**
 * Sets fill style for the context
 * @param {context2d} ctx context2d from canvas
 * @param {string} fillStyle Fill style for the context
 */
const setFillStyle = (ctx, fillStyle) => {
    ctx.fillStyle = fillStyle;
}

/**
 * Sets fill style to default
 * @param {context2d} ctx context2d from canvas
 */
const resetFillStyle = (ctx) => {
    setFillStyle(ctx, GLOBAL_SETTINGS.defaultFillStyle);
}

/**
 * Clear the canvas
 * @param {context2d} ctx context2d from canvas
 * @param {canvas} canvas canvas (html-element)
 */
const clearCanvas = (ctx, canvas) => {
    resetFillStyle(ctx)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export {
    GLOBAL_SETTINGS,
    fillRectangle,
    line,
    fillText,
    clearCanvas,
    setFillStyle,
    resetFillStyle
}