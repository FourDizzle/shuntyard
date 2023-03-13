const _ = require('lodash/fp');
const parseNumbers = (x) => parseInt(x) || x;
const removeSpaces = _.replace(/\s/g, '');
const tokenize = _.pipe(removeSpaces, _.split(''), _.map(parseNumbers));

const precedence = (x) => ({
  '-': 1,
  '+': 2,
  '/': 3,
  '*': 4
})[x];

const operators = ['-', '+', '/', '*'];
const evalops = {
  '-': (a, b) => a - b,
  '+': (a, b) => a + b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b
}

const initShunt = (x) => ({ input: x, output: [], op: [] })
const input2output = ({ input, output, op }) =>  ({
  output: output.concat(_.head(input)),
  input: _.tail(input),
  op
});
const input2op = ({input, output, op}) => ({
  output,
  input: _.tail(input),
  op: _.concat(op, _.head(input)),
});
const op2output = ({input, output, op}) => ({
  output: _.concat(output, _.last(op)),
  input,
  op: _.initial(op)
});

const handleOps = (yard) =>
  (precedence(_.first(yard.input)) < precedence(_.last(yard.op)))
    ? op2output(yard)
    : input2op(yard);

const handleInput = (yard) => 
  _.isNumber(_.first(yard.input)) ? input2output(yard) : handleOps(yard);

const shunt = (yard) => 
  _.isEmpty(yard.input) ? op2output(yard) : handleInput(yard); 

const parse = (yard) => 
  (_.isEmpty(yard.input) && _.isEmpty(yard.op)) 
    ? yard.output
  : _.pipe(shunt, parse)(yard);

const rpn = _.pipe(tokenize, initShunt, parse);

const rpnEvalStep = ({stack, in}) => 
  _.includes(_.first(in), operators)
    ?  { stack: [evalops[_.first(in)]()] }

console.log(rpn('1 + 34 * 67'));

