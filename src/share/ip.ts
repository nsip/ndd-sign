const IP = "127.0.0.1"

// modify '/etc/hosts' if dev & debug at local
export const Domain = "data-dictionary.test"

// WITH nginx service, port number is in nginx config (proxy_pass). THEN
export const URL_API = `http://api.${Domain}`;   // "1323"
export const URL_SIGN = `http://${Domain}`;      // "8080"
export const URL_VIEW = `http://view.${Domain}`; // "8081"
export const URL_CMS = `http://cms.${Domain}`;   // "8082"

// WITHOUT nginx, ONLY set /etc/hosts e.g. '127.0.0.1  api.data-dictionary.test'. THEN
// export const URL_API = `http://api.${Domain}:1323`;

// WITHOUT nginx, NO set /etc/hosts. THEN
// export const URL_API = `http://127.0.0.1:1323`;

