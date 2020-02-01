import { runEngine, setupCanvas } from './core/engine.js'
import { RULE_TYPE, CONJECTIVE } from './core/rule.js'
import { DeductionRule } from './components/DeductionRule.js'

const rules = [
    new DeductionRule(100, 100, RULE_TYPE.introduction, CONJECTIVE.and)
];

const { ctx, canvas } = setupCanvas("nd-editor");
runEngine(ctx, canvas, rules);