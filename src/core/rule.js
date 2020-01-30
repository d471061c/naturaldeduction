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

export {
    CONJECTIVE,
    CONJECTIVE_SYMBOL,
    RULE_TYPE,
    RULE_TYPE_EN,
    RULE_TYPE_FI
}