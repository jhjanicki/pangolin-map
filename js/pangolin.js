
// site data

	// queue()
// 	.defer(d3.json, 'data/all_pangolins.geojson')
// 	.defer(d3.json, 'data/countries2.geojson')
// 	.await(makeMyMap);
	
	var countries;
	
	var pangolin;
	
	var selectedSpecies;
	
	var pangolinArray = ["Black-bellied Pangolin","White-bellied Pangolin","Indian Pangolin", "Philippines Pangolin","Chinese Pangolin"];
	
	var selected = false;

	$('#blackBelliedPangolin, #whiteBelliedPangolin, #indianPangolin, #philippinesPangolin, #chinesePangolin, #sundaPangolin, #temmicksPangolin, #giantGroundPangolin')
	.on('click', function () {
		var $el = $(this);
		var id = this.id;
		//console.log($el.data('species'));
		selectedSpecies = $el.data('species');
		selected=true;
		drawPangolinRange(selectedSpecies, this.id);
		
	});
				
			

	
	$('#allSpecies').on('click', function(){
		selected=false;
		$('img').removeClass('unselected-img');
		$("#selected-species").html('');
		drawPangolinRange('all species', this.id);
	});
	
	$("#cites").on('click', function(){
		
		drawCites();
		drawLegend();
	});
	
	
	
		$("#dropdown").on('click',function(){
		$("#new-dropdown").toggleClass('show none');
	});
	$('.toggle-button').on('click', function() {
		console.log($(this));
		$(this).find('.plus').toggleClass('show none');
		$(this).find('.minus').toggleClass('show none');
	});
	$('#button-one').on('click', function() {
		$('#detail-one').toggleClass('show none');
	});
	$('#button-two').on('click', function() {
		$('#detail-two').toggleClass('show none');
	});
	$('#button-three').on('click', function() {
		$('#detail-three').toggleClass('show none');
	});

	
	
	
