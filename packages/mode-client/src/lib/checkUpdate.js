export default async function checkUpdate() {
  const response = await fetch('/update/time');
  const time = await response.text();
  let ans = false;
  if (new Date().getTime() <= parseInt(time)) {
    ans = true;
  }
  return ans;
}
