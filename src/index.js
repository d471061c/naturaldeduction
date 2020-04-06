import { runEngine, setupCanvas } from './core/engine.js'
import { RULE_TYPE, CONJECTIVE } from './core/rule.js'
import { DeductionRule } from './components/DeductionRule.js'
import { RuleEditor } from './components/RuleEditor.js'

const editor = new RuleEditor();
editor.addRule(100, 100, RULE_TYPE.introduction, CONJECTIVE.and);

const content = [ editor ];

const { ctx, canvas } = setupCanvas("nd-editor");
runEngine(ctx, canvas, content);