class WheelZoom {
   image = null;
   container = null;
   window = null
   original = { image: {}, window: {} };
   options = null;
   correct_x = null;
   correct_y = null;

   constructor(image, options) {
      var defaults = {
         // drag scrollable image
         dragscrollable: true,
         // maximum allowed proportion of scale
         max_scale: 1,
         // image resizing speed
         speed: 10
      };

      this.image = image;
      this.options = options = Object.assign(defaults, options);

      if (this.image !== null) {
         // for window take just the parent
         this.window = this.image.parentNode;

         // if the image has already been loaded
         if (this.image.complete) {
            this._init();
         } else {
            // if suddenly the image has not loaded yet, then wait
            this.image.onload = () => {this._init()};
         }
      }
   }

   _init() {
      // original image sizes
      this.original.image = {
         width: this.image.offsetWidth,
         height: this.image.offsetHeight
      };

      // will move this container, and will center the image in it
      this.container = document.createElement('div');

      this.window.appendChild(this.container);
      this.container.appendChild(this.image);

      this._prepare();

      if (this.options.dragscrollable === true) {
         new DragScrollable(this.window);
      }

      this.window.addEventListener('mousewheel', this._rescale);

      window.addEventListener('resize', this._rescale);
   }

   _prepare() {
      // original window sizes
      this.original.window = {
         width: this.window.offsetWidth,
         height: this.window.offsetHeight
      };

      // minimum allowed proportion of scale
      var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);

      // calculate margin-left and margin-top to center the image
      this.correct_x = Math.max(0, (this.original.window.width - this.original.image.width * min_scale) / 2);
      this.correct_y = Math.max(0, (this.original.window.height - this.original.image.height * min_scale) / 2);

      // set new image dimensions to fit it into the container
      this.image.width = this.original.image.width * min_scale;
      this.image.height = this.original.image.height * min_scale;

      // center the image
      this.image.style.marginLeft = this.correct_x + 'px';
      this.image.style.marginTop = this.correct_y + 'px';

      this.container.style.width = (this.image.width + (this.correct_x * 2)) + 'px';
      this.container.style.height = (this.image.height + (this.correct_y * 2)) + 'px';

      if (typeof this.options.prepare === 'function') {
         this.options.prepare(min_scale, this.correct_x, this.correct_y);
      }
   }

   _rescale(event) {
      event.preventDefault();

      var delta = event.wheelDelta > 0 || event.detail < 0 ? 1 : -1;

      // the size of the image at the moment
      var image_current_width = this.image.width;
      var image_current_height = this.image.height;

      // current proportion of scale
      var scale = image_current_width / this.original.image.width;
      // minimum allowed proportion of scale
      var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);
      // new allowed proportion of scale
      var new_scale = scale + (delta / this.options.speed);

      new_scale = (new_scale < min_scale) ? min_scale : (new_scale > this.options.max_scale ? this.options.max_scale : new_scale);

      // scroll along the X axis before resizing
      var scroll_left_before_rescale = this.window.scrollLeft;
      // scroll along the Y axis before resizing
      var scroll_top_before_rescale = this.window.scrollTop;

      // new image sizes that will be set
      var image_new_width = this.image.width = this.original.image.width * new_scale;
      var image_new_height = this.image.height = this.original.image.height * new_scale;

      var container_new_width = image_new_width + (this.correct_x * 2);
      var container_new_height = image_new_height + (this.correct_y * 2);

      this.container.style.width = container_new_width + 'px';
      this.container.style.height = container_new_height + 'px';

      if (typeof this.options.rescale === 'function') {
         this.options.rescale(new_scale, this.correct_x, this.correct_y, min_scale);
      }

      // scroll on the X axis after resized
      var scroll_left_after_rescale = this.window.scrollLeft;
      // scroll on the Y axis after resized
      var scroll_top_after_rescale = this.window.scrollTop;

      var window_coords = _getCoords(this.window);

      var x = Math.round(event.pageX - window_coords.left + this.window.scrollLeft - this.correct_x);
      var new_x = Math.round(image_new_width * x / image_current_width);
      var shift_x = new_x - x;

      this.window.scrollLeft += shift_x + (scroll_left_before_rescale - scroll_left_after_rescale);

      var y = Math.round(event.pageY - window_coords.top + this.window.scrollTop - this.correct_y);
      var new_y = Math.round(image_new_height * y / image_current_height);
      var shift_y = new_y - y;

      this.window.scrollTop += shift_y + (scroll_top_before_rescale - scroll_top_after_rescale);
   }

   prepare() {
      this._prepare();
   }

   zoomUp() {
      var window_coords = _getCoords(this.window);

      var event = new Event('mousewheel');

      event.wheelDelta = 1;
      event.detail = -1;
      event.pageX = window_coords.left + (this.original.window.width / 2);
      event.pageY = window_coords.top + (this.original.window.height / 2);

      this._rescale(event);
   }

   zoomDown() {
      var window_coords = _getCoords(this.window);

      var event = new Event('mousewheel');

      event.wheelDelta = -1;
      event.detail = 1;
      event.pageX = window_coords.left + (this.original.window.width / 2);
      event.pageY = window_coords.top + (this.original.window.height / 2);

      this._rescale(event);
   }

   static create(selector, options) {
      return new WheelZoom(selector, options);
   }
};

/**
 * @class DragScrollable
 * @param {Element} scrollable
 * @constructor
 */
class DragScrollable {
   scrollable = null
   coords = null

   constructor(scrollable) {
      this.mouseUpHandler = this.mouseUpHandler.bind(this);
      this.mouseDownHandler = this.mouseDownHandler.bind(this);
      this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

      this.scrollable = scrollable;
      this.scrollable.addEventListener('mousedown', this.mouseDownHandler);
   }

   mouseDownHandler(event) {
      event.preventDefault();

      if (event.which != 1) {
         return false;
      }

      this.coords = { left: event.clientX, top: event.clientY };

      document.addEventListener('mouseup', this.mouseUpHandler);
      document.addEventListener('mousemove', this.mouseMoveHandler);
   }

   mouseUpHandler(event) {
      event.preventDefault();

      document.removeEventListener('mouseup', this.mouseUpHandler);
      document.removeEventListener('mousemove', this.mouseMoveHandler);
   }

   mouseMoveHandler(event) {
      event.preventDefault();

      this.scrollable.scrollLeft = this.scrollable.scrollLeft - (event.clientX - this.coords.left);
      this.scrollable.scrollTop = this.scrollable.scrollTop - (event.clientY - this.coords.top);

      this.coords = { left: event.clientX, top: event.clientY }
   }
}

/**
 * Get elemetn coordinates (with support old browsers)
 * @param {Element} element
 * @returns {{top: number, left: number}}
 */
function _getCoords(element) {
   var box = element.getBoundingClientRect();

   var body = document.body;
   var documentElement = document.documentElement;

   var scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
   var scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;

   var clientTop = documentElement.clientTop || body.clientTop || 0;
   var clientLeft = documentElement.clientLeft || body.clientLeft || 0;

   var top = box.top + scrollTop - clientTop;
   var left = box.left + scrollLeft - clientLeft;

   return {
      top: top,
      left: left
   };
}

export default WheelZoom
