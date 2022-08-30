export const TimeoutError = Symbol("Timeout Error");

export async function addTimeout<T>(
  prom: Promise<T>,
  time: number
): Promise<T> {
  let timer: number;
  return Promise.race([
    prom,
    new Promise<T>(
      (_r, rej) => (timer = setTimeout(rej.bind(null, TimeoutError), time))
    ),
  ]).finally(() => clearTimeout(timer));
}
