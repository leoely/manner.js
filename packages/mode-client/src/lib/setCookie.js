export default function setCookie(response) {
  const cookie = response.headers.get('cookie');
  if (cookie !== null) {
    if (cookie === '') {
      document.cookie.split(';').forEach((c) => {
        const [k, v] = c.split('=');
        const [namespace] = k.split('_');
        if (namespace === 'user') {
          document.cookie = k + '=' + v;
        }
        window.localStorage.set(k, v);
      });
    } else {
      cookie.split(';').forEach((c) => {
        document.cookie=c;
      });
    }
  }
}
