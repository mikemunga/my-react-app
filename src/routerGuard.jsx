
const SAFE_INTERNAL_ROUTE_REGEX =/^\/(?!\/)/;

export default function filteredRedirectUrl (requestUrl, fallback = '/'){
if(!requestUrl) return fallback;

let urlObj;
let isRelative = false;
try {
  if (requestUrl.startsWith('http://') || requestUrl.startsWith('https://')){
    urlObj = new URL(requestUrl)
  } else {
    urlObj = new URL(requestUrl, 'htttp://localhost');
    isRelative = true;
  }
  }catch(error){
  console.log('Initial URL parsing failed, using fallback', error);
  return fallback;
  }

  let rawTargetParam = urlObj.searchParams.get('redirectTo');
  if(!rawTargetParam && isRelative) {
    rawTargetParam = urlObj.pathname + urlObj.search
  }

  if (!rawTargetParam) {
    return fallback;
  }

  try {
    const decodedRoute = decodeURIComponent(rawTargetParam);
    const cleanRoute = decodedRoute.replace(/\/+/g,'/')
    const isSafePath = SAFE_INTERNAL_ROUTE_REGEX.test(cleanRoute);
      
  if(isSafePath) {
    return cleanRoute;
  }else {
    console.log(`Router level: Defend againt unathorized redirect to ${rawTargetParam}`);
  }
  }catch (error) {
    console.log('Error Level: Discarded a corrupted URL tracking parameter.', error);
  }
  return fallback
}
