'use strict';

const CONJECTIVE = {
    and: 0x1,
    or: 0x2,
    implication: 0x3,
    equivelance: 0x4,
    negation: 0x5
};

const CONJECTIVE_SYMBOL = {
    and: '∧',
    or: '∨',
    implication: '→',
    equivelance: '↔',
    negation: '¬'
};

const RULE_TYPE = {
    introduction: 0x1,
    elimination: 0x2
};

const RULE_TYPE_EN = {
    introduction : 'I',
    elimination : 'E'
};

const RULE_TYPE_FI = {
    introduction : 'T',
    elimination : 'E'
};

const GLOBAL_SETTINGS = {
    fontSize: 20,
    fontStyle: 'Arial',
    fontAlign: 'center',
    fontColor: '#00000000',
    defaultFillStyle: '#00000000'
};

const EVENT = {
    mouseDown: 0x1,
    mouseUp: 0x2,
    mouseMove: 0x3,
    touchStart: 0x4,
    touchEnd: 0x5,
    touchCancel: 0x6,
    touchMove: 0x7
};

const PlaceholderDimension = {
    height: 20,
    width: 20
};

const PlaceholderType = {
    empty: 0x1,
    symbol: 0x2,
    rule: 0x3
};

const PlaceholderConstants = {
    height: 20,
    width: 20,
    empty: 0x1,
    symbol: 0x2,
    rule: 0x3
}
/**
 * Returns an identifier of a rule as a string, e.g. "vE" (elimination, or)
 * @param {RULE_TYPE} ruleType Type of the rule
 * @param {CONJECTIVE} conjective Conjective of the rule
 */
const getRuleName = (ruleType, conjective) => {
    if (ruleType === RULE_TYPE.introduction) {
        switch (conjective) {
            case CONJECTIVE.and:
                return CONJECTIVE_SYMBOL.and + RULE_TYPE_FI.introduction;
            case CONJECTIVE.equivelance:
                return CONJECTIVE_SYMBOL.equivelance + RULE_TYPE_FI.introduction;
            case CONJECTIVE.implication:
                return CONJECTIVE_SYMBOL.implication + RULE_TYPE_FI.introduction;
            case CONJECTIVE.negation:
                return CONJECTIVE_SYMBOL.negation + RULE_TYPE_FI.introduction;
            case CONJECTIVE.or:
                return CONJECTIVE_SYMBOL.or + RULE_TYPE_FI.introduction;
        }
    } else if (ruleType === RULE_TYPE.elimination) {
        switch (conjective) {
            case CONJECTIVE.and:
                return CONJECTIVE_SYMBOL.and + RULE_TYPE_FI.elimination;
            case CONJECTIVE.equivelance:
                return CONJECTIVE_SYMBOL.equivelance + RULE_TYPE_FI.elimination;
            case CONJECTIVE.implication:
                return CONJECTIVE_SYMBOL.implication + RULE_TYPE_FI.elimination;
            case CONJECTIVE.negation:
                return CONJECTIVE_SYMBOL.negation + RULE_TYPE_FI.elimination;
            case CONJECTIVE.or:
                return CONJECTIVE_SYMBOL.or + RULE_TYPE_FI.elimination;
        }
    }
}

/**
 * Returns the amount of placeholders required on the top of the rule (as an input)
 * @param {RULE_TYPE} ruleType Type of the rule
 * @param {CONJECTIVE} conjective Conjective of the rule
 */
const getPlaceholderAmount = (ruleType, conjective) => {
    if (ruleType === RULE_TYPE.introduction) {
        switch (conjective) {
            case CONJECTIVE.and:
                return 2;
            case CONJECTIVE.equivelance:
                return 2;
            case CONJECTIVE.implication:
                return 1;
            case CONJECTIVE.negation:
                return 1;
            case CONJECTIVE.or:
                return 1;
        }
    } else if (ruleType === RULE_TYPE.elimination) {
        switch (conjective) {
            case CONJECTIVE.and:
                return 1;
            case CONJECTIVE.equivelance:
                return 2;
            case CONJECTIVE.implication:
                return 2;
            case CONJECTIVE.negation:
                return 1;
            case CONJECTIVE.or:
                return 3;
        }
    }
}

let canvas = null;
let ctx = null;

/**
 * Resize the canvas to the screen
 */
const resizeCanvasToScreen = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Creates global variables ctx (context 2D) and canvas (html-element)
 * @param {string} canvas_id The id of the canvas
 */
