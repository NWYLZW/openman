import { example } from '@openman/cli'

describe('demo', function () {
  this.timeout(30 * 1000)
  it('should work', async function () {
    await example()
  });
})
