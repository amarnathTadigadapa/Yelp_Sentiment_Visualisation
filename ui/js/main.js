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


var states_info = [];

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
  d3.json('data/state_cuisine.json',function (error,states) {

  d3.selectAll('.state')
        .attr('xlink:href', function(d) {
            var img_url = '';
            $.each(states,function(state,state_data) {
                if (getinfo(d.id)[0].state==state_data.name){
                    img_url = 'img/'+state_data.type+'.svg';
                }
            });
            return(img_url);
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
  });
    d3.select('.state_image')
        .attr('height', 40)
        .attr('width', 40)
        .attr('y', -20);
});

function add_emoticon(cusine,pos,neg) {
    var d = d3.select("#cusine").append("div").attr('class','row custom_class');
    add_pos(cusine,pos);
    add_neg(cusine,neg);
}
function add_pos(id,pos) {
    $("#cusine").append("<span style='font-size:20px'>"+id+"</span>");
    for(var i=0;i<pos;i++){
        var emotDoc = d3.select("#cusine").append("img").attr("src","img/happy.jpg").attr("class","happy_img");
    }
}
function add_neg(id,neg) {
    for(var i=0;i<neg;i++){
        var emotDoc = d3.select("#cusine").append("img").attr("src","img/sad.jpg").attr("class","neg_class");
    }
}
function clicked(d) {
    console.log(d.id);
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
    $("#cusine").html('');

    $.getJSON('data/county_cuisine_data_new.json',function(obj){
        $.each(obj,function (ind,val) {
           if (val.hasOwnProperty(d.id)){
               console.log('found');
               $("#state_name").append(' '+val[d.id].county);
              $.each(val[d.id].top_5_cuisines,function (ind,cusine_data) {
                  console.log(cusine_data);
                  var pos = Math.floor(cusine_data.pos);
                  add_emoticon(cusine_data.name,pos,10-pos);
              });
           }
        });
        console.log(obj);});

}

