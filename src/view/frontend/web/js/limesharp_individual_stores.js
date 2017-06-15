
define(['jquery', 'stockists_individual_stores', 'stockists_mapstyles'], function ($, config, mapstyles)
{
	return function (config)
	{
		$(document).ready(stockistsIndividualMain);

		function stockistsIndividualMain ()
		{
			config.storeDetails.latitude = parseFloat(config.storeDetails.latitude);
			config.storeDetails.longitude = parseFloat(config.storeDetails.longitude);

			mapElement = document.getElementById('map-canvas-individual');
			loadedMapStyles = mapstyles[config.map_styles];
			mapOptions = {
				zoom: config.zoom_individual, 
				scrollwheel: false,
				center: {lat: config.storeDetails.latitude, lng: config.storeDetails.longitude},
				styles: loadedMapStyles
			};

			map = new google.maps.Map(mapElement, mapOptions);

			image = {
				url: config.map_pin
			};

			latLng = new google.maps.LatLng(config.storeDetails.latitude, config.storeDetails.longitude);

			marker = new google.maps.Marker({
				position	: latLng
			,	map			: map
			,	icon		: image
			,	title		: config.storeDetails.name
			});

			if (config.otherStores && config.otherStoresSlider)
			{
				function initializeSlick ()
				{
					$(".all-stores-slider-wrapper").slick({
						dots			: true
					,	arrows			: true
					,	lazyLoad		: 'ondemand'
					,	slidesToShow	: 5
					,	slidesToScroll	: 4
					,	prevArrow		: '<button id="arrow-left" type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"><img src="' + config.slider_arrow + '" alt="Left" /></button>'
					,	nextArrow		: '<button id="arrow-right" type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"><img src="' + config.slider_arrow + '" alt="Right" /></button>'
					,	responsive		: [
							{
								breakpoint	: 1230
							,	settings	: {
									slidesToShow	: 4
								,	slidesToScroll	: 1
								,	infinite		: true
								,	dots			: true
								}
							},
							{
								breakpoint	: 1024
							,	settings	: {
									slidesToShow	: 3
								,	slidesToScroll	: 1
								,	infinite		: true
								,	dots			: true
								,	arrows			: false
								}
							},
							{
								breakpoint	: 768
							,	settings	: {
									slidesToShow	: 2
								,	slidesToScroll	: 1
								,	arrows			: false
								,	infinite		: true
								,	dots			: true
								}
							},
							{
								breakpoint	: 480
							,	settings	: {
									slidesToShow	: 1
								,	slidesToScroll	: 1
								,	arrows			: false
								,	infinite		: true
								,	dots			: true
								}
							}
						]
					});
				}

				if ( $(".all-stores-slider-wrapper").length )
				{
					initializeSlick();
				}
			}
		}
	}
});
