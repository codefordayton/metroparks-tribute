var Retina = Retina || {};

Retina = {
  init: function() {
    var images = document.querySelectorAll("img[data-1x]");
    if (Retina.isRetina() == true) {
      Array.prototype.forEach.call(images, function(el, i) {
        var src = el.getAttribute("data-2x");
        el.setAttribute("src", src);
      });
    } else {
      Array.prototype.forEach.call(images, function(el, i) {
        var src = el.getAttribute("data-1x");
        el.setAttribute("src", src);
      });
    }
  },

  isRetina: function() {
    if (window.devicePixelRatio == 2) {
      return true;
    } else {
      return false;
    }
  } 
};
 