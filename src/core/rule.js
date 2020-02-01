const CONJECTIVE = {
    and: 1,
    or: 2,
    implication: 3,
    equivelance: 4,
    negation: 5
};

const CONJECTIVE_SYMBOL = {
    and: '∧',
    or: '∨',
    implication: '→',
    equivelance: '↔',
    negation: '¬'
};

const RULE_TYPE = {
    introduction: 1,
    elimination: 2
};

const RULE_TYPE_EN = {
    introduction : 'I',
    elimination : 'E'
};

const RULE_TYPE_FI = {
    introduction : 'T',
    elimination : 'E'
};

export {
    CONJECTIVE,
    CONJECTIVE_SYMBOL,
    RULE_TYPE,
    RULE_TYPE_EN,
    RULE_TYPE_FI
}