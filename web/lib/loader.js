const _CACHE = {};

export default function(url, cacheable) {
   return new Promise((resolve, reject) => {
      if(cacheable && _CACHE[url]) {
         resolve(_CACHE[url]);
         return;
      }

      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'json';
      xhr.onload = () => {
         if (xhr.status !== 200) return;
         let response = xhr.response;
         if(cacheable) {
            _CACHE[url] = response;
         }
         resolve(response);
      };
      xhr.send();
   });
}
