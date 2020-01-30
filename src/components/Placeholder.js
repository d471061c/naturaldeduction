import { setFillStyle, fillRectangle } from '../core/graphics.js'
import { EVENT_TYPE } from '../core/engine.js'
import GameObject from './GameObject.js';

// Default width and height of the placeholder
const PlaceholderDimension = {
    height: 20,
    width: 20
};

const PlaceholderType = {
    empty: 1,
    symbol: 2,
    rule: 3
};

class Placeholder extends GameObject {
    constructor(x, y) {
        super();
        this.position = { x, y };
        this.type = PlaceholderType.empty;
        this.value = null;
        this.color = "#ccc";
        this.width = PlaceholderDimension.width;
        this.height = PlaceholderDimension.height;
    }

    /**
     * Checks if the placeholder collides with given (x, y)-coordinate. 
     * Note: This is used only when the placeholder is empty.
     * @param {int} x X-coordinate
     * @param {int} y Y-coordinate
     */
    collides(x, y) {
        return this.position.x <= x && x <= this.position.x + this.width && 
               this.position.y <= y && y <= this.position.y + this.height;
    }

    /**
     * Returns the width of the placeholder.
     */
    getWidth() {
        if (this.type === PlaceholderType.rule) {
            return this.value.getWidth();
        }
        return this.width;
    }

    /**
     * Sets a new position for the placeholder.
     * @param {int} x New X-coordinate
     * @param {int} y New Y-coordinate
     */
    updatePosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        if (this.type === PlaceholderType.rule) {
            this.value.updatePosition(this.position.x, this.position.y);
        }
    }

    /**
     * Draw the placeholder onto the canvas.
     */
    render(ctx) {
        switch(this.type) {
            case PlaceholderType.empty:
                setFillStyle(ctx, this.color);
                fillRectangle(ctx, this.position.x, this.position.y, this.width, this.height);
                break;
            case PlaceholderType.symbol:
                // TODO: Implement
                break;
            case PlaceholderType.rule:
                this.value.render(ctx);
                break;
        }
    }

    /**
     * Handle the event (IO-interaction)
     * @param {EVENT_TYPE} type The type of the event, e.g. (mousemove)
     * @param {window.event} event Event from the event listener
     */
    onEvent(type, event) {
        if (this.type === PlaceholderType.empty) {
            if (type === EVENT_TYPE.mouseDown) {
                if (this.collides(event.x, event.y)) {
                    alert("To be implemented")
                }
            } else if (type === EVENT_TYPE.mouseMove ) {
                if (this.collides(event.x, event.y)) {
                    this.color = "#aaa";
                } else {
                    this.color = "#ccc";
                }
            } 
        } else if (this.type === PlaceholderType.rule) {
            this.value.onEvent(type, event);
        }
    }
}

export {
    Placeholder,
    PlaceholderDimension,
    PlaceholderType
}