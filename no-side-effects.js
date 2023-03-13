const first = (arr) => arr[0];
const tail = (arr) => arr.slice(1);
const peek = (arr) => arr[0];

const isOp = (x) => (['-', '+', '/', '*']).includes(x);
const isNumber = (x) => (typeof (x) === 'number');
const isEmpty = (x) => x.length === 0;
const isString = (x) => (typeof (x) === 'string');
const isArray = Array.isArray

const trace = (x) => {
  console.log(x);
  return x;
}

const flipSign = (x) => -1 * x;
const isNeg = (x) => (x < 0)

const powOf10 = (x) =>
  (x) ? 10 * powOf10(x - 1) : 1;

const getNumeral = (x) =>
  (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']).indexOf(x)

const findPlace = (i, arr) =>
  (arr.length - 1) - i;

const parseInteger = (str) => 
  str.split('')
    .filter(x => (/\d+/g).test(x))
    .map((n, i, arr) => 
      (x) => x + (getNumeral(n) * powOf10(findPlace(i, arr)))
    )
    .reduceRight((acc, fn) => fn(acc), 0);

const tryParseInt = (x) =>
  x ? parseInteger(x) : 0;

const parseDecimal = (str) => 
  (str) ? tryParseInt(str) / powOf10(str.length) : 0;

const putTogetherNumber = (arr) =>
  tryParseInt(arr[0]) + parseDecimal(arr[1])

const parsePosNum = (str) =>
   putTogetherNumber(str.split('.'));

const parseNum = (str) =>
  (str.charAt(0) === '-')
    ? flipSign(parsePosNum(str))
    : parsePosNum(str);

const isNegativeSign = (output, numberArr, x) =>
  (x === '-'
    && isEmpty(numberArr)
    && (isEmpty(output) || isOp(output[output.length - 1])));

const isPartOfNumber = (output, num, x) =>
  ((/[\d+\.\,]+/).test(x) || isNegativeSign(output, num, x))

const addToNum = (s) => ({
  num: s.num.concat(first(s.input)),
  output: s.output,
  input: tail(s.input),
});

const addNumToOutput = (s) => ({
  num: [],
  output: s.output.concat(parseNum(s.num.join(''))),
  input: s.input,
})

const tryAddToNum = (s) => 
  isPartOfNumber(s.output, s.input, first(s.input))
    ? addToNum(s)
    : s;

const tryAddNumToOutput = (s) => 
  (isOp(peek(s.input)) || isEmpty(s.input))
    ? addNumToOutput(s)
    : s;

const addOpToOutput = (s) => ({
  num: s.num,
  input: tail(s.input),
  output: s.output.concat(first(s.input))
});

const tryAddOpToOutput = (s) =>
    isOp(peek(s.input))
      ? addOpToOutput(s)
      : s;

const tokenizeState = (s) =>
  (isEmpty(s.input) && isEmpty(s.num))
    ? s.output
    : tokenizeState(tryAddOpToOutput(tryAddNumToOutput(tryAddToNum(s))));

const stripSpaces = (input) =>
  input.filter((x) => !(/\s+/g).test(x));

const initTokenize = (str) => ({
  num: [],
  input: stripSpaces(str.split('')),
  output: [],
})

const tokenize = (str) =>
  tokenizeState(initTokenize(str));

const compare = (a, b) => ops.indexOf(a) > ops.indexOf(b);

const moveFromInputToStack = (state) => ({
  input: tail(state.input),
  stack: ([ first(state.input) ]).concat(state.stack),
  output: state.output,
});

const moveFromInputToOutput = (state) => ({
  input: tail(state.input),
  stack: state.stack,
  output: state.output.concat(first(state.input)),
});

const moveFromStackToOutput = (state) => ({
  input: state.input,
  stack: tail(state.stack),
  output: state.output.concat(first(state.stack)), 
});

const moveOp = (s) => 
  (!isEmpty(s.input) && compare(peek(s.input), peek(s.output)))
    ? moveFromInputToStack(s)
    : moveFromStackToOutput(s);

const shuntStep = (s) =>
  (isNumber(peek(s.input)))
    ? moveFromInputToOutput(s)
    : moveOp(s);

const runShuntYard = (s) =>
  (isEmpty(s.input) && isEmpty(s.stack))
    ? s.output
    : runShuntYard(shuntStep(s));

const rpnInit = (tokens) => ({ input: tokens, output: [], stack: [] });

const rpnConvert = (str) =>
  runShuntYard(rpnInit(tokenize(str)));

const opFn = {
  '-': (a, b) => a - b,
  '+': (a, b) => a + b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
}

const initCalc = (t) => ({
  stack: [],
  input: t
});

const moveNum = (s) => ({
  stack: ([ first(s.input) ]).concat(s.stack),
  input: tail(s.input)
});

const tryMoveNum = (s) => 
  (isNumber(peek(s.input)))
    ? moveNum(s)
    : s;

const doOp = (s) =>
  opFn[first(s.input)](s.stack[1], s.stack[0]);

const calc = (s) => ({
  input: tail(s.input),
  stack: ([ doOp(s) ]).concat(s.stack.slice(2))
})

const tryCalc = (s) =>
  (isOp(peek(s.input)))
    ? calc(s)
    : s;

const calcAll = (s) =>
  (isEmpty(s.input))
    ? first(s.stack)
    : calcAll(tryCalc(tryMoveNum(s)));

const calculate = (str) =>
  calcAll(initCalc(rpnConvert(str)));

module.exports = calculate;
