export default class FileDrop {
    constructor(element, handler) {
       if (!handler || typeof handler !== "function") {
          throw Error("No file handler provided");
       }
 
       if (!element) {
          throw Error("No element provided");
       }
 
       element.addEventListener("dragenter", dragenter, false);
       element.addEventListener("dragover", dragover, false);
       element.addEventListener("drop", drop, false);
 
       function dragenter(e) {
          e.stopPropagation();
          e.preventDefault();
          console.log("dragenter");
       }
 
       function dragover(e) {
          e.stopPropagation();
          e.preventDefault();
          console.log("dragover");
       }
 
       function drop(e) {
          e.stopPropagation();
          e.preventDefault();
 
          let dt = e.dataTransfer;
          let files = dt.files;
          handleFiles(files);
       }
 
       function handleFiles(files) {
          if (files) {
             for (let i = 0; i < files.length; i++) {
                handler(files.item(i));
             }
          }
       }
    }
 }
 