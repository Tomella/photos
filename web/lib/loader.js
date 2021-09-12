export default async function (url) {
   let fetcher = await fetch(url);
   let response = await fetcher.json();
   return response;
}
