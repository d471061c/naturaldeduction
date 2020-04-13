import { runEngine, setupCanvas } from './core/engine.js'
import { RULE_TYPE, CONJECTIVE } from './core/rule.js'
import { RuleEditor } from './components/RuleEditor.js'

const editor = new RuleEditor()
// Add few more rules to test connection with
editor.addRule(100, 100, RULE_TYPE.introduction, CONJECTIVE.and)
editor.addRule(100, 400, RULE_TYPE.introduction, CONJECTIVE.and)
editor.addRule(100, 200, RULE_TYPE.introduction, CONJECTIVE.and)
editor.addRule(100, 300, RULE_TYPE.introduction, CONJECTIVE.or)
editor.addRule(400, 300, RULE_TYPE.introduction, CONJECTIVE.implication)

const content = [ editor ]

const { ctx, canvas } = setupCanvas("nd-editor")
runEngine(ctx, canvas, content)