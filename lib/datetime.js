export default class DateTime {
   #date
   #time

   constructor(data) {
      let date, time;
      if(typeof data == 'number') {
         let dateStr = new Date(data).toISOString();
         [date, time]  = dateStr.split(".")[0].split("T");
      } else {
         [date, time] = data.split(" ");
      }
      this.#date = date;
      this.#time = time;
   }

   toString() {
      return this.#date + " " + this.#time;
   }

   toISOString() {
      return this.#date + "T" + this.#time;
   }

   toJSON() {
      return this.toISOString();
   }
   
   toSqlString() {
      return "'" + this.toString() + "'";
   }

   equals(other) {
      return other && other.toString && this.toString() == other.toString()
   }
}
