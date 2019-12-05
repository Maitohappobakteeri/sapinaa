
export async function sleep(timeMS) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeMS);
  });
}

export async function loop(fun, timeBetweenLoops) {
  fun();
  setTimeout(fun, timeBetweenLoops);
}
