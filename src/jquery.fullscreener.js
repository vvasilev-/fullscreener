/**
 * @name jQuery Fullscreener
 * @license MIT 
 * @version 1.0
 */
!(function(window, document, $, undefined){

	/**
	 * plugin variables
	 */
	var $win = $(window),
		$doc = $(document),
		cssClasses = {
			container: 'fsr-container',
			element: 'fsr-element',
			hidden: 'fsr-hidden'
		},
		Fullscreener, defaults, supportBgSize;

	/**
	 * plugin defaults
	 */
	defaults = {
		useCSS: true,
		container: 'parent',
		position: {
			x: 'center',
			y: 'center'
		},
		throttleTimeout: 100
	};

	/**
	 * check background size support
	 */
	supportBgSize = 'backgroundSize' in document.createElement('div').style;

	/**
	 * @constructor
	 * @param {jQuery Object} element 
	 * @param {Object} options 
	 */
	Fullscreener = function(element, options){

		// save reference to element
		this.element = element;
		this.$element = $(element);

		// extend defaults
		this.settings = $.extend({}, defaults, options);

		// create params
		this.params = {
			element: {
				width: null,
				height: null
			},
			container: {
				width: null,
				height: null
			},
			ratios: {
				container: null,
				element: null
			}
		};

		// save reference to container
		if (this.settings.container == 'parent') {
			this.$container = this.$element.parent();
		} else {
			if (this.settings.container instanceof jQuery && this.settings.container.length) {
				this.$container = this.settings.container;
			}
		}

		// throw error for missing container
		if (!this.$container.length) {

			this.notify('The container was not found!');
			return;

		}

		// call init method
		this.init();

	};

	Fullscreener.fn = Fullscreener.prototype;
	Fullscreener.fn.constructor = Fullscreener;

	/**
	 * @method init
	 */
	Fullscreener.fn.init = function(){

		// add class to element
		this.$element.addClass(cssClasses.element);
		this.$container.addClass(cssClasses.container);

		// set image as background and use background size
		if (supportBgSize && this.settings.useCSS) {
			this.setBackground();
		} else {
			if (!supportBgSize || !this.settings.useCSS) {

				this.listen();
				this.resize();
				
			}
		}

	};

	/**
	 * @method listen
	 */
	Fullscreener.fn.listen = function(){

		// save reference to constructor
		var _this = this;

		$win.on('resize.fullscreener orientationchange.fullscreener', this.throttle(function(){

			_this.resize();

		}, this.settings.throttleTimeout));

	};

	/**
	 * @method setBackground
	 */
	Fullscreener.fn.setBackground = function(){

		// shortcuts
		var $element = this.$element,
			$container = this.$container;

		// update classes
		$element.addClass(cssClasses.hidden);

		// update container background
		$container.css('background-image', 'url(' + $element[0].src + ')');

	};

	/**
	 * @method calcRatios
	 */
	Fullscreener.fn.calcRatios = function(){

		// shortcuts
		var $element = this.$element,
			$container = this.$container,
			params = this.params;

		if (!params.ratios.element) {

			// check for width & height attributes
			if (!$element.attr('width') || !$element.attr('height')) {

				this.notify('The image should have width/height attributes!');
				return;

			}

			// dimensions
			var elementWidth = parseInt($element.attr('width'), 10),
				elementHeight = parseInt($element.attr('height'), 10);

			// calculate
			params.ratios.element = elementHeight/elementWidth;

			params.element.width = elementWidth;
			params.element.height = elementHeight;

		} 

		// dimensions
		var containerWidth = $container.width(),
			containerHeight = $container.height();

		// calculate
		params.ratios.container = containerHeight/containerWidth;

		params.container.width = containerWidth;
		params.container.height = containerHeight;

	};

	/**
	 * @method update
	 */
	Fullscreener.fn.update = function(){

		// shortcuts
		var $element = this.$element,
			params = this.params,
			settings = this.settings,
			props = {
				width: 0,
				height: 0,
				top: 'auto',
				right: 'auto',
				bottom: 'auto',
				left: 'auto'
			};

		// calculate dimensions
		if (params.ratios.element < params.ratios.container) {

			props.height = params.container.height;
			props.width = params.container.height / params.ratios.element;

		} else {

			props.height = params.container.width * params.ratios.element;
			props.width = params.container.width;

		}

		// calculate position
		switch (settings.position.y) {

			case 'top':
				props.top = 0;
			break;

			case 'bottom': 
				props.bottom = 0;
			break;

			case 'center': 
			default:
				props.top = (params.container.height - props.height)/2;
			break;

		}

		switch (settings.position.x) {

			case 'left':
				props.left = 0;
			break;

			case 'right': 
				props.right = 0;
			break;

			case 'center': 
			default:
				props.left = (params.container.width - props.width)/2;
			break;

		}

		// update css properties 
		$element.css(props);

	};

	/**
	 * @method throttle
	 * @param {Function} func 
	 * @param {Number} wait 
	 * @param {Object} options 
	 */
	Fullscreener.fn.throttle = function (func, wait, options){

		var context, args, result;
		var timeout = null,
			previous = 0;

		options || (options = {});

		function later(){

			previous = options.leading == false ? 0 : new Date;
			timeout = null;
			result = func.apply(context, args);

		};

		return function(){

			var now = new Date;

			if (!previous && options.leading == false) {
				previous = now;
			}

			var remaining = wait - (now - previous);

			context = this;
			args = arguments;

			if (remaining <= 0) {

				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);

			} else {
				if (!timeout && options.trailing != false) {
					timeout = setTimeout(later, remaining);
				}
			}

			return result;

		};

	};

	/**
	 * @method resize
	 */
	Fullscreener.fn.resize = function(){

		this.calcRatios();
		this.update();

	};

	/**
	 * @method destroy
	 */
	Fullscreener.fn.destroy = function(){

		this.$element.removeClass(cssClasses.hidden).removeClass(cssClasses.element).removeAttr('style');
		this.$container.removeClass(cssClasses.container).removeAttr('style');
		this.$element.removeData('fullscreener');

	};

	/**
	 * @method notify
	 * @param {String} message 
	 */
	Fullscreener.fn.notify = function(message){
		alert('Fullscreener: ' + message);
	};

	/**
	 * @extends jQuery.fn
	 * @param {Object|String} args 
	 */
	$.fn.fullscreener = function(args){

		return this.each(function(){

			// save reference to the element and plugin instance
			var $this = $(this),
				instance = $this.data('fullscreener');

			if (!instance) {
				$this.data('fullscreener', new Fullscreener(this, args));
			} else {

				if (typeof args == 'string') {

					if (instance[args]) {
						instance[args]()
					} else {
						Fullscreener.fn.notify('This is not a valid method!');
					}

				}

			}

		});

	};

})(window, document, jQuery);