export async function sleep(timeMS: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeMS);
  });
}
