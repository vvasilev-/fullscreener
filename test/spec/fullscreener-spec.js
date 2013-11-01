describe('jQuery Fullscreener', function(){

	beforeEach(function(){
		$('body').append( $('<div />', { 'class': 'test'}).append( $('<img />', { 'src': 'http://placehold.it/350x150' }).attr('width', 350).attr('height', 150) ) );
	});

	afterEach(function(){
		$('.test').remove();
	});

	it('should extend jQuery.fn', function(){
		expect( $.isFunction($.fn.fullscreener) ).toBeTruthy();
	});

	it('should save plugin instance via jQuery.data method', function(){

		var $img = $('.test img').fullscreener();

		expect( $img.data('fullscreener') != undefined ).toBeTruthy();

	});

	it('should extend plugin defaults with user options', function(){

		var $img = $('.test img').fullscreener({
			useCSS: false
		});

		expect( $img.data('fullscreener').settings.useCSS ).toBeFalsy();

	});

	it('should use parent container by default', function(){

		var $img = $('.test img').fullscreener();

		expect( $img.data('fullscreener').$container.hasClass('test') ).toBeTruthy();

	});

	it('should accept jQuery Object for container', function(){

		var $img = $('.test img').fullscreener({
			container: $(window)
		});

		expect( $img.data('fullscreener').$container.is($(window)) ).toBeTruthy();

	});

	it('should use image as background when background-size is supported and useCSS is true', function(){

		var $img = $('.test img').fullscreener();

		expect( $img.data('fullscreener').$container.css('background-image').indexOf('http://placehold.it/350x150') > -1 ).toBeTruthy();

	});

	it('should calculate ratios', function(){

		var $img = $('.test img').fullscreener({
			useCSS: false
		});

		expect( $img.data('fullscreener').params.ratios.element != null ).toBeTruthy();
		expect( $img.data('fullscreener').params.ratios.container != null ).toBeTruthy();

	});

	it('should update image css', function(){

		var $img = $('.test img').fullscreener({
			useCSS: false,
			position: {
				x: 'right',
				y: 'top'
			}
		});

		expect( $img.attr('style') != undefined ).toBeTruthy();

	});

	it('should remove all saved data when destroy method is called', function(){

		var $img = $('.test img').fullscreener();

		$img.fullscreener('destroy');

		expect( $img.data('fullscreener') == undefined ).toBeTruthy();

	});

});