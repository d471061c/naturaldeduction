import { runEngine, setupCanvas } from './core/engine.js'
import { RULE_TYPE, CONJECTIVE } from './core/rule.js'
import { Rule } from './components/Rule.js'

const rules = [
    new Rule(100, 100, RULE_TYPE.introduction, CONJECTIVE.and)
];

const { ctx, canvas } = setupCanvas("nd-editor");
runEngine(ctx, canvas, rules);