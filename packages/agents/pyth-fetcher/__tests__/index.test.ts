// import { ZodError } from 'zod';
// import { PythFetcherAgent } from '../src/index';

// describe('PythFetcherAgent', () => {
//   let agent: PythFetcherAgent;

//   beforeEach(() => {
//     agent = new PythFetcherAgent();
//   });

//   it('should fetch price data successfully', async () => {
//     const result = await agent.get_prices({
//       symbols: ['Crypto.BTC/USD', 'Crypto.ETH/USD']
//     });

//     // Check the structure of the response
//     expect(result).toBeDefined();
//     expect(Array.isArray(result.parsed)).toBe(true);

//     // Each item should have the expected structure
//     result.parsed.forEach(item => {
//       expect(item).toHaveProperty('id');
//       expect(item).toHaveProperty('price');
//     });
//   });

//   it('should handle invalid symbols gracefully', async () => {
//     expect(() => agent.get_prices({
//       symbols: ['InvalidSymbol' as any]
//     })).toThrow(ZodError)
//   });
// });

test('two plus two is four111', () => {
  expect(2 + 2).toBe(4);
});