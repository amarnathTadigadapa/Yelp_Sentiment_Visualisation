var width = 960,
    height = 500,
    centered;
var projection = d3.geo.albersUsa()
.scale(1070)
.translate([width/2,height/2]);


var path = d3.geo.path()
.projection(projection);

var svg = d3.select("#map").append("svg")
.attr("width",width)
.attr("height",height);

svg.append("rect")
.attr("class","background")
.attr("width",width)
.attr("height",height)
.on("click",clicked);

var g = svg.append("g");


var states_info = []

d3.tsv('data/states.tsv', function(data){
    states_info.push(data);
});

getinfo = function(id){
    return states_info[0].filter(function(z){return String(z.id) == id});
};

d3.json("data/us.json",function (error,us) {
   if(error) throw error;
    var all_states = topojson.feature(us, us.objects.states).features;
    all_states.forEach(function(d){d.info = getinfo(d.id)[0]});
    var all_states = all_states.filter(function(d){return d.info != undefined});
    all_states.forEach(function(d){d.state = d.info.state});

    g.append("g")
        .attr("id","counties")
        .selectAll("path")
        .data(topojson.feature(us,us.objects.counties).features)
        .enter().append("path")
        .attr("d",path)
        .on("click",clicked);

   g.append("path")
       .datum(topojson.mesh(us,us.objects.states,function (a,b) {
           return a !== b;
       }))
       .attr("id","state-borders")
       .attr("d",path)
       .attr('class','states');
  // g.selectAll('.super')
  //      .data(topojson.feature(us, us.objects.states).features)
  //      .enter().append('circle')
  //      .attr('r',2)
  //      .each(function (d) {
  //          var lon = path.centroid(d);
  //          d3.select(this)
  //              .attr('cx',lon[0])
  //              .attr('cy',lon[1])
  //
  //      });
  var states = ["Arizona","Illinois","Indiana","NewYork","NorthCarolina","Nevada","Ohio","Pennsylvania", "SouthCarolina","Wisconsin"];

  g.selectAll('.city')
      .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append('image')
        //.attr('d', path)
        .attr('class', function(d) {
            return 'state'
        })
        .attr('r', 1)
      .each(function (d) {
          var lon = path.centroid(d);
          d3.select(this)
              .attr('transform' ,function(d) {
              return "translate(" + lon + ")";
          })
      });
  d3.selectAll('.state')
        .attr('xlink:href', function(d) {
            if (states.indexOf(getinfo(d.id)[0]['state']) != -1) {
                return ('img/taco.svg')
            }
            else{
                return ('');
            }

        })
        .attr('height', function(d) {
            return '19'
        })
        .attr('width', '19')
        .attr('x', '-14.5')
        .attr('y', '-9.5')
        .attr('class', function(d) {
            return 'state_image'
        });

    d3.select('.state_image')
        .attr('height', 40)
        .attr('width', 40)
        .attr('y', -20);
});

function clicked(d) {
    var state_id  = (d.id+'').slice(0,-3);
   var state_info  = (getinfo(state_id))[0];
    var x,y,z;
    if(d && centered!==d){
        var centroid = path.centroid(d),
            x = centroid[0],
            y = centroid[1],
            k = 4;
        centered = d;
    }else{
        x = width/2;
        y = height/2;
        k = 1;
        centered = null;
    }
    g.selectAll('path').classed('active', centered && function (d) {
        return d === centered;

    });
    g.transition()
        .duration(750)
        .attr("transform","translate("+width/2+","+height/2+")scale("+k+")translate("+-x+","+-y+")")
        .style("stroke-width",1.5/k+"px");
    $("#state_name").html(state_info.state);

}
