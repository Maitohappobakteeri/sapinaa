export async function sleep(timeMS) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeMS);
  });
}
