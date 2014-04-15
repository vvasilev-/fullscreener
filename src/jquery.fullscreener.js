;(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {

	'use strict';

	/**
	 * Variables.
	 * @type {Mixed}
	 */
	var $doc    = $(document);
	var $win    = $(window);
	var classes = {
		container: 'fsr-container',
		image    : 'fsr-image',
		hidden   : 'fsr-hidden'
	};

	/**
	 * Default settings.
	 * @type {Object}
	 */
	var defaults = {
		useCSS   : true,
		container: 'parent',
		position : {
			x: 'center',
			y: 'center'
		},
		throttleTimeout: 100
	};

	/**
	 * Check background-size support.
	 * @type {Boolean}
	 */
	var backgroundSize = 'backgroundSize' in document.createElement('div').style;

	/**
	 * Creates a new instance.
	 * @constructor
	 * @param  {DOM Element} image   
	 * @param  {Object}      options 
	 * @return {void} 
	 */
	var Fullscreener = function(image, options) {

		this.image  = image;
		this.$image = $(image);

		this.settings = $.extend({}, defaults, options);
		this.params   = {
			image: {
				width : null,
				height: null
			},
			container: {
				width : null,
				height: null
			},
			ratios: {
				image    : null,
				container: null
			}
		};

		if (this.settings.container === 'parent') {
			this.$container = this.$image.parent();
		} else if (this.settings.container instanceof jQuery && this.settings.container.length) {
			this.$container = this.settings.container;
		} else {
			this.log('The container is missing.');
			return;
		}

		this.id = this.uuid();

		this.init();

	}

	/**
	 * Shortcut to prototype.
	 */
	Fullscreener.fn = Fullscreener.prototype;

	/**
	 * Initializes the plugin's logic.
	 * @return {void} 
	 */
	Fullscreener.fn.init = function() {

		// add classes to elements
		this.$image.addClass(classes.image);
		this.$container.addClass(classes.container);

		// determine method
		if (backgroundSize && this.settings.useCSS) {
			this.setBackground();
		} else if (!backgroundSize || !this.settings.useCSS) {
			this.listen();
			this.resize();
		} else {
			this.log('No resize method.');
			return;
		}

	}

	/**
	 * Set image as background.
	 * @return {void} 
	 */
	Fullscreener.fn.setBackground = function() {

		var $image     = this.$image;
		var $container = this.$container;
		var pos        = this.settings.position;

		// hide image 
		$image.addClass(classes.hidden);

		// set image as background for container
		$container.css({
			'background-image'   : 'url(' + $image[0].src + ')',
			'background-position': pos.x + ' ' + pos.y
		});

	}

	/**
	 * Adds event listeners for resize & orientationchange.
	 * @return {void} 
	 */
	Fullscreener.fn.listen = function() {

		var _this = this;

		$win.on('resize.' + this.id + ' orientationchange.' + this.id, this.throttle(function() {
				_this.resize();
			},
			this.settings.throttleTimeout)
		);

	};

	/**
	 * Resizes the image.
	 * @return {void} 
	 */
	Fullscreener.fn.resize = function() {
		this.calcRatios();
		this.update();
	}

	/**
	 * Calculates the image and container ratio.
	 * @return {void} 
	 */
	Fullscreener.fn.calcRatios = function() {

		var $image     = this.$image;
		var $container = this.$container;
		var params     = this.params;

		var imageWidth, imageHeight, containerWidth, containerHeight;

		// calc the image ratio only once
		if (!params.ratios.image) {

			// width & height attributes check
			if (!$image.attr('width') || !$image.attr('height')) {
				this.log('The image should have width/height attributes.');
				return;
			}

			imageWidth  = parseInt($image.attr('width'), 10);
			imageHeight = parseInt($image.attr('height'), 10);

			params.ratios.image = imageHeight/imageWidth;
			params.image.width  = imageWidth;
			params.image.height = imageHeight;

		}

		containerWidth  = $container.width();
		containerHeight = $container.height();

		params.ratios.container = containerHeight/containerWidth;
		params.container.width  = containerWidth;
		params.container.height = containerHeight;

	}

	/**
	 * Updates the image position when useCSS is false or background-size is not supported.
	 * @return {void} 
	 */
	Fullscreener.fn.update = function() {

		var $image        = this.$image;
		var ratios        = this.params.ratios;
		var containerDims = this.params.container;
		var config        = this.settings;
		var props         = {
			width : 0,
			height: 0,
			top   : 'auto',
			right : 'auto',
			bottom: 'auto',
			left  : 'auto'
		};

		// calc the image dimensions
		if (ratios.image < ratios.container) {
			props.width  = containerDims.height / ratios.image;
			props.height = containerDims.height;
		} else {
			props.width  = containerDims.width;
			props.height = containerDims.width * ratios.image; 
		}

		// calc the image position
		switch (config.position.y) {
			case 'top': 
				props.top = 0;
			break;

			case 'bottom':
				props.bottom = 0;
			break;

			case 'center':
				props.top = (containerDims.height - props.height) / 2;
			break;

			default: 
				this.log('The vertical position cannot be calculated.');
				return;
		}

		switch (config.position.x) {
			case 'left':
				props.left = 0;
			break;

			case 'right':
				props.right = 0;
			break;

			case 'center':
				props.left = (containerDims.width - props.width) / 2;
			break;

			default: 
				this.log('The horizontal position cannot be calculated.');
				return;
		}

		$image.css(props);

	}

	/**
	 * Destroys the plugin instance.
	 * @return {void}
	 */
	Fullscreener.fn.destroy = function() {

		var $image     = this.$image;
		var $container = this.$container;

		// remove classes
		$image
			.removeClass(classes.hidden)
			.removeClass(classes.image)
			.removeAttr('style');

		$container
			.removeClass(classes.container)
			.removeAttr('style');

		// remove all event listeners
		$win.off('resize.' + this.id + ' orientationchange.' + this.id);

		// remove plugin data
		$image.removeData('fullscreener');

	}

	/**
	 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time. 
	 * Normally, the throttled function will run as much as it can, without ever going more than once per `wait` duration; 
	 * but if you'd like to disable the execution on the leading edge, 
	 * pass `{leading: false}`. To disable execution on the trailing edge, ditto.
	 * @param  {Function} func    
	 * @param  {Number}   wait    
	 * @param  {Object}   options 
	 * @return {Function}         
	 */
	Fullscreener.fn.throttle = function(func, wait, options) {

		var timeout  = null;
		var previous = 0;
		var options  = options || {};

		var context, args, result;

		function later() {
			previous = options.leading == false ? 0 : new Date;
			timeout  = null;
			result   = func.apply(context, args);
		}

		return function() {

			var now = new Date;
			var remaining;

			if (!previous && options.leading == false) {
				previous = now;
			}

			remaining = wait - (now - previous);
			context   = this;
			args      = arguments;

			if (remaining <= 0) {
				clearTimeout(timeout);

				timeout  = null;
				previous = now;
				result   = func.apply(context, args);
			} else {
				if (!timeout && options.leading != false) {
					timeout = setTimeout(later, remaining);
				}
			}

			return result;

		}

	}

	/**
	 * Generates an unique id.
	 * @return {String} 
	 */
	Fullscreener.fn.uuid = function() {
		return 'fsr' + parseInt(new Date().getTime() / 1000, 10);
	}

	/**
	 * Used for error notifications.
	 * @param  {String} message 
	 * @return {void}         
	 */
	Fullscreener.fn.log = function(message) {
		alert('Fullscreener ' + message);
	}

	/**
	 * Register the plugin.
	 * @param {Object|String} args 
	 * @return {jQuery Object} 
	 */
	$.fn.fullscreener = function(args) {

		return this.each(function() {

			var $image   = $(this);
			var instance = $image.data('fullscreener');

			if (!instance) {
				if (typeof args !== 'string') {
					$image.data('fullscreener', new Fullscreener(this, args));
				}
			} else {
				if (typeof args === 'string') {
					if (instance[args]) {
						instance[args]()
					} else {
						Fullscreener.fn.log('No valid method.');
					}
				}
			}

		});

	}

}));