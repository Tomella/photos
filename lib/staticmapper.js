import express from "express";

class StaticMapper {
   constructor(app, base, root, mappings) {
      mappings.forEach(element => {
         app.use(base + element.url, express.static(root + element.path));
      });
   }
}

export default StaticMapper
