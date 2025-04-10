// import { plugins } from '../apps/backend/config/plugin';


// test('plugins test', () => {
//     //   expect(sum(1, 2)).toBe(3);
//     console.log(plugins[0].AgentName)
// });

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
// 使用 describe 创建测试套件
describe('计算函数测试套件', () => {
    test('加法测试', () => {
      expect(1 + 2).toBe(3);
    });
    
    test('减法测试', () => {
      expect(5 - 2).toBe(3);
    });
  });