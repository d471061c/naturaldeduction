import GameObject from './GameObject.js';
import { DeductionRule } from './DeductionRule.js';

class RuleEditor extends GameObject {
    constructor () {
        super();
        this.rules = {}
    }

    addRule(x, y, ruleType, conjective) {
        const ruleId = Object.keys(this.rules).length
        this.rules[ruleId] = new DeductionRule(ruleId, x, y, ruleType, conjective)
    }

    render(ctx) {
        for (let rule of Object.values(this.rules)) {
            rule.render(ctx)
        }
    }

    onEvent(type, event) {
        for (let rule of Object.values(this.rules)) {
            rule.onEvent(type, event, this.rules)
        }
    }

    update () {
        for (let rule of Object.values(this.rules)) {
            rule.update();
        }
    }
}

export {
    RuleEditor
}