import { runTests } from './sodobiz.test';

console.log('====================================================');
console.log('Running SodoBiz Bridge Automated Test Suite');
console.log('====================================================\n');

const { passed, failed, results } = runTests();

results.forEach((r) => {
  const symbol = r.status === 'PASS' ? '✅' : '❌';
  console.log(`${symbol} [${r.status}] ${r.name}`);
  if (r.error) {
    console.error(`   Error: ${r.error}`);
  }
});

console.log('\n----------------------------------------------------');
console.log(`Summary: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
