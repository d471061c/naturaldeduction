import {  RULE_TYPE_FI, RULE_TYPE, CONJECTIVE, CONJECTIVE_SYMBOL } from '../core/rule.js'
import { Placeholder, PlaceholderDimension, PlaceholderType } from './Placeholder.js'
import { GLOBAL_SETTINGS, setFillStyle, fillText, line } from '../core/graphics.js'
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
    constructor(x, y, ruleType, conjective) {
        super();
        this.position = { x, y };
        this.ruleType = ruleType;
        this.conjective = conjective;
        this.name = getRuleName(this.ruleType, this.conjective);

        this.dragged = false;
        this.color = "#000"
        this.spacing = { x: 40,  y: 4, text: 4 };

        this.createPlaceholders()
    }

    /**
     * Create placeholders for deduction rule
     */
    createPlaceholders() {
        this.placeholderAmount = getPlaceholderAmount(this.ruleType, this.conjective);
        this.placeholders = [new Placeholder(this.position.x, this.position.y)];

        for (var i = 1; i < this.placeholderAmount; i++) {
            var newX = (this.placeholders[i - 1].getWidth() + this.spacing.x) * i + this.position.x;
            var newY = this.position.y;
            this.placeholders.push(new Placeholder(newX, newY));
        }

        const resultX = this.position.x + this.getWidth() / 2 - PlaceholderDimension.width / 2;
        const resultY = this.position.y + PlaceholderDimension.height + this.spacing.y * 2;
        this.result = new Placeholder(resultX, resultY);
    }

    /**
     * Update the position of the placeholder.
     * @param {int} idx Index of the placeholder
     */
    updatePlaceholder(idx) {
        let newX = idx > 0 ? this.placeholders[idx - 1].getWidth() + this.spacing.x + this.placeholders[idx - 1].position.x : this.position.x;
        let newY = this.placeholders[idx].type === PlaceholderType.rule ? this.position.y - PlaceholderDimension.height - this.spacing.y * 2 : this.position.y;
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

    /**
     * Draw the rule onto the canvas
     */
    render(ctx) {
        this.result.render(ctx);
        this.placeholders.forEach(placeholder => {
            placeholder.render(ctx);
        });
        
        setFillStyle(ctx, this.color);
        fillText(ctx, this.name, this.position.x + this.getWidth() + this.spacing.text,
                            this.position.y + PlaceholderDimension.height + GLOBAL_SETTINGS.fontSize / 2);
        line(ctx, this.position.x, this.position.y + PlaceholderDimension.height + this.spacing.y,
             this.position.x + this.getWidth(), this.position.y + PlaceholderDimension.height + this.spacing.y);


        ctx.stroke();
    }

    /**
     * Handle the event from the event listener
     * @param {EVENT_TYPE} type Type of the event, e.g. mouseMove
     * @param {window.event} event Event from the event listener
     */
    onEvent(type, event) {
        this.placeholders.forEach(placeholder => {
            placeholder.onEvent(type, event);
        })

        if (type == EVENT_TYPE.mouseDown && this.collides(event.x, event.y)) {
            this.dragged = true;
        } else if (type == EVENT_TYPE.mouseUp) {
            this.dragged = false;
        }
        
        if(this.dragged && type == EVENT_TYPE.mouseMove) {
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
            if (this.position.y + PlaceholderDimension.height < y && 
                y < this.position.y + PlaceholderDimension.height + this.spacing.y * 2) {
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