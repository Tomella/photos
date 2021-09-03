export default class LocalTime {
   static MONTHS = {
      "01": {number: 1, str: "January", short: "JAN"}, 
      "02": {number: 2, str: "February", short: "FEB"}, 
      "03": {number: 3, str: "March", short: "MAR"}, 
      "04": {number: 4, str: "April", short: "APR"}, 
      "05": {number: 5, str: "May", short: "MAY"}, 
      "06": {number: 6, str: "June", short: "JUN"}, 
      "07": {number: 7, str: "July", short: "JUL"}, 
      "08": {number: 8, str: "August", short: "AUG"}, 
      "09": {number: 9, str: "September", short: "SEP"}, 
      "10": {number: 10, str: "October", short: "OCT"}, 
      "11": {number: 11, str: "November", short: "NOV"}, 
      "12": {number: 12, str: "December", short: "DEC"}
   };

   static DATE_POSTFIX = ["", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];

   static leadingZero(int) {
      return (int <  9 ? "0" : "" ) + int.toString(); 
   }

   static toAmPmHour(hour) {
      if(hour < 13 && hour > 0) return hour;
      if(hour === 0) return 12;
      return hour - 12;
   }

   static getAmPmSuffix(hour) {
      return (hour < 12) ? "AM" : "PM";
   }

   constructor(str) {
      this.str = str;
      // 2021-01-24T14:41:30.000Z
      let parts = str.split("T");
      if(parts.length == 2) {
         let date = parts[0].split("-");
         if(date.length == 3) {
            this.year = +date[0];
            this.month = LocalTime.MONTHS[date[1]];
            this.date = parseInt(date[2], 10);
         }

         let time = parts[1].substr(0,8).split(":");
         if(time.length == 3) {
            this.hour = parseInt(time[0], 10);
            this.minute = parseInt(time[1], 10);
            this.second = parseInt(time[2], 10);
         } 
      }
   }

   toString() {
      return this.str;
   }

   get longStr() {
      let buffer = [];
      buffer.push(this.date + LocalTime.DATE_POSTFIX[this.date]);
      buffer.push(this.month.str);
      buffer.push(this.year);
      buffer.push("");

      let str = buffer.join(" ");
      buffer = [];
      buffer.push(LocalTime.toAmPmHour(this.hour));
      buffer.push(LocalTime.leadingZero(this.minute));
      buffer.push(LocalTime.leadingZero(this.second));
      str += buffer.join(":") + ' ' + LocalTime.getAmPmSuffix(this.hour);
      return str;
   }
}