const setupCanvas = (canvas_id) => {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvas_id);

    resizeCanvasToScreen()
    window.addEventListener('resize', resizeCanvasToScreen, false);
    window.addEventListener('orientationchange', resizeCanvasToScreen, false);

    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
}

/**
 * Fill rectangle to given (x, y)-coordinate
 * @param {int} x X-coordinate
 * @param {int} y Y-coordinate
 * @param {int} width Width of the rectangle
 * @param {int} height Height of the rectangle
 */
const fillRectangle = (x, y, width, height) => {
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

/**
 * Draw line from starting coordinate to ending coordinate
 * @param {int} sx Starting X-coordinate
 * @param {int} sy Starting Y-coordinate
 * @param {int} ex Ending X-coordinate
 * @param {int} ey Ending Y-coordinate
 */
const line = (sx, sy, ex, ey) => {
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
}

/**
 * Draw text on the canvas
 * @param {string} text Text to be displayed
 * @param {int} x X-coordinate of the text
 * @param {int} y Y-coordinate of the text
 */
const fillText = (text, x, y) => {
    ctx.font = `${GLOBAL_SETTINGS.fontSize}px ${GLOBAL_SETTINGS.fontStyle}`;
    ctx.textAlign = GLOBAL_SETTINGS.FontAlign; 
    ctx.fillText(text, x, y);
}

/**
 * Clear the canvas
 */
const clearCanvas = () => {
    ctx.fillStyle = GLOBAL_SETTINGS.defaultFillStyle;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Sets fill style for the context
 * @param {string} fillStyle Fill style for the context
 */
const setFillStyle = (fillStyle) => {
    ctx.fillStyle = fillStyle;
}

/**
 * Sets fill style to default
 */
const resetFillStyle = () => {
    setFillStyle(GLOBAL_SETTINGS.defaultFillStyle);
}

/**
 * Catch event, stop its default method and from propagating.
 * @param {event} event Event from a listener
 */
const catchEvent = (event) => {
    event.stopPropagation();
    event.preventDefault();
}


class Placeholder {
    constructor(x, y) {
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
    render() {
        switch(this.type) {
            case PlaceholderType.empty:
                setFillStyle(this.color);
                fillRectangle(this.position.x, this.position.y, this.width, this.height);
                break;
            case PlaceholderType.symbol:
                break;
            case PlaceholderType.rule:
                this.value.render();
                break;
        }
    }

    /**
     * Handle the event (IO-interaction)
     * @param {EVENT} type The type of the event, e.g. (mousemove)
     * @param {window.event} event Event from the event listener
     */
    onEvent(type, event) {
        if (this.type === PlaceholderType.empty) {
            if (type === EVENT.mouseDown) {
                if (this.collides(event.x, event.y)) {
                    this.setToRule();
                }
            } else if (type === EVENT.mouseMove ) {
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

    /**
     * Sets the current placeholder into a rule.
     */
    setToRule() {
        this.type = PlaceholderType.rule;
        this.value = new Rule(this.position.x,  this.position.y,  RULE_TYPE.elimination, CONJECTIVE.or);
        this.value.position.x = this.value.position.x - this.value.getWidth() / 2;
    }

    /**
     * This method will be run in the mainloop.
     */
    update() {

    }
}

class Rule {
    constructor(x, y, ruleType, conjective) {
        this.position = { x, y };
        this.dragged = false;
        this.color = "#000"

        this.spacing = {
            x: 40,
            y: 4,
            text: 4
        };

        this.ruleType = ruleType;
        this.conjective = conjective;
        this.name = getRuleName(this.ruleType, this.conjective);

        this.placeholderAmount = getPlaceholderAmount(this.ruleType, this.conjective);
        this.placeholders = [new Placeholder(this.position.x, this.position.y)];

        for (var i = 1; i < this.placeholderAmount; i++) {
            var newX = (this.placeholders[i - 1].getWidth() + this.spacing.x) * i + this.position.x;
            var newY = this.position.y;
            this.placeholders.push(new Placeholder(newX, newY));
        }

        this.result = new Placeholder(this.position.x + this.getWidth() / 2 - PlaceholderDimension.width / 2,
                                      this.position.y + PlaceholderDimension.height + this.spacing.y * 2);
    }

    /**
     * Update the position of the placeholder.
     * @param {int} idx Index of the placeholder
     */
    updatePlaceholder(idx) {
        if (this.placeholders[idx].type === PlaceholderType.empty) {
            if (idx == 0) {
                this.placeholders[idx].updatePosition(this.position.x, this.position.y);
            } else {
                this.placeholders[idx].updatePosition((this.placeholders[idx - 1].getWidth() + this.spacing.x) + this.placeholders[idx - 1].position.x, this.position.y);
            }
        } else if (this.placeholders[idx].type === PlaceholderType.rule) {
            if (idx == 0) {
                this.placeholders[idx].updatePosition(this.position.x, this.position.y - PlaceholderDimension.height - this.spacing.y * 2);
            } else {
                this.placeholders[idx].updatePosition((this.placeholders[idx - 1].getWidth() + this.spacing.x) + this.placeholders[idx - 1].position.x, this.position.y- PlaceholderDimension.height - this.spacing.y * 2);
            }
        }
    }

    /**
     * Update the position of the rule.
     * @param {int} x new X-coordinate
     * @param {int} y new Y-coordinate
     */
    updatePosition(x, y) {
        this.position.x = x;
        this.position.y = y;

        for (var i = 0; i < this.placeholders.length; i++) {
            this.updatePlaceholder(i);
        }

        this.result.updatePosition(this.position.x + this.getWidth() / 2 - PlaceholderDimension.width / 2,
                                   this.position.y + PlaceholderDimension.height + this.spacing.y * 2);
    }

    /**
     * Returns the width of the rule.
     */
    getWidth() {
        var lastPlaceholder = this.placeholders[this.placeholders.length - 1];
        return lastPlaceholder.position.x + lastPlaceholder.getWidth() - this.position.x;
    }

    /**
     * Draw the rule onto the canvas
     */
    render() {
        this.result.render();
        this.placeholders.forEach((placeholder) => {
            placeholder.render();
        });
        
        setFillStyle(this.color);
        fillText(this.name, this.position.x + this.getWidth() + this.spacing.text,
                            this.position.y + PlaceholderDimension.height + GLOBAL_SETTINGS.fontSize / 2);
        line(this.position.x, this.position.y + PlaceholderDimension.height + this.spacing.y,
             this.position.x + this.getWidth(), this.position.y + PlaceholderDimension.height + this.spacing.y);
             
             
        ctx.stroke();
    }

    /**
     * Handle the event from the event listener
     * @param {EVENT} type Type of the event, e.g. mouseMove
     * @param {window.event} event Event from the event listener
     */
    onEvent(type, event) {
        this.placeholders.forEach((placeholder) => {
            placeholder.onEvent(type, event);
        })

        if (type == EVENT.mouseDown && this.collides(event.x, event.y)) {
            this.dragged = true;
        } else if (type == EVENT.mouseUp) {
            this.dragged = false;
        }
        
        if(this.dragged && type == EVENT.mouseMove) {
            this.updatePosition(event.x - this.getWidth()/2, event.y - PlaceholderDimension.height - this.spacing.y);
        }
    }

    /**
     * Check if the coordinate collides with the line drawn in between the top and bottom placeholders.
     * @param {int} x X-coordinate
     * @param {int} y Y-coordinate
     */
    collides(x, y) {
        if (this.position.x < x && x < this.position.x + this.getWidth()) {
            if (this.position.y + PlaceholderDimension.height < y && y < this.position.y + PlaceholderDimension.height + this.spacing.y * 2) {
                return true;
            }
        }
        return false;
    }

    /**
     * Update rule, calculate positions for the placeholders recursively.
     */
    update() { 
        this.updatePosition(this.position.x, this.position.y);
    }
}


var content = [
    new Rule(600, 500, RULE_TYPE.introduction, CONJECTIVE.and)
];

window.onload = () => {
    setupCanvas("nd-editor");

    const update = () => {
        content.forEach((object) => {
            object.update();
        });
    }

    const render = () => {
        clearCanvas();
        ctx.beginPath();
        ctx.save();

        content.forEach((object) => {
            object.render();
        });

        ctx.restore();
    }

    const mainloop = () => {
        update();
        render();
        requestAnimationFrame(mainloop);
    }

    canvas.addEventListener('mousedown', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.mouseDown, event);
        });
    });

    canvas.addEventListener('mouseup', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.mouseUp, event);
        });
    });

    canvas.addEventListener('mousemove', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.mouseMove, event);
        });
    });

    canvas.addEventListener('touchstart', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.touchStart, event);
        });
    });

    canvas.addEventListener('touchend', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.touchEnd, event);
        });
    });

    canvas.addEventListener('touchcancel', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.touchCancel, event);
        });
    });

    canvas.addEventListener('touchmove', (event) => {
        catchEvent(event);
        content.forEach((object) => {
            object.onEvent(EVENT.touchMove, event);
        });
    });
    
    mainloop();
}