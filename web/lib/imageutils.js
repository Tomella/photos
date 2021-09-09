
function getRenderedSize(contains, cWidth, cHeight, width, height, posX, posY) {
   let oRatio = width / height,
      cRatio = cWidth / cHeight;
   let response = {};

   if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
      response.width = cWidth;
      response.height = cWidth / oRatio;
   } else {
      response.width = cHeight * oRatio;
      response.height = cHeight;
   }
   response.posX = posX / 100;
   response.posY = posY / 100;
   response.left = (cWidth - response.width) * (posX / 100);
   response.right = response.width + response.left; // From left
   response.top = (cHeight - response.height) * (posY / 100);
   response.bottom = response.height + response.top; // From top
   response.aspectRatio = oRatio;
   response.containerWidth = cWidth;
   response.containerHeight = cHeight;
   return response;
}

function imageInfo(img) {
   var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
   return getRenderedSize(true,
      img.width,
      img.height,
      img.naturalWidth,
      img.naturalHeight,
      parseInt(pos[0]),
      parseInt(pos[1]));
}

export default imageInfo;
