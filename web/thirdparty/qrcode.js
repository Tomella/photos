// thirdparty/qrcode.js
import "/scripts/qrcode.js" // Now loaded as UMD module
export function toCanvas() {
   return QRCode.toCanvas(...arguments);
}