//functions to draw leaflet+D3 map

	var southWest = L.latLng(23, 122),
    northEast = L.latLng(29, 132),
    bounds = L.latLngBounds(southWest, northEast);

	var map = new L.Map("mapContainer", {
				center: [15.5, 65.7], 
				zoom: 3
			});
		
	var tile1 = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						}),
		
		tile2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
						attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS'
						});
		
		tile1.addTo(map);
			
	var layerControlItems = {
			  "<div class='layer-titles'> OSM Landscape </div>": tile1,
			  "<div class='layer-titles'> Terrain </div>": tile2
			};
		
		 L.control.layers(layerControlItems).addTo(map);
	
	map.scrollWheelZoom.disable();
	map.touchZoom.disable();

	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");
		
	var countryPath = g.append("g");
	var pangolinPath = g.append("g");
	var rangePath =g.append("g");
	var citesPath =g.append("g");
	
	function projectPoint(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x)); 
		this.stream.point(point.x, point.y); 

	}
	var transform = d3.geo.transform({point: projectPoint}),
		path = d3.geo.path().projection(transform);




	function filterRangeCountries(){
		
		var rangeCountries = ['Angola','Bangladesh','Benin','Botswana','Brunei','Cambodia','Cameroon',
		'Central African Republic','Chad','China','Democratic Republic of the Congo','Equatorial Guinea',
		'Gabon','Ghana','Guinea','Guinea Bissau','India','Indonesia','Ivory Coast','Kenya','Laos',
		'Liberia','Malawi','Malaysia','Mozambique','Myanmar','Nepal','Nigeria','Pakistan','Philippines',
		'Republic of the Congo','Rwanda','Senegal','Sierra Leone','Singapore','South Africa','South Sudan',
		'Sri Lanka','Taiwan','Tanzania','Thailand','Togo','Uganda','Vietnam','Zambia','Zimbabwe'];
	}
	

	
	function filterDemandCountries(){
		var demandCountries = ['China', 'Vietnam'];
	}



	function drawCites(){
		
		var citesCountries = countries.features.filter(function(d){
							return d.properties.hasOwnProperty("CITES");
							//return "species" in d.properties; 
					});
		console.log(citesCountries);
		
		
		
	
		 var recolorMap = colorScaleCITES(citesCountries);
		  
			  citesPath.selectAll("path")
				   .data(citesCountries)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("class","cites")
				   .attr("fill", function(d) { 
						return choropleth(d, recolorMap);
			 		})
			 		.style("opacity",0.9)
			 		.style("stroke-width",1)
			 		.style("stroke", 'white')
			 		.attr('id',function(d){
			 			return 'cites-'+d.id;
			 		
			 		})
			 		.append("desc") //append the current color as a desc element
					.text(function(d) { 
							return choropleth(d, recolorMap); 
				   	});
				   	
				   	
			  citesPath.selectAll("path")
				    .data(citesCountries)
			 		.on('mouseover',function(d){
						d3.select(this).attr('fill','black');
						console.log(d3.select('#cites-'+d.id).select("desc").text());   		
					})
					.on('mouseout',function(d){
						var color = d3.select('#cites-'+d.id).select("desc").text();
						 d3.select(this).attr('fill',color);		   	
					});
					
					
				pangolinPath.selectAll("path").moveToFront();
					
					
					
	}
	
	function drawPangolinRange(species,id){ 
	
		
		pangolinPath.selectAll("path").remove();
		rangePath.selectAll("path").remove();
		citesPath.selectAll("path").remove();
		
		
		//console.log('drawPangolinRange');
		//console.log(id);
		
		if(selected){
			d3.json("data/all_pangolins.geojson",function(error,range){
						
						pangolin = range;
						//var species = range.properties.species;
			
				
						var speciesRange = range.features.filter(function(d) { 
							return d.properties.species == species; 
						});
						//console.log('peegy');
						//console.log(speciesRange);
						pangolinPath.selectAll("path")
							   .data(speciesRange)
							   .enter()
							   .append("path")
							   .attr("d", path)
							   .attr("class","pangolin")
							   .attr("fill","#EC8562")
							   .style("stroke","black")
				   			   .style("stroke-width",0.5)
				   			   .style("opacity",0.6)
							   .on('mouseover',function(d){
							   		d3.selectAll("path.pangolin")
									.style("opacity",0.9)
									.style("cursor","pointer");
							   })
							   .on('mouseout',function(d){
							   		d3.selectAll("path.pangolin")
									.style("opacity",0.6);
							   });
							   
						// this.parentNode.appendChild(this);
					$('img').addClass('unselected-img');
					$('#'+id).removeClass('unselected-img');
					$("#selected-species").html(species);
				}); // end json
					
					var rangeCountries = countries.features.filter(function(d){
							return _.contains(d.properties.species, species);
					});
					
					//console.log(rangeCountries);
					
					  
					  rangePath.selectAll("path")
				   		.data(rangeCountries)
				   		.enter()
				   		.append("path")
				   		.attr("d", path)
				   		.attr("class","pangolinRange")
						.attr("fill","#848486")
				  		.style("stroke","white")
				   		.style("stroke-width",1)
				   		.style("opacity",0.2)
				   		.on('mouseover',function(d){
							   		d3.select(this)
									.style("opacity",0.9)
									.style("cursor","pointer");
							   })
						.on('mouseout',function(d){
							   		d3.select(this)
									.style("opacity",0.2);
							});
		}else{
			d3.json("data/all_pangolins.geojson",function(error,range){
	
						pangolin = range;
						//var species = range.properties.species;
			
						range.features.forEach(function(d){
						
						});
			
						pangolinPath.selectAll("path")
							   .data(range.features)
							   .enter()
							   .append("path")
							   .attr("d", path)
							   .attr("class","pangolin")
							   .attr("fill","#EC8562")  // #878BA3, #FF9E33
							   .style("stroke","black")
				   			   .style("stroke-width",0.5)
				   			   .style("opacity",0.7)
							   .on('mouseover',function(d){
							   		d3.selectAll("path.pangolin")
									.style("opacity",0.9)
									.style("cursor","pointer");
							   })
							   .on('mouseout',function(d){
							   		d3.selectAll("path.pangolin")
									.style("opacity",0.7);
							   });

					
					});
					
					console.log(countries);
					var rangeCountries = countries.features.filter(function(d){
							return d.properties.hasOwnProperty("species");
							//return "species" in d.properties; 
					});
					
					console.log(rangeCountries);
					
					 rangePath.selectAll("path")
				   		.data(rangeCountries)
				   		.enter()
				   		.append("path")
				   		.attr("d", path)
				   		.attr("class","pangolinRange")
						.attr("fill","#8F9BA6")
				  		.style("stroke","black")// #A64141
				   		.style("stroke-width",1)
				   		.style("opacity",0.2)
				   		.on('mouseover',function(d){
							   		d3.select(this)
									.style("opacity",0.9)
									.style("stroke-width",1)
									.style('stroke','black')
									.style("cursor","pointer");
							   })
						.on('mouseout',function(d){
							   		d3.select(this)
									.style("opacity",0.2)
									.style('stroke','black')
									.style("stroke-width",1);
							});
			
					
			
			};
					
				
		
		}
		
		
	

	
	
	
	function loadPolygons(){

		
		 d3.json("data/countries2.geojson", function(error,adm0){
			  //console.log(adm0.features);
			
			
				
				//append pangolin data to associated country geojson
				var pangolinData = d3.json('data/pangolins.json',function(data){
					console.log(data.pangolins);
					data.pangolins.forEach(function(d){
			
						d.range_countries.forEach(function(d2){
							console.log(d2.name);
						});
						console.log(d.species);
					});
				});

		  
		  	  countries = adm0;
		  	  
		  	  
		  	  
		  	  //var recolorMap = colorScale(adm0);
		  
			  countryPath.selectAll("path")
				   .data(adm0.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("class","country")
				   // .attr("fill", function(d) { 
// 						return choropleth(d, recolorMap);
// 					})
					.attr("fill","#878BA3")
					.on('mouseover',function(d){
					
						var finalId= "id"+d.properties.name;
						d3.select(this)//select the current county in the dome	
						.style("stroke-width", 0.5)
						.style("opacity",0.6)
						.style("cursor","pointer");
				   })
				   .on('mouseout',function(d){
					
						var finalId= "id"+d.properties.name;
						d3.select(this)//select the current county in the dome	
						.style("stroke-width", 0.5)
						.style("opacity",0);
				   })
				   .style("stroke","black")
				   .style("stroke-width",0.5)
				   .style("opacity",0)
				   .attr("id",function(d){
						return "id"+d.properties.name;
					});
					
					
				
				var bounds = path.bounds(adm0),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				
				 svg.attr("width", bottomRight[0] - topLeft[0])
					.attr("height", bottomRight[1] - topLeft[1])
					.style("left", topLeft[0] + "px")
					.style("top", topLeft[1] + "px");

				 g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
		
				
				 drawPangolinRange();
		
		}); // end adm0
	
	
		
	}

	loadPolygons();
	map.on("viewreset", resetView);
	resetView();
	
	
	function getOverlayG() {
		return g;
	}
	
	function getProjection() {
		return function(xy){ return map.latLngToLayerPoint(new L.LatLng(xy[1], xy[0])) };
	}



	function resetView() {
			if (countries) {
				var bounds = path.bounds(countries),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				

				svg.attr("width", bottomRight[0] - topLeft[0] + 1000)
						.attr("height", bottomRight[1] - topLeft[1])
						.style("left", topLeft[0] + "px")
						.style("top", topLeft[1] + "px");

				g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

				countryPath.selectAll('path.country').attr("d", path);
				pangolinPath.selectAll('path.pangolin').attr("d", path);
				rangePath.selectAll('path.pangolinRange').attr("d", path);
				citesPath.selectAll('path.cites').attr("d", path);
			}
			
	}
	
	
	


	function colorScaleCITES(data){

		//return the color scale generator
		return d3.scale.linear()
			.domain([1973,2014])
			.range(['#08589e','#a8ddb5']);

	}
	
	function choropleth(d, recolorMap){
		//Get data value
		var value = d.properties.CITES;
		//If value exists, assign it a color; otherwise assign gray
		if (value) {
			return recolorMap(value);
		} else {
			return "##f7fcf0";
		};
	};
	
	
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
		this.parentNode.appendChild(this);
	  });
	};
	
	function drawLegend(){
		d3.select('#linearLegend svg').remove();
	
		// linear scale, 2 colors
      var lScale = d3.scale.linear()
			.domain([1973,2014])
			.range(['rgb(8, 88, 158)', 'rgb( 168, 221, 181)']);
			
		var boxWidth = 20        // width of each box (int)
		, boxHeight = 20      // height of each box (int)         
		, linearBoxes =  9   // number of boxes for linear scales (int)
		, w = 300           // width of container element
		, h = 60          // height of container element
		, colors = []
		, padding = [2, 4, 10, 4]               // top, right, bottom, left
		, boxSpacing = 0 // spacing between boxes
		, domain = [1973,2014]
		, range = ['rgb(8, 88, 158)', 'rgb( 168, 221, 181)']  
		, i = 0;
		
		 var min = 1973;
    	 var max = 2014;
    	 
		for (i = 0; i < linearBoxes ; i++) {
		  colors[i] = lScale(min + i * ((max - min) / linearBoxes));
		 }
		 
		  if (w < (boxWidth + boxSpacing) * colors.length + padding[1] + padding[3]) {
			boxWidth = (w - padding[1] - padding[3] - (boxSpacing * colors.length)) / colors.length;
			}
			if (h < boxHeight + padding[0] + padding[2]) {  
			  boxHeight = h - padding[0] - padding[2];    
			}
			
			var legend = d3.select('#linearLegend')
				.append('svg')
				  .attr('width', w)
				  .attr('height', h)
				  .append('g')
				  .attr('class', 'colorlegend')
				  .attr('transform', 'translate(20,20)')
				  .style('font-size', '11px')
				  .style('fill', '#666');
	  
			  var legendBoxes = legend.selectAll('g.legend')
				  .data(colors)
				  .enter().append('g');
			
 			valueLabels = legendBoxes.append('text')
			  .attr('class', 'colorlegend-labels')
			  .attr('dy', '.71em')
			  .attr('x', function (d, i) {
				return i * (boxWidth + boxSpacing)+10;
			  })
			  .attr('y', function () {
				return boxHeight + 2;
			  });
			  
			  valueLabels    
			  .style('text-anchor', 'middle')
			  .style('pointer-events', 'none')
			  .text(function (d, i) {
				  if (i === 0)
					return 1976;
				  if (i === colors.length - 1) 
					return 2014;
			  });
			  legendBoxes.append('rect')
			  .attr('x', function (d, i) { 
				return i * (boxWidth + boxSpacing);
			  })
			  .attr('width', boxWidth)
			  .attr('height', boxHeight)
			  .style('fill', function (d, i) { return colors[i]; });
			
		 
		}
	
	
	
	
	// REFERENCE
// 	function colorClass(){
// 		//<-colorScale
// 		return [
// 				"#7fcdbb",
// 				"#41b6c4",
// 				"#2c7fb8",
// 				"#253494"
// 		];
// 	
// 	};
// 
// 	function colorScale(jsonData){
// 
// 		//create quantile classes with color scale
// 		var colors = colorClass();
// 		var color = d3.scale.linear() //designate quantile scale generator
// 			.range(colors);
// 		//set min and max data values as domain
// 		color.domain([0,6]);//currently hard-coded
// 	
// 		//return the color scale generator
// 		return color;	
// 
// 	};
// 
// 	function choropleth(d, recolorMap){
// 		//Get data value
// 		var value = d.properties.number;
// 		//If value exists, assign it a color; otherwise assign gray
// 		if (value) {
// 			return recolorMap(value);
// 		} else {
// 			return "#c7e9b4";
// 		};
// 	};



	
