export default async function (url, options = {}) {
   let fetcher = await fetch(url);
   let response = await fetcher.json();
   return response;
}
