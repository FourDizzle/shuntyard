const calculate = require('./side-effects');
const readline = require('readline');

var rl = readline.createInterface(process.stdin, process.stdout)
const getInput = () => {
  const exit = ['quit', 'q', 'exit', 'done', 'stop', ':q'];
  rl.question('> ', (eq) => {
    if (exit.includes(eq)) {
      process.exit();
    } else {
      try {
        let ans = calculate(eq); 
        let output = (typeof ans === 'number') ? ans : 'error';
        console.log(`  :: ${output}`);
        getInput();
      } catch {
        console.log('  :: error');
        getInput();
      }
    }
  });
}

//console.log(calculate('5+7*2'));

let run = true;
if (run) {
  run = false;
  getInput();
}
