import {  RULE_TYPE_FI, RULE_TYPE, CONJECTIVE, CONJECTIVE_SYMBOL } from '../core/rule.js'
import { Placeholder, PlaceholderDimension, PlaceholderType } from './Placeholder.js'
import { GLOBAL_SETTINGS, setFillStyle, fillText, fillSelected,line } from '../core/graphics.js'
import { EVENT_TYPE } from '../core/engine.js'
import GameObject from './GameObject.js'

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

class DeductionRule extends GameObject {
    constructor(id, x, y, ruleType, conjective) {
        super();
        this.id = id

        this.position = { x, y };
        this.ruleType = ruleType;
        this.conjective = conjective;

        // Settings
        this.dragged = false;
        this.color = "#000"
        this.spacing = { x: 40,  y: 4, text: 4, selected: 4 };
        
        // Selecting a rule
        this.selectedLength = 10
        this.selected = false
        this.hoveredOver = false

        // Connection state
        this.connected = false

        // Components
        this.text = { value: getRuleName(this.ruleType, this.conjective), x: 0, y: 0, width: 36 }
        this.edge = { sx: 0, sy: 0, ex: 0, ey: 0 }

        this.createPlaceholders()
        this.updateComponents()
    }

    /**
     * Set rule to be connected to other rule
     */
    setConnected() {
        this.connected = true
        this.selected = false
        this.dragged = false
    }

    /**
     * Update positions of components
     */
    updateComponents() {
        this.text.x = this.position.x + this.getWidth() + this.spacing.text
        this.text.y = this.position.y + PlaceholderDimension.height + GLOBAL_SETTINGS.fontSize / 2
        this.edge.sx = this.position.x
        this.edge.sy = this.position.y + PlaceholderDimension.height + this.spacing.y
        this.edge.ex = this.position.x + this.getWidth()
        this.edge.ey = this.position.y + PlaceholderDimension.height + this.spacing.y
    }

    /**
     * Create placeholders for deduction rule
     */
    createPlaceholders() {
        this.placeholderAmount = getPlaceholderAmount(this.ruleType, this.conjective);
        this.placeholders = [new Placeholder(this, this.position.x, this.position.y)];

        for (var i = 1; i < this.placeholderAmount; i++) {
            var newX = (this.placeholders[i - 1].getWidth() + this.spacing.x) * i + this.position.x;
            var newY = this.position.y;
            this.placeholders.push(new Placeholder(this, newX, newY));
        }

        const resultX = this.position.x + this.getWidth() / 2 - PlaceholderDimension.width / 2;
        const resultY = this.position.y + PlaceholderDimension.height + this.spacing.y * 2;
        this.result = new Placeholder(this, resultX, resultY);
    }

    /**
     * Update the position of the placeholder.
     * @param {int} idx Index of the placeholder
     */
    updatePlaceholder(idx) {
        let newX = this.position.x;
        let newY = this.position.y;

        if (idx > 0) {
            newX = this.placeholders[idx - 1].getWidth() + this.spacing.x + this.placeholders[idx - 1].position.x;
        } 

        if (this.placeholders[idx].type === PlaceholderType.rule) {
            newY = this.position.y - PlaceholderDimension.height - this.spacing.y * 2
        } 

        this.placeholders[idx].updatePosition(newX, newY);
    }

    /**
     * Update the position of the rule.
     * @param {int} x new X-coordinate
     * @param {int} y new Y-coordinate
     */
    updatePosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.updateComponents()

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
        const lastPlaceholder = this.placeholders[this.placeholders.length - 1];
        return lastPlaceholder.position.x + lastPlaceholder.getWidth() - this.position.x;
    }

    drawSelectionBox(ctx) {
        fillSelected(ctx, 
            this.position.x - this.spacing.selected, 
            this.position.y - this.spacing.selected, 
            this.getWidth() + this.text.width + this.spacing.selected, 
            // TODO: replace one place holder with the maximum size of the rule
            PlaceholderDimension.height * 2 + this.spacing.y * 3 + this.spacing.selected, 
            this.selectedLength
        );
    }

    render(ctx) {
        this.result.render(ctx);
        this.placeholders.forEach(placeholder => {
            placeholder.render(ctx);
        });
        
        if (!this.connected && (this.selected  || this.hoveredOver)) {
            this.drawSelectionBox(ctx)
        }

        setFillStyle(ctx, this.color);
        fillText(ctx, this.text.value, this.text.x, this.text.y);
        line(ctx, this.edge.sx, this.edge.sy, this.edge.ex, this.edge.ey);

        ctx.stroke();
    }

    onEvent(type, event, rules) {
        this.placeholders.forEach(placeholder => {
            placeholder.onEvent(type, event, rules);
        })
        // Desktop
        if (!this.connected) {
            // Disconnected
            // Touch screen events
            if (type === EVENT_TYPE.touchStart || 
                type === EVENT_TYPE.touchMove ||
                type === EVENT_TYPE.touchCancel) {
                    const { pageX, pageY } = event.targetTouches[0]
                    
                    if (type === EVENT_TYPE.touchStart && this.collides(pageX, pageY)) {
                        this.dragged = true;
                        this.selected = true;
                        return;
                    } else {
                        this.selected = false;
                    }
                    
                    if(this.dragged && type == EVENT_TYPE.touchMove) {
                        this.updatePosition(pageX - this.getWidth()/2, pageY - PlaceholderDimension.height - this.spacing.y);
                        this.selected = true;
                    }
                } else if (type === EVENT_TYPE.touchEnd) {
                    this.dragged = false;
                    this.selected = false;
                }
                
            // Desktop events
            let collides = this.collides(event.x, event.y)
            if (type == EVENT_TYPE.mouseDown && collides) {
                this.dragged = true;
                this.selected = true;
                return;
            } else if (type == EVENT_TYPE.mouseDown && !collides) {
                this.selected = false;
            } else if (type == EVENT_TYPE.mouseUp) {
                this.dragged = false;
            }
            
            this.hoveredOver = collides
            if(this.dragged && type == EVENT_TYPE.mouseMove) {
                this.updatePosition(event.x - this.getWidth()/2, event.y - PlaceholderDimension.height - this.spacing.y);
            }
        } else {
            // Connected
            if (this.collides(event.x, event.y)) {
                if (type == EVENT_TYPE.mouseDown) {
                    this.dragged = true;
                } 
                if (this.dragged) {
                    if (type == EVENT_TYPE.mouseUp) {
                        this.dragged = false;
                    } else if (type == EVENT_TYPE.mouseMove) {
                        this.connected = false;
                        this.selected = true;
                        return;
                    }
                }
            } else {
                this.dragged = false;
            }
        }

    }

    /**
     * Check if the coordinate collides with the line drawn in between the top and bottom placeholders.
     * @param {int} x X-coordinate
     * @param {int} y Y-coordinate
     */
    collides(x, y) {
        if (this.position.x < x && x < this.position.x + this.getWidth() + this.text.width + this.spacing.selected) {
            if (this.position.y < y && y < this.position.y + PlaceholderDimension.height * 2 + this.spacing.y * 2 + this.spacing.selected) {
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

export {
    DeductionRule
}