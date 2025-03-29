/**
 * 延迟执行
 * @param timeOut 
 * @returns 
 */
export const delay = (timeOut: number = 1000, callback?: () => void) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve(true);
    }, timeOut)
  })
}