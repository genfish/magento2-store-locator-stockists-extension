
define(['jquery', 'limesharp_stockists', 'stockists_countries', 'stockists_mapstyles'], function ($, config, country_list, mapstyles)
{
	var map;
	markers = [];

	return function (config)
	{
		$(document).ready(stockistsMain);

		// function getCountryCode ()
		// {
		// 	for (var i = 0, len = country_list.length; i < len; i++)
		// 	{
		// 		if ( country_list[i].name.toUpperCase() == address.toUpperCase() )
		// 			return country_list[i].code;
		// 	}
		// }

		// after the user has shared his geolocation, center map, insert marker and show stores

		function centerMap (coords, markers)
		{
			searchCoords(coords);
		}

		function changeMarker (id)
		{
			for (i = 0; i < markers.length; i++)
			{ 
				if (markers[i].data_info.id == id)
				{
					google.maps.event.trigger(markers[i], 'click');
				}
			}
		}

		function clickCity (e)
		{
			elem = $(e.currentTarget);

			active = elem.closest('li').hasClass('active');

			elem.closest('li').removeClass('active');

			if ( active )
			{
				elem.closest('ul').removeClass('active');

				$('.stockists-results .results-store').removeClass('active').empty();
				$('.stockists-results').prev().addClass('hidden');
			}
			else
			{
				elem.closest('li').addClass('active');
				elem.closest('ul').addClass('active');

				city = $(e.currentTarget).text();
				getStores(city);
			}

			return false;
		}

		function clickVehicleType (e)
		{
			elem = $(e.currentTarget).closest('li');

			active = elem.hasClass('active');

			elem.closest('ul').find('li').removeClass('active');
			elem.closest('ul').find('input').val(0);
			elem.closest('ul').find('span').removeClass('fa-check-square').addClass('fa-square');

			if ( !active )
			{
				elem.addClass('active');
				elem.find('input').val(1);
				elem.find('span').addClass('fa-check-square');

				getStoresMap();
			}

			return false;
		}

		function changeRenting (e)
		{
			getStoresMap();
		}

		function clickProvince (e)
		{
			elem = $(e.currentTarget);

			active = elem.closest('li').hasClass('active');

			elem.closest('li').removeClass('active');

			if ( active )
			{
				elem.closest('ul').removeClass('active');

				$('.navbar-city').removeClass('active').empty();
				$('.navbar-city').prev().addClass('hidden');

				$('.stockists-results .results-store').removeClass('active').empty();
				$('.stockists-results').prev().addClass('hidden');
			}
			else
			{
				elem.closest('li').addClass('active');
				elem.closest('ul').addClass('active');

				province = elem.text();
				getCities(province);
			}

			return false;
		}

		function clickStockist (e)
		{
			li = $(e.currentTarget).closest('.results-content');
			isActive = li.hasClass('active');

			$('.results-store .results-content').removeClass("active");

			if ( isActive )
			{
				$('.results-store').removeClass('active');
			}
			else
			{
				id = li.data('marker');
				changeMarker(id);
			}

			return false;
		}

		function getCities (province)
		{
			turismo = $('#type-turismo').val();
			moto = $('#type-moto').val();
			camion = $('#type-camion').val();
			agricola = $('#type-agricola').val();
			renting = $('#renting').is(':checked');

			if (turismo == 1)
				url = '?turismo=1';
			else if (moto == 1)
				url = '?moto=1';
			else if (camion == 1)
				url = '?camion=1';
			else if (agricola == 1)
				url = '?agricola=1';

			if (renting)
				url += '&renting=1';

/*ONLY CODE STORE IN URL*/
store = "";
stores = ['/es', '/ca', '/en', '/de'];

for (i = 0; i < stores.length; i++)
{
	if ( window.location.pathname.search(stores[i]) != -1 )
	{
		store = stores[i];
		break;
	}
}
/*END CODE*/

			url = window.location.protocol + "//" + window.location.host + store + "/" + 'stockists' + '/ajax/stores' + url + '&type=city&region=' + province;

			$.ajax({
				dataType: 'json'
			,	url		: url
			}).done(function(response) {

				$('.navbar-city').empty();

				for (i = 0; i < response.length; i++)
				{
					data = response[i];
					$('.navbar-city').append('<li><a href="/' + config.moduleUrl + '/' + data["city"] + '">' + data["city"] + '</a></li>');
				}

				$('.navbar-city a').on("click", clickCity);

				$('.navbar-city').prev().removeClass('hidden');
			});
		}

		function getProvince ()
		{
			$('.navbar-province').removeClass('active').empty();
			$('.navbar-province').prev().addClass('hidden');

			$('.navbar-city').removeClass('active').empty();
			$('.navbar-city').prev().addClass('hidden');

			$('.stockists-results .results-store').removeClass('active').empty();
			$('.stockists-results').prev().addClass('hidden');

			turismo = $('#type-turismo').val();
			moto = $('#type-moto').val();
			camion = $('#type-camion').val();
			agricola = $('#type-agricola').val();
			renting = $('#renting').is(':checked');

			if (turismo == 1)
				url = '?turismo=1';
			else if (moto == 1)
				url = '?moto=1';
			else if (camion == 1)
				url = '?camion=1';
			else if (agricola == 1)
				url = '?agricola=1';

			if (renting)
				url += '&renting=1';

/*ONLY CODE STORE IN URL*/
store = "";
stores = ['/es', '/ca', '/en', '/de'];

for (i = 0; i < stores.length; i++)
{
	if ( window.location.pathname.search(stores[i]) != -1 )
	{
		store = stores[i];
		break;
	}
}
/*END CODE*/

			url = window.location.protocol + "//" + window.location.host + store + "/" + 'stockists' + '/ajax/stores' + url + '&type=region';

			$.ajax({
				dataType: 'json'
			,	url		: url
			}).done(function(response) {

				for (i = 0; i < response.length; i++)
				{
					data = response[i];
					$('.navbar-province').append('<li><a href="/' + config.moduleUrl + '/' + data["region"] + '">' + data["region"] + '</a></li>');
				}

				$('.navbar-province a').on("click", clickProvince);

				$('.navbar-province').prev().removeClass('hidden');

			});
		}

		function getStores (city)
		{
			turismo = $('#type-turismo').val();
			moto = $('#type-moto').val();
			camion = $('#type-camion').val();
			agricola = $('#type-agricola').val();
			renting = $('#renting').is(':checked');

			if (turismo == 1)
				url = '?turismo=1';
			else if (moto == 1)
				url = '?moto=1';
			else if (camion == 1)
				url = '?camion=1';
			else if (agricola == 1)
				url = '?agricola=1';

			if (renting)
				url += '&renting=1';

/*ONLY CODE STORE IN URL*/
store = "";
stores = ['/es', '/ca', '/en', '/de'];

for (i = 0; i < stores.length; i++)
{
	if ( window.location.pathname.search(stores[i]) != -1 )
	{
		store = stores[i];
		break;
	}
}
/*END CODE*/

			url = window.location.protocol + "//" + window.location.host + store + "/" + 'stockists' + '/ajax/stores' + url + '&city=' + city;

			$.ajax({
				dataType: 'json'
			,	url		: url
			}).done(function(response) {

				$('.stockists-results').prev().removeClass('hidden');

				data = response[0];

				address = data['city'];
				searchAddress(address);

			});
		}

		// get the stores from admin stockists/ajax/stores
		function getStoresMap ()
		{
			turismo = $('#type-turismo').val();
			moto = $('#type-moto').val();
			camion = $('#type-camion').val();
			agricola = $('#type-agricola').val();
			renting = $('#renting').is(':checked');

			if (turismo == 1)
				url = '?turismo=1';
			else if (moto == 1)
				url = '?moto=1';
			else if (camion == 1)
				url = '?camion=1';
			else if (agricola == 1)
				url = '?agricola=1';

			if (renting)
				url += '&renting=1';

/*ONLY CODE STORE IN URL*/
store = "";
stores = ['/es', '/ca', '/en', '/de'];

for (i = 0; i < stores.length; i++)
{
	if ( window.location.pathname.search(stores[i]) != -1 )
	{
		store = stores[i];
		break;
	}
}
/*END CODE*/

			url = window.location.protocol + "//" + window.location.host + store + "/" + 'stockists' + '/ajax/stores' + url;

			$.ajax({
				dataType: 'json'
			,	url		: url
			}).done(initialize);
		}

		function initialize (response)
		{
			var mapElement = document.getElementById('map-canvas');
			var loadedMapStyles = mapstyles[config.map_styles];
			var mapOptions = {
				zoom: config.zoom, 
				scrollwheel: false,
				center: {lat: config.latitude, lng: config.longitude},
				styles: loadedMapStyles
			};

			map = new google.maps.Map(mapElement, mapOptions);
			var directionsService = new google.maps.DirectionsService();
			var directionsDisplay = new google.maps.DirectionsRenderer();
			directionsDisplay.setMap(map);

			var image = {
				url: config.map_pin
			};

			var length = response.length;

			markers = [];

			for (var i = 0; i < length; i++)
			{
				var data = response[i];

				var latLng = new google.maps.LatLng(data.latitude, data.longitude);

				var marker = new google.maps.Marker({
					data_info	: {
						id 			: "" + data.latitude + data.longitude
					,	name		: data.name
					,	address		: data.address
					,	city		: data.city
					,	postcode	: data.postcode
					,	country		: data.country
					,	region		: data.region
					,	phone		: data.phone
					,	email		: data.email
					,	schedule	: data.schedule
					,	url			: data.link
					,	turismo		: data.turismo
					,	moto		: data.moto
					,	camion		: data.camion
					,	agricola	: data.agricola
					}
				,	position	: latLng
				,	map			: map
				,	icon		: image
				,	title		: data.name
				});
				markers.push(marker);

				openStockist(marker);

			}
			getProvince();

			if (config.geolocation && navigator.geolocation)
			{
				getGeoLocation();
			}

			// on click location ask for geolocation and show stores
			if (navigator.geolocation)
			{
				$(document).on("click", ".ind-my-location", function() {
					getGeoLocation();
				});
			}

			// attach click events for directions
			if (navigator.geolocation)
				$(".get-directions").on("click", clickGetDirections);
		}

		function listStockists (zoom, latLng)
		{
			$(".stockists-results .results-store").empty();

			map.setZoom(zoom);
			map.setCenter(latLng);

			// marker = new google.maps.Marker({
			// 	map: map
			// ,	position: latLng
			// });

			circle = new google.maps.Circle({
				map: map
			,	radius: config.radius
			,	fillColor: config.fillColor
			,	fillOpacity: config.fillOpacity
			,	strokeColor: config.strokeColor
			,	strokeOpacity: config.strokeOpacity
			,	strokeWeight: config.strokeWeight
			});
			circle.bindTo('center', marker, 'position');

			isActive = false;

			for (i = 0; i < markers.length; i++)
			{
				distance = google.maps.geometry.spherical.computeDistanceBetween(latLng, markers[i].position);

				if (distance < config.radius)
				{
					if (config.unit == "default")
					{
						storeDistance = parseFloat(distance * 0.001).toFixed(2);
						unitOfLength = "km";
					}
					else if (config.unit == "miles")
					{
						storeDistance = parseFloat(distance * 0.000621371192).toFixed(2);
						unitOfLength = "m";
					}

					if ( parseInt(storeDistance) == 0)
					{
						isActive = true;
						class_active = ' active';
						text_storeDistance = '';
					}
					else
					{
						class_active = '';
						text_storeDistance = ' - ' + storeDistance + " " + unitOfLength;
					}

					if (config.moduleUrl == 'centros-el-paso')
						fillColor = '#ffa300';
					else
						fillColor = '#f6d000';

					url = window.location.protocol + "//" + window.location.host + "/" + config.moduleUrl + "/" + markers[i].data_info.url;

					contentToAppend = '<li class="results-content loaded-results' + class_active + '" data-miles="' + storeDistance + '" data-marker="' + markers[i].data_info.id + '">';
						contentToAppend += '<a href="' + url + '" class="address">';
							contentToAppend += '<span class="label">' + markers[i].data_info.city + text_storeDistance + '</span>';
							contentToAppend += markers[i].data_info.address;
							contentToAppend += '<span class="stockists-services">';

								if (markers[i].data_info.turismo == 1)
									contentToAppend += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 40 17"><path fill="' + fillColor + '" fill-rule="evenodd" d="M39.4702303,10.2431123 C39.4049454,9.91352423 39.2315235,9.57099425 38.8717376,9.47004713 C38.8596584,8.28514075 38.7543973,7.3050046 38.5087881,6.53941704 C38.4213581,6.26591074 38.311783,5.81869486 38.1875404,5.61277424 L6.32621322,5.61277424 C4.42058466,6.02317749 2.57707741,6.75511601 1.34126608,7.25496244 C0.488536125,7.6012312 0.118396681,8.79821672 0.0956763893,9.95148724 C-0.374547379,10.179553 -0.444721446,10.8364282 -0.456800589,11.2833565 C-0.47980848,12.0469309 -0.28366621,13.0535261 -0.0587640777,13.6390769 C0.119834675,14.0992348 0.381261834,14.3618123 0.944955159,14.4368756 L2.69211687,14.671556 C2.06946582,10.7098848 4.65555275,9.20574398 6.97791173,9.18935086 C9.3008459,9.17267014 11.9237455,10.9189691 11.2061869,14.8331865 L27.5768764,14.8331865 C26.8946924,11.3158552 29.1575185,9.45250361 31.7226107,9.42604454 C34.0837955,9.39814747 36.3299408,11.0552908 35.9316167,14.5536406 L38.0368387,14.0414274 C39.3175154,13.7293829 39.7224543,11.4938787 39.4702303,10.2431123 M33.1033717,4.53456695 L36.9707106,4.53456695 C36.9301592,4.49947992 36.8953597,4.46841927 36.8542331,4.43131904 C35.4012848,3.13913838 32.8856596,0.942172402 31.150577,0.109574353 C30.764332,-0.0753515691 30.5011793,-0.167383132 30.0099608,-0.224902859 C27.0172094,-0.576923589 22.306919,-0.576923589 19.5623652,-0.263153478 C18.3153375,-0.119929358 17.3236974,0.356909179 16.236287,0.923478491 C14.3269196,1.91799457 12.3341487,3.29415404 10.5780714,4.53456695 L13.8676246,4.53456695 C15.1966179,3.52912212 16.4905242,2.6280756 18.0009922,1.88722152 C18.6733978,1.55993427 19.1410332,1.41412176 19.8853385,1.34739888 C22.4855177,1.11760757 24.8239822,1.10178964 27.4805308,1.21424071 C28.5184743,1.2588185 29.1330726,1.35804003 30.0013329,1.93927687 C31.0320864,2.6286508 32.1807553,3.58376587 33.1033717,4.53456695 M3.95870126,13.8573643 C3.95870126,15.5191092 5.31127764,16.8702476 6.96755818,16.8702476 C8.6270023,16.8702476 9.97957868,15.5191092 9.97957868,13.8573643 C9.97957868,12.1982078 8.6270023,10.848795 6.96755818,10.848795 C5.31127764,10.848795 3.95870126,12.1982078 3.95870126,13.8573643 M28.7241073,13.8573643 C28.7241073,15.5159456 30.0752457,16.8702476 31.7326766,16.8702476 C33.391258,16.8702476 34.7458475,15.5159456 34.7458475,13.8573643 C34.7458475,12.1976326 33.391258,10.848795 31.7326766,10.848795 C30.0752457,10.848795 28.7241073,12.1976326 28.7241073,13.8573643"/></svg>';

								if (markers[i].data_info.moto == 1)
									contentToAppend += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 51 31"><path fill="' + fillColor + '" fill-rule="evenodd" d="M50.8248414,12.5544403 C50.8248414,11.5667458 50.7874707,9.83419028 49.8967293,9.46305139 L47.8716776,9.46520417 L38.4124966,9.46520417 C38.4124966,9.46520417 37.4641603,10.7982042 36.2898414,11.2076625 L38.8930397,17.7624403 L39.1062724,18.2575792 C39.1018759,18.2605931 39.0974793,18.2648986 39.0935224,18.2670514 L39.939419,20.3974403 C40.7211259,19.8015514 41.6918845,19.4325653 42.7580483,19.4325653 C45.307169,19.4325653 47.3731086,21.4566069 47.3731086,23.9529681 C47.3731086,26.3227458 45.5028155,28.2456069 43.1313155,28.4350514 L43.9794103,30.5723292 C47.1968069,30.0048569 49.6417293,27.2652319 49.6417293,23.9529681 C49.6417293,20.2290931 46.5597466,17.2108986 42.7580483,17.2108986 C42.1007638,17.2108986 41.4777724,17.3305931 40.8758845,17.4985097 L39.9992121,15.4550931 C41.1392379,15.2415375 42.6349448,15.1205514 43.6131776,15.1205514 L44.94885,15.1205514 L49.2504362,14.6366069 L50.4309103,14.5664264 C50.738669,14.5479125 50.8195655,14.4609403 50.8195655,14.1845236 L50.8248414,12.5544403 Z M42.7580483,26.8355375 C44.3847724,26.8355375 45.7028586,25.5447319 45.7028586,23.9529681 C45.7028586,22.3594819 44.3847724,21.0682458 42.7580483,21.0682458 C41.1326431,21.0682458 39.8145569,22.3594819 39.8145569,23.9529681 C39.8145569,25.5447319 41.1326431,26.8355375 42.7580483,26.8355375 L42.7580483,26.8355375 Z M37.2456517,16.6038153 L35.2144448,11.4870931 C32.5250741,12.0063431 28.2406345,11.8328292 26.8719879,10.8804403 L24.4683931,8.71388472 C23.3182552,7.91563472 22.1184362,7.76106528 20.5202897,7.80325972 L18.2332034,7.86310694 L18.2354017,7.36624583 C18.2406776,6.75184306 18.0850397,6.42935694 17.4308328,6.15337083 L13.1798069,4.35020417 C14.0054793,3.25400972 14.9305138,2.25770417 15.7381603,1.58646806 L15.7407983,-0.000129166667 C12.5256,1.49174583 8.69576379,4.75234306 6.81316034,7.65730139 C6.51683276,8.11584306 6.38933276,8.56448194 6.35416034,9.02431528 L6.39416897,13.4995097 C6.33217759,14.3037875 6.59025517,14.5031347 7.6973069,14.6366069 L9.39349655,14.6658847 C9.57727241,14.6891347 9.71048793,14.7343431 9.86612586,14.7692181 L8.70323793,17.4795653 C8.69048793,17.4752597 8.67817759,17.4739681 8.6663069,17.4709542 L7.79754828,19.5234125 C9.90877241,19.9376069 11.4994448,21.7627319 11.4994448,23.9529681 C11.4994448,26.4488986 9.43306552,28.4716486 6.88438448,28.4716486 C5.93956552,28.4716486 5.06421207,28.1913569 4.33306552,27.7151625 L3.4643069,29.7697736 C4.47463448,30.3406903 5.63312586,30.6937458 6.88438448,30.6937458 C10.6856431,30.6937458 13.7676259,27.6751208 13.7676259,23.9529681 C13.7676259,21.5233431 12.4447034,19.4131903 10.4776862,18.2270097 L11.6010052,15.6113847 C11.7918155,15.7582042 11.9879017,15.9153569 12.2121259,16.0849958 C13.3921603,16.9801208 14.2314621,18.6412042 15.663419,22.0533569 L16.3303759,24.3202319 C17.5420655,25.2579819 19.4132379,25.1507736 22.3523328,25.1507736 L35.99835,25.1507736 C36.5778155,28.2998569 39.3762207,30.6920236 42.7580483,30.6920236 C42.7857466,30.6920236 42.8103672,30.6847042 42.8376259,30.6847042 L41.925781,28.3902736 C39.7767466,28.0044958 38.1429879,26.1686069 38.1429879,23.9529681 C38.1429879,22.9295375 38.5030655,21.9973847 39.0869276,21.2404681 L38.1803586,18.9576625 C37.1709103,19.8454681 36.4274534,21.0114125 36.0924362,22.3469958 L34.263031,22.2518431 L35.1291517,19.8613986 C35.6892724,18.3040792 36.3834879,17.2849542 37.2456517,16.6038153 L37.2456517,16.6038153 Z M6.88438448,21.0682458 C5.25766034,21.0682458 3.94001379,22.3603431 3.94001379,23.9529681 C3.94001379,25.5447319 5.25766034,26.8355375 6.88438448,26.8355375 C8.51022931,26.8355375 9.82787586,25.5447319 9.82787586,23.9529681 C9.82787586,22.3603431 8.51022931,21.0682458 6.88438448,21.0682458 L6.88438448,21.0682458 Z M6.88438448,17.2108986 C3.08224655,17.2108986 -0.000175862068,20.2290931 -0.000175862068,23.9529681 C-0.000175862068,26.0502042 0.999160345,27.9003014 2.53487586,29.1364264 L3.45683276,26.9543708 C2.72700517,26.1543986 2.26844483,25.1098708 2.26844483,23.9529681 C2.26844483,21.5414264 4.20072931,19.5905792 6.62850517,19.4579681 L7.55573793,17.2655792 C7.33371207,17.2397458 7.11300517,17.2108986 6.88438448,17.2108986 L6.88438448,17.2108986 Z"/></svg>';

								if (markers[i].data_info.camion == 1)
									contentToAppend += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 43 22"><path fill="' + fillColor + '" fill-rule="evenodd" d="M42.7517629,15.1201707 L42.7517629,0 L14.1908384,0 L14.1908384,2.72960976 L14.1908384,15.1201707 L42.7517629,15.1201707 Z M28.8487,16.597122 L12.5392597,16.597122 L12.5016686,10.461 L0.0779138365,10.461 C0.0303163522,10.7083659 2.7044025e-05,10.9509024 2.7044025e-05,11.2476341 L0.00300188679,18.7831707 C0.00300188679,19.0731951 0.22097673,19.2398049 0.482222013,19.2398049 L3.66286981,19.2398049 C3.66422201,17.0534878 5.46210881,15.2717561 7.66619686,15.2717561 C9.46489497,15.2717561 10.9920711,16.4592195 11.4934673,18.0848049 L11.4934673,18.0488537 L11.5359264,19.2398049 L27.4721591,19.2398049 L28.8487,16.597122 Z M12.501939,9.44417073 L12.5022094,4.7265122 C12.5022094,4.3264878 12.3364296,4.18912195 11.8850648,4.18912195 L2.79908365,4.18912195 C2.17436667,4.18912195 1.8628195,4.38068293 1.68703333,4.97280488 L0.351599371,9.44417073 L1.51314025,9.44417073 L2.66332264,5.65346341 C2.75608365,5.35136585 2.89454906,5.21239024 3.23097673,5.21239024 L7.27973774,5.21239024 L7.27973774,9.44417073 L12.501939,9.44417073 Z M5.09349874,19.2440976 C5.09349874,20.6486098 6.24827862,21.7971707 7.66619686,21.7971707 C9.08303333,21.7971707 10.238895,20.6486098 10.238895,19.2440976 C10.238895,17.8366341 9.08303333,16.6902195 7.66619686,16.6902195 C6.24827862,16.6902195 5.09349874,17.8366341 5.09349874,19.2440976 L5.09349874,19.2440976 Z M29.3008761,19.2440976 C29.3008761,20.6486098 30.455656,21.7960976 31.8733038,21.7960976 C33.2904107,21.7960976 34.4462723,20.6486098 34.4462723,19.2440976 C34.4462723,17.837439 33.2904107,16.6929024 31.8733038,16.6929024 C30.455656,16.6929024 29.3008761,17.837439 29.3008761,19.2440976 L29.3008761,19.2440976 Z M39.1792472,16.597122 L34.8589642,16.597122 C35.2467755,17.0296098 35.533983,17.5390976 35.7024673,18.0848049 L39.1762723,18.0848049 L39.1792472,16.597122 Z"/></svg>';

								if (markers[i].data_info.agricola == 1)
									contentToAppend += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 28 22"><path fill="' + fillColor + '" fill-rule="evenodd" d="M28,16.5691452 C28,13.8733265 25.7999432,11.672753 23.1041245,11.672753 C20.406239,11.672753 18.2066989,13.8733265 18.2066989,16.5691452 C18.2066989,19.267289 20.406239,21.4691542 23.1041245,21.4691542 C25.7999432,21.4691542 28,19.267289 28,16.5691452 L28,16.5691452 Z M24.0553468,10.0090182 L24.0553468,7.87044731 L13.885897,7.87044731 L2.87450439,8.39359373 C2.23484486,8.42433666 2.12763214,8.53904136 2.12763214,9.11592332 L0.702348772,14.2133071 C4.56149015,12.2537685 7.54639572,14.7018354 8.01503157,17.475674 L16.5295303,17.475674 C15.9322391,13.0641933 19.7627043,9.37865908 24.0553468,10.0090182 L24.0553468,10.0090182 Z M22.1123422,6.93808413 L24.0553468,6.93808413 L24.0553468,1.86136789 C24.0553468,1.56685583 23.9215246,1.38007318 23.6257209,1.38007318 L16.0709698,1.38007318 C15.7671574,1.38007318 15.6310101,1.54567163 15.5953587,1.84819235 L14.9722332,6.93808413 L15.9500649,6.93808413 L16.497754,2.36668859 L22.1123422,2.36668859 L22.1123422,6.93808413 Z M8.20155588,7.04917201 L9.6053967,6.98200259 L9.6053967,2.30287764 C9.6053967,1.2607183 9.06571627,0.465019043 8.29223459,0 L7.47431776,1.07471068 C7.85537504,1.32892109 8.20155588,1.74046294 8.20155588,2.42946616 L8.20155588,7.04917201 Z M0.0975656715,18.2752484 C0.0975656715,20.0337954 1.52904929,21.4691542 3.28785465,21.4691542 C5.04666001,21.4691542 6.47891867,20.0337954 6.47891867,18.2752484 C6.47891867,16.5182515 5.04666001,15.0836677 3.28785465,15.0836677 C1.52904929,15.0836677 0.0975656715,16.5182515 0.0975656715,18.2752484 L0.0975656715,18.2752484 Z"/></svg>';

							contentToAppend += '</span>';
						contentToAppend += '</a>';
						contentToAppend += '<a href="tel:' + markers[i].data_info.phone + '" class="phone">' + markers[i].data_info.phone + '</a>';
					contentToAppend += '</li>';

					$(".stockists-results .results-store").append(contentToAppend);
				}
			}
			wrapper = $('.stockists-results .results-store');

			//sort the result by distance
			wrapper.find('.results-content').sort(function(a, b) {
				return +a.dataset.miles - +b.dataset.miles;
			})
			.appendTo(wrapper);

			$(".results-content .address").on("click", clickStockist);

			if (isActive)
			{
				wrapper.addClass('active');
			}
			else
			{
				wrapper.removeClass('active');
			}
		}

		function openStockist (marker)
		{
			google.maps.event.addListener(marker, 'click', function()
			{
				var contentString = '';
				contentString += '<div class="data-stockists" data-latitude="' + marker.getPosition().lat() + '" data-longitude="' + marker.getPosition().lng() + '">';
					contentString += '<div class="stockists-title"><h2>' + marker.data_info.name + '</h2></div>';
					contentString += '<ul>';
						contentString += '<li class="stockists-services">';

							if (marker.data_info.turismo == 1)
								contentString += '<span class="fa-stack fa-lg" style="padding: 0 5px;">' + '<img src="' + config.images.turismo + '">' + '</span>';

							if (marker.data_info.moto == 1)
								contentString += '<span class="fa-stack fa-lg" style="padding: 0 5px;">' + '<img src="' + config.images.moto + '">' + '</span>';

							if (marker.data_info.camion == 1)
								contentString += '<span class="fa-stack fa-lg" style="padding: 0 5px;">' + '<img src="' + config.images.camion + '">' + '</span>';

							if (marker.data_info.agricola == 1)
								contentString += '<span class="fa-stack fa-lg" style="padding: 0 5px;">' + '<img src="' + config.images.agricola + '">' + '</span>';

						contentString += '</li>';

						if (marker.data_info.address)
						{
							contentString += '<li><i class="fa fa-home" aria-hidden="true"></i> <span>' + marker.data_info.address + '</span></li>';
						}

						contentString += '<li><i class="fa fa-globe" aria-hidden="true"></i> <span>' + marker.data_info.postcode + ' ' + marker.data_info.city + ' (' + marker.data_info.region + ')</span></li>';

						if (marker.data_info.phone)
						{
							contentString += '<li><i class="fa fa-phone" aria-hidden="true"></i> <a href="tel:' + marker.data_info.phone + '">' + marker.data_info.phone + '</a></li>';
						}

						contentString += '<li><i class="fa fa-calendar" aria-hidden="true"></i> <span>' + marker.data_info.schedule + '</span></li>';

						if (marker.data_info.email)
						{
							contentString += '<li><i class="fa fa-envelope" aria-hidden="true"></i> <a href="mailto:' + marker.data_info.email + '" target="_blank">' + marker.data_info.email + '</a></li>';
						}

						contentString += '<li><i class="fa fa-map" aria-hidden="true"></i> <a target="_newtab" href="https://www.google.com/maps/dir//' + marker.getPosition().lat() + ',' + marker.getPosition().lng() + '/@' + marker.getPosition().lat() + ',' + marker.getPosition().lng() + ',17z">Cómo llegar</a> <a href="#" class="ask-for-directions get-directions" data-directions="DRIVING">(itinerarios)</a></li>';

						// if (external_link)
						// {
						// 	var protocol_link = external_link.indexOf("http") > -1 ? external_link : "http://" + external_link;
						// 	contentString += '<li><i class="fa fa-file-text" aria-hidden="true"></i> <a href="' + protocol_link + '" target="_blank">' + external_link + '</a></li>';
						// }
						// else if (marker.data_info.url)
						// {
							contentString += '<li><i class="fa fa-file-text" aria-hidden="true"></i> <a href="/' + config.moduleUrl + '/' + marker.data_info.url + '">Ficha centro</a></li>';
						// }

						contentString += '<li style="padding: 0; margin-top: 25px;"><a href="/turismo/presupuesto/presupuesto-neumaticos" class="btn pressu no-ajax_link">Solicitar presupuesto</a></li>';
					contentString += '</ul>';
				contentString += '</div>';

				$('.stockists-window').empty();
				$('.stockists-window').html(contentString);

				$(".stockists-window .get-directions").on("click", clickGetDirections);

				searchCoords({ latitude : marker.getPosition().lat(), longitude : marker.getPosition().lng() });
			});
		}

		function searchAddress (address)
		{
			var geocoder = new google.maps.Geocoder();

			// var code_country = this.getCountryCode();

			geocoder.geocode({'address': address}, function (results, status)
			{
				if (status == google.maps.GeocoderStatus.OK)
				{
					if (results[0])
					{
						zoom = (results[0]["types"][0] == "country") ? 5 : 9;
						latLng = results[0].geometry.location;

						listStockists(zoom, latLng);
					}
					else
					{
						alert("No stores near your location.");
					}
				}
			});
		}

		function searchCoords (coords)
		{
			zoom = 9;
			latLng = new google.maps.LatLng(coords.latitude, coords.longitude);

			listStockists(zoom, latLng);
		}

		function searchStockists (e)
		{
			address = $("#stockist-search-term").val();

			if (address != "")
			{
				searchAddress(address);
			}
			else
			{
				searchCoords({latitude : config.latitude, longitude : config.longitude});
			}
		}

		function stockistsMain ()
		{
			// $.getScript("https://maps.googleapis.com/maps/api/js?v=3&sensor=false&key=" + config.apiKey + "&libraries=geometry", getStoresMap);
			getStoresMap();

			// on search show the relevant stores
			$("#stockists-submit").on("click", searchStockists);

			$('#stockist-search-term').keypress(function(e) {
				if (e.which == 13) // Enter key pressed
					searchStockists(e);
			});

			// full width template
			if (config.template == "full_width_sidebar" || config.template == "full_width_top" || config.template == "full_width_top")
				$("body").addClass("full-width");

			$('.navbar-vehicle-type a').on("click", clickVehicleType);
			$('#renting').on("change", changeRenting);
			$('.navbar-province a').on("click", clickProvince);
			// $(".results-content .address").on("click", clickStockist);
		}

		//gets geolocation, if storeDirections is set then it is interpreted as a way to getDirection
		function getGeoLocation (storeDirections, userTravelMode, directionsService, directionsDisplay)
		{
			var geoOptions = function() {
				return {
					maximumAge: 5 * 60 * 1000
				,	timeout: 10 * 1000
				}
			};

			var geoSuccess = function(position) {

				// if no params then just center it, otherwise call directions
				if (typeof storeDirections === 'undefined')
				{
					centerMap(position.coords, markers);
				}
				else
				{
					getDirections(map, storeDirections, position.coords, userTravelMode, directionsService, directionsDisplay);
				}
			};
			var geoError = function(position) {
				return;
			};

			navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
		}

		// get driving directions from user location to store
		function getDirections (map, storeDirections, userLocation, userTravelMode, directionsService, directionsDisplay)
		{
			if (typeof userTravelMode === 'undefined')
			{
				var directionsTravelMode = "DRIVING";
			}
			else
			{
				var directionsTravelMode = userTravelMode;
			}

			var request = {
				destination: new google.maps.LatLng(storeDirections.latitude,storeDirections.longitude), 
				origin: new google.maps.LatLng(userLocation.latitude,userLocation.longitude), 
				travelMode: google.maps.TravelMode[directionsTravelMode]
			};
			
			directionsService.route(request, function(response, status) {

				if (status == google.maps.DirectionsStatus.OK)
				{
					directionsDisplay.setDirections(response);
					directionsDisplay.setPanel($('.directions-panel')[0]);
				}

			});
			
			$(".directions-panel").show();
			
			//on close reset map and panel and center map to user location
			$("body").on("click", ".directions-panel .close", function() {
				$(".directions-panel").hide();
				directionsDisplay.setPanel(null);
				directionsDisplay.setMap(null);
				centerMap(userLocation, markers);
			});
		}

		function clickGetDirections (e)
		{
			storeDirections = {
				latitude : $(".stockists-window .data-stockists").data("latitude")
			,	longitude : $(".stockists-window .data-stockists").data("longitude")
			};
			userTravelMode = $(e.currentTarget).attr("data-directions");

			getGeoLocation(storeDirections, userTravelMode, directionsService, directionsDisplay);

			return false;
		}
	};

});
