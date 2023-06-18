import asyncPool from 'tiny-async-pool'
export const tinyAsyncPoolAll = async <In, R>(
  arr: In[],
  fn: (v: In) => Promise<R>,
  { concurrency = 10 } = {}
): Promise<R[]> => {
  const out: R[] = []
  for await (const res of asyncPool(concurrency, arr, fn)) {
    out.push(res)
  }
  return out
}
