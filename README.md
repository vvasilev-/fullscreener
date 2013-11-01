#jQuery Fullscreener#

A simple plugin for fullscreen backgrounds.

##How to use?##

1. Include the plugin files and jQuery library into your document:

    ```
    <link rel="stylesheet" href="fullscreener.css" />
    <script src="jquery-1.10.2.min.js"></script>
    <script src="jquery.fullscreener.min.js"></script>
    ```
    
2. Write your html:
    
    ```
    <div class="fullscreen">
    	<img src="image.jpg" width="1920" height="1200" alt="" />
    </div>
    ```
    **Note: Always set attributes for width and height of the image.**

3. Run the plugin:

    ```
    <script>
    
    	(function($){
    
    		$(document).ready(function(){
    
    			$('.fullscreen img').fullscreener();
    
    		});
    
    	})(jQuery);
    
    </script>
    ```
    
##Options##

####useCSS####

Background size will not be used for modern browsers.
* **default:** true
* **options:** true or false
* **type:** Boolean

###container###

Container that will be used when the image is resized.
* **default:** 'parent'
* **options:** 'parent' or jQuery Object(e.g. $(window))
* **type:** String or jQuery Object

###position###

This parameter controls the position of the image on the X and Y axis.
* **default:** { x: 'center', y: 'center' }
* **options:** { x: **'left, center, right'**, y: **'top, center, bottom'** }
* **type:** Object

###throttleTimeout###

Controls how often performs resizing the image in case of window.resize or window.orientationchange.
* **default:** 100
* **type:** Number

##Methods##

###resize###

Manually resize the picture.
```
$('.fullscreen img').fullscreener('resize');
```

###destroy###

Destroys plugin for this image.
```
$('.fullscreen img').fullscreener('destroy');
```
