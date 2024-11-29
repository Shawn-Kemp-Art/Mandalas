document.body.innerHTML = '<style>div{color: grey;text-align:center;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;width:500px;height:100px;}</style><body><div id="loading"><p>This could take a while, please give it at least 5 minutes to render.</p><br><h1 class="spin">⏳</h1><br><h3>Press <strong>?</strong> for shortcut keys</h3><br><p><small>Output contains an embedded blueprint for creating an IRL wall sculpture</small></p></div></body>';
paper.install(window);
window.onload = function() {

document.body.innerHTML = '<style>body {margin: 0px;text-align: center;}</style><canvas resize="true" style="display:block;width:100%;" id="myCanvas"></canvas>';

setquery("fxhash",$fx.hash);
var initialTime = new Date().getTime();

var canvas = document.getElementById("myCanvas");

paper.setup('myCanvas');
paper.activate();

//console.log(tokenData.hash)
console.log('#'+$fx.iteration)

canvas.style.background = "white";

//Set a seed value for Perlin
var seed = Math.floor($fx.rand()*10000000000000000);

//initialize perlin noise 
var noise = new perlinNoise3d();
noise.noiseSeed(seed);

definitions = [
    {
        id: "orientation",
        name: "Orientation",
        type: "select",
        default: "portrait",
        options: {options: ["portrait", "landscape", "square"]},
    },
    {
        id: "size",
        name: "Size",
        type: "select",
        default: "2",
        options: {options: ["1", "2", "3"]},
    },
    {
        id: "colors",
        name: "Max # of colors",
        type: "number",
        default: 2,
        options: {
            min: 1,
            max: 6,
            step: 1,
        },  
    },
    {
        id: "pallete",
        name: "Theme",
        type: "select",
        default: "AllColors",
        options: {options: ["AllColors", "SunsetGlow", "OceanBreeze", "NaturalCalm", "VintageChic", "BoldVibrant", "WintersTwilight", "WarmSpice", "SoftPetals", "FreshGreens", "MonochromeElegance", "TropicalSplash", "AutumnWarmth", "ElegantMonochrome", "SunKissedEarth", "CitrusPunch", "FrostySky", "BoldNights", "MutedElegance", "SunnyMeadows", "UrbanContrast"]},
    },
    {
        id: "framecolor",
        name: "Frame color",
        type: "select",
        default: "White",
        options: {options: ["Random","White","Mocha"]},
    },
    {
        id: "originx",
        name: "Origin X",
        type: "number",
        default: 400,
        options: {
            min: 100,
            max: 900,
            step: 1,
        },  
    },
    {
        id: "originy",
        name: "Origin Y",
        type: "number",
        default: 500,
        options: {
            min: 100,
            max: 900,
            step: 1,
        },  
    },
     {
        id: "ringlets",
        name: "Spread",
        type: "number",
        default: 50,
        options: {
            min: 25,
            max: 125,
            step: 1,
        },  
    },

    ]



$fx.params(definitions)
var scale = $fx.getParam('size');
var stacks = 12;
var numofcolors = $fx.getParam('colors');




   

//Set the properties for the artwork where 100 = 1 inch
var wide = 800; 
var high = 1000; 


var ratio = 1/scale;//use 1/4 for 32x40 - 1/3 for 24x30 - 1/2 for 16x20 - 1/1 for 8x10
var minOffset = ~~(7*ratio); //this is aproximatly .125"
//var framewidth = ~~(R.random_int(125, 125)*ratio); 
if (scale==1){var framewidth = 75};
if (scale==2){var framewidth = ~~(125*ratio)};
if (scale==3){var framewidth = ~~(175*ratio)};
var framradius = 0;


// Set a canvas size for when layers are exploded where 100=1in
var panelWide = 1600; 
var panelHigh = 2000; 
 
paper.view.viewSize.width = 2400;
paper.view.viewSize.height = 2400;


var colors = []; var palette = []; 

//set a apllete based theme and number of colors
for (c=0; c<numofcolors; c=c+1){palette[c] = this[$fx.getParam('pallete')][R.random_int(0, this[$fx.getParam('pallete')].length-1)]}  
console.log(palette);

//randomly assign colors to layers
for (c=0; c<stacks; c=c+1){colors[c] = palette[R.random_int(0, palette.length-1)];};

//or alternate colors
p=0;for (var c=0; c<stacks; c=c+1){colors[c] = palette[p];p=p+1;if(p==palette.length){p=0};}

console.log(colors);
//p=0;for (var c=0; c<stacks; c=c+1){colors[c] = palette[p];p=p+1;if(p==palette.length){p=0};}

if ($fx.getParam('framecolor')=="White"){colors[stacks-1]={"Hex":"#FFFFFF", "Name":"Smooth White"}};
if ($fx.getParam('framecolor')=="Mocha"){colors[stacks-1]={"Hex":"#4C4638", "Name":"Mocha"}};


var woodframe = new Path();var framegap = new Path();
var fColor = frameColors[0];
var frameColor = fColor.Hex;

//adjust the canvas dimensions
w=wide;h=high;
var orientation="Portrait";
 
if ($fx.getParam('orientation')=="landscape"){wide = h;high = w;orientation="Landscape";};
if ($fx.getParam('orientation')=="square"){wide = w;high = w;orientation="Square";};
if ($fx.getParam('orientation')=="portrait"){wide = w;high = h;orientation="Portrait";};



console.log(orientation+': '+~~(wide/100/ratio)+' x '+~~(high/100/ratio))  
console.log(stacks+" layers");
console.log(numofcolors+" colors");




    
//Set the line color
linecolor={"Hex":"#4C4638", "Name":"Mocha"};
//var frameColor = {"Hex":"#60513D","Name":"Walnut"},

var ringlets = $fx.getParam('ringlets');
var center = new Point($fx.getParam('originx'),$fx.getParam('originy'))

//************* Draw the layers ************* 


sheet = []; //This will hold each layer

var px=0;var py=0;var pz=0;var prange=.6; 

var segments =[]
var quads = [4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180]
var segs = [4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]
segments[0] = quads[~~(noise.get(1234)*quads.length)];
segments[1] = quads[~~(noise.get(2234)*quads.length)];
segments[2] = quads[~~(noise.get(3234)*quads.length)];
segments[3] = quads[~~(noise.get(4234)*quads.length)];

segments[0] = 5;
segments[1] = 10;
segments[2] = 20;
segments[3] = 40;

var shapes = [pizza,diamond,elipsoid,pointyoval]

os = ~~(center.getDistance(new Point(wide,0)))
console.log(os)


var rings =[];
r=0;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets);
fc = ~~(R.random_dec()*ringlets);s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=1;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets*2);
fc = ~~(rings[r-1].fromCenter+rings[r-1].ringSize-(R.random_dec()*ringlets));s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=2;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets*2);
fc = ~~(rings[r-1].fromCenter+rings[r-1].ringSize-(R.random_dec()*ringlets));s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=3;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets*3);
fc = ~~(rings[r-1].fromCenter+rings[r-1].ringSize-(R.random_dec()*ringlets));s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=4;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets*3);
fc = ~~(rings[r-1].fromCenter+rings[r-1].ringSize-(R.random_dec()*ringlets));s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=5;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);rs=~~(ringlets+noise.get(r)*ringlets*3);
fc = ~~(rings[r-1].fromCenter+rings[r-1].ringSize-(R.random_dec()*ringlets)); rs=os-fc;s=segs[~~(R.random_dec()*segs.length)];
rings[r]={"shape":sa,"center":center,"fromCenter":fc,"ringSize":rs,"segments":s,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}



/*
r=6;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
c1 = new Point(wide/4,high/4)
rings[r]={"shape":sa,"center":c1,"fromCenter":0,"ringSize":100,"segments":5,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}
r=7;sa = ~~(R.random_dec()*shapes.length);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
rings[r]={"shape":sa,"center":c1,"fromCenter":50,"ringSize":200,"segments":10,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=6;sa = ~~(rings[r].shape);d=~~(noise.get(r)*2);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
c1 = new Point(wide/4+wide/2,high/4)
rings[8]={"shape":sa,"center":c1,"fromCenter":0,"ringSize":100,"segments":5,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}
r=7;sa = ~~(rings[r].shape);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
rings[9]={"shape":sa,"center":c1,"fromCenter":50,"ringSize":200,"segments":10,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=6;sa = ~~(rings[r].shape);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
c1 = new Point(wide/4,high/4+high/2)
rings[10]={"shape":sa,"center":c1,"fromCenter":0,"ringSize":100,"segments":5,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}
r=7;sa = ~~(rings[r].shape);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
rings[11]={"shape":sa,"center":c1,"fromCenter":50,"ringSize":200,"segments":10,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

r=6;sa = ~~(rings[r].shape);d=~~(noise.get(r)*2);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
c1 = new Point(wide/4+wide/2,high/4+high/2)
rings[12]={"shape":sa,"center":c1,"fromCenter":0,"ringSize":100,"segments":5,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}
r=7;sa = ~~(rings[r].shape);d=~~(noise.get(r)*1);ro=~~(noise.get(r)*5);sx=~~(noise.get(r)*5);sy=~~(noise.get(r)*5);
rings[13]={"shape":sa,"center":c1,"fromCenter":50,"ringSize":200,"segments":10,"delete":1,"rotation":ro,"skewx":sx,"skewy":sy}

*/

//---- Draw the Layers

//var lineswidth= 5+R.random_dec()*10
for (z = 0; z < stacks; z++) {
    drawFrame(z); // Draw the initial frame
        
   
        if(z==-1){solid(z)} //Draw a solid background
         
         //-----Draw each layer
        if(z<stacks-1 && z!=-1 ){
            if (z==stacks-2){oset = minOffset}else{oset = ~~(minOffset*(stacks-z-1))}
            
            ri=5;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=4;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=3;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=2;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=1;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=0;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)

           /*
            ri=7;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=6;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)

            ri=9;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=8;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)

            ri=11;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=10;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)

            ri=13;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)
            ri=12;
            shapes[rings[ri].shape](z,oset,rings[ri].fromCenter,rings[ri].ringSize,rings[ri].center,rings[ri].segments,rings[ri].delete,rings[ri].rotation,rings[ri].skewx,rings[ri].skewy)

            */
            
            
            

        }
        
    if (orientation=="Square" && circular==2){frameIt(z,1);} else {frameIt(z,0);}// finish the layer with a final frame cleanup 

    cutMarks(z);
    hanger(z);// add cut marks and hanger holes
    if (z == stacks-1) {signature(z);}// sign the top layer
    sheet[z].scale(2.2);
    sheet[z].position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
   
    var group = new Group(sheet[z]);
    
    console.log(z)//Show layer completed in console


    

    
    
}//end z loop

//--------- Finish up the preview ----------------------- 

    // Build the features and trigger an fxhash preview
    var features = {};
    features.Size =  ~~(wide/100/ratio)+" x "+~~(high/100/ratio)+" inches";
    features.Width = ~~(wide/100/ratio);
    features.Height = ~~(high/100/ratio);
    features.Depth = stacks*0.0625;
    features.Layers = stacks;
    for (l=stacks;l>0;l--){
    var key = "layer: "+(stacks-l+1)
    features[key] = colors[l-1].Name
    }
    console.log(features);
    $fx.features(features);
    //$fx.preview();

    if (orientation=="Square" && circular==2){}else{floatingframe();}
     //upspirestudio(features); //#render and send features to upspire.studio


      var finalTime = new Date().getTime();
    var renderTime = (finalTime - initialTime)/1000
    console.log ('Render took : ' +  renderTime.toFixed(2) + ' seconds' );


        //if (testingGo == 'true'){refreshit();}

        async function refreshit() {
        //setquery("fxhash",null);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+' - '+renderTime.toFixed(0)+'secs.png');});
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        window.open('file:///Users/shawnkemp/dev/dotandslide/DotandSlide/index.html?testing=true', '_blank');
        }

//vvvvvvvvvvvvvvv PROJECT FUNCTIONS vvvvvvvvvvvvvvv 
 
 function pizza(z,offset,startX,endX,rotationPoint,segments,del,rot,skewx,skewy){
    sx=(stacks-z-2)*skewx;sy=(stacks-z-2)*skewy;
    var seg = 360/segments;
    var rad = (seg/2 * Math.PI) / 180;
   
    var h1=~~(Math.tan(rad)*startX);
    var h2=~~(Math.tan(rad)*(startX+endX/2));
    var h3=~~(Math.tan(rad)*(startX+endX));

    var a=new Point(rotationPoint.x+startX+sx,rotationPoint.y+sy)
    var a1=new Point(rotationPoint.x+startX+sx,rotationPoint.y-h1+sy)
    var a2=new Point(rotationPoint.x+startX+sx,rotationPoint.y+h1+sy)
    var b=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+sy)
    var b1=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y-h2+sy)
    var b2=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+h2+sy)
    var c=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+sy)
    var c1=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y-h3+sy)
    var c2=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+h3+sy)
    var e=new Point(rotationPoint.x+startX+endX+~~(endX/3)+sx,rotationPoint.y+sy)

    if (rot==0){var startR = 0;}else{var startR = seg/2;}
    px=0;py=0;
    
        for (d=del+1;d>0;d--){ //apply delete if del=1
            for (r=startR;r<360+startR;r=r+seg){
            
            lines = new Path();
            lines.add(a)
            lines.add(a1)
            lines.add(c1)
            lines.arcTo(e,c2)
            lines.add(a2)
            lines.add(a)
            
            lines.closed = true;
            //lines.smooth({ type: 'geometric' });
            lines.rotate(r,rotationPoint)
            if(d==2){sheet[z] = (sheet[z].subtract(lines));}
            else{  
                mesh = PaperOffset.offsetStroke(lines, offset);
                sheet[z] = (sheet[z].unite(mesh));
                mesh.remove(); lines.remove(); 
                project.activeLayer.children[project.activeLayer.children.length-2].remove();
                
                }
            }
        }
    }


function diamond(z,offset,startX,endX,rotationPoint,segments,del,rot,skewx,skewy){
    sx=(stacks-z-2)*skewx;sy=(stacks-z-2)*skewy;
    var seg = 360/segments;
    var rad = (seg/2 * Math.PI) / 180;
   
    var h1=~~(Math.tan(rad)*startX);
    var h2=~~(Math.tan(rad)*(startX+endX/2));
    var h3=~~(Math.tan(rad)*(startX+endX));

    var a=new Point(rotationPoint.x+startX+sx,rotationPoint.y+sy)
    var a1=new Point(rotationPoint.x+startX+sx,rotationPoint.y-h1+sy)
    var a2=new Point(rotationPoint.x+startX+sx,rotationPoint.y+h1+sy)
    var b=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+sy)
    var b1=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y-h2+sy)
    var b2=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+h2+sy)
    var c=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+sy)
    var c1=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y-h3+sy)
    var c2=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+h3+sy)
    var e=new Point(rotationPoint.x+startX+endX+~~(endX/3)+sx,rotationPoint.y+sy)

    if (rot==0){var startR = 0;}else{var startR = seg/2;}
    px=0;py=0;
    
        for (d=del+1;d>0;d--){ //apply delete if del=1
            for (r=startR;r<360+startR;r=r+seg){
            
            lines = new Path();
            lines.add(a)
            lines.add(b1)
            lines.add(c)
            lines.add(b2)
            lines.add(a)
            
            lines.closed = true;
            //lines.smooth({ type: 'geometric' });
            lines.rotate(r,rotationPoint)
            if(d==2){sheet[z] = (sheet[z].subtract(lines));}
            else{  
                mesh = PaperOffset.offsetStroke(lines, offset);
                sheet[z] = (sheet[z].unite(mesh));
                mesh.remove(); lines.remove(); 
                project.activeLayer.children[project.activeLayer.children.length-2].remove();
                
                }
            }
        }
    }

   
function pointyoval(z,offset,startX,endX,rotationPoint,segments,del,rot,skewx,skewy){
    sx=(stacks-z-2)*skewx;sy=(stacks-z-2)*skewy;
    var seg = 360/segments;
    var rad = (seg/2 * Math.PI) / 180;
   
    var h1=~~(Math.tan(rad)*startX);
    var h2=~~(Math.tan(rad)*(startX+endX/2));
    var h3=~~(Math.tan(rad)*(startX+endX));

    var a=new Point(rotationPoint.x+startX+sx,rotationPoint.y+sy)
    var a1=new Point(rotationPoint.x+startX+sx,rotationPoint.y-h1+sy)
    var a2=new Point(rotationPoint.x+startX+sx,rotationPoint.y+h1+sy)
    var b=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+sy)
    var b1=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y-h2+sy)
    var b2=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+h2+sy)
    var c=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+sy)
    var c1=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y-h3+sy)
    var c2=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+h3+sy)
    var e=new Point(rotationPoint.x+startX+endX+~~(endX/3)+sx,rotationPoint.y+sy)

    if (rot==0){var startR = 0;}else{var startR = seg/2;}
    px=0;py=0;
    
        for (d=del+1;d>0;d--){ //apply delete if del=1
            for (r=startR;r<360+startR;r=r+seg){
            
            lines = new Path();
            lines.add(a)
            lines.arcTo(b1,c)
            lines.arcTo(b2,a)

            
            lines.closed = true;
            //lines.smooth({ type: 'geometric' });
            lines.rotate(r,rotationPoint)
            if(d==2){sheet[z] = (sheet[z].subtract(lines));}
            else{  
                mesh = PaperOffset.offsetStroke(lines, offset);
                sheet[z] = (sheet[z].unite(mesh));
                mesh.remove(); lines.remove(); 
                project.activeLayer.children[project.activeLayer.children.length-2].remove();
                
                }
            }
        }
    }




    function elipsoid(z,offset,startX,endX,rotationPoint,segments,del,rot,skewx,skewy){
    sx=(stacks-z-2)*skewx;sy=(stacks-z-2)*skewy;
    var seg = 360/segments;
    var rad = (seg/2 * Math.PI) / 180;
   
    var h1=~~(Math.tan(rad)*startX);
    var h2=~~(Math.tan(rad)*(startX+endX/2));
    var h3=~~(Math.tan(rad)*(startX+endX));

    var a=new Point(rotationPoint.x+startX+sx,rotationPoint.y+sy)
    var a1=new Point(rotationPoint.x+startX+sx,rotationPoint.y-h1+sy)
    var a2=new Point(rotationPoint.x+startX+sx,rotationPoint.y+h1+sy)
    var b=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+sy)
    var b1=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y-h2+sy)
    var b2=new Point(rotationPoint.x+startX+~~(endX/2)+sx,rotationPoint.y+h2+sy)
    var c=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+sy)
    var c1=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y-h3+sy)
    var c2=new Point(rotationPoint.x+startX+endX+sx,rotationPoint.y+h3+sy)
    var e=new Point(rotationPoint.x+startX+endX+~~(endX/3)+sx,rotationPoint.y+sy)

    if (rot==0){var startR = 0;}else{var startR = seg/2;}
    px=0;py=0;
    
        for (d=del+1;d>0;d--){ //apply delete if del=1
            for (r=startR;r<360+startR;r=r+seg){
            
            lines = new Path();
            lines.add(a)
            lines.arcTo(b1,c)
            lines.arcTo(b2,a)

            var lines = new Path.Ellipse({
            center: [b.x,b.y],
            radius: [~~((startX+endX)/2), h2]
            });

            
            lines.closed = true;
            //lines.smooth({ type: 'geometric' });
            lines.rotate(r,rotationPoint)
            if(d==2){sheet[z] = (sheet[z].subtract(lines));}
            else{  
                mesh = PaperOffset.offsetStroke(lines, offset);
                sheet[z] = (sheet[z].unite(mesh));
                mesh.remove(); lines.remove(); 
                project.activeLayer.children[project.activeLayer.children.length-2].remove();
                
                }
            }
        }
    }




//^^^^^^^^^^^^^ END PROJECT FUNCTIONS ^^^^^^^^^^^^^ 




//--------- Helper functions ----------------------- 

function floatingframe(){
    var frameWide=~~(34*ratio);var frameReveal = ~~(12*ratio);
  if (framegap.isEmpty()){
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(~~(wide+frameReveal*2), ~~(high+frameReveal*2)), framradius)
        var insideframe = new Path.Rectangle(new Point(frameReveal, frameReveal),new Size(wide, high)) 
        framegap = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        framegap.scale(2.2);
        framegap.position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
        framegap.style = {fillColor: '#1A1A1A', strokeColor: "#1A1A1A", strokeWidth: 1*ratio};
    } else {framegap.removeChildren()} 
    
    if (woodframe.isEmpty()){
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide+frameWide*2+frameReveal*2, high+frameWide*2+frameReveal*2), framradius)
        var insideframe = new Path.Rectangle(new Point(frameWide, frameWide),new Size(wide+frameReveal*2, high+frameReveal*2)) 
        woodframe = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        woodframe.scale(2.2);
        woodframe.position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
        var framegroup = new Group(woodframe);
        woodframe.style = {fillColor: '#60513D', strokeColor: "#60513D", strokeWidth: 1*ratio,shadowColor: new Color(0,0,0,[0.5]),shadowBlur: 20,shadowOffset: new Point(10*2.2, 10*2.2)};
    } else {woodframe.removeChildren()} 
}

function rangeInt(range,x,y,z){
    var v = ~~(range-(noise.get(x,y,z)*range*2));
    return (v);
}

// Add shape s to sheet z
function join(z,s){
    sheet[z] = (s.unite(sheet[z]));
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

// Subtract shape s from sheet z
function cut(z,s){
    sheet[z] = sheet[z].subtract(s);
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function drawFrame(z){
    var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
    var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
    if (orientation=="Square" && circular==2){var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);}
    if (orientation=="Square" && circular==2){var insideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2-framewidth);}


    sheet[z] = outsideframe.subtract(insideframe);
    outsideframe.remove();insideframe.remove();
}


function solid(z){ 
    outsideframe = new Path.Rectangle(new Point(1,1),new Size(wide-1, high-1), framradius)
    //outsideframe = new Path.Circle(new Point(wide/2),wide/2)
    sheet[z] = sheet[z].unite(outsideframe);
    outsideframe.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}



function frameIt(z,round){
        //Trim to size
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
        if (round==1){var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2)};
        sheet[z] = outsideframe.intersect(sheet[z]);
        outsideframe.remove();
        project.activeLayer.children[project.activeLayer.children.length-2].remove();

        //Make sure there is still a solid frame
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
        var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
        if (round==1){var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);}
        if (round==1){var insideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2-framewidth);}

        var frame = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        sheet[z] = sheet[z].unite(frame);
        frame.remove();
        project.activeLayer.children[project.activeLayer.children.length-2].remove();
         
        
        sheet[z].style = {fillColor: colors[z].Hex, strokeColor: linecolor.Hex, strokeWidth: 1*ratio,shadowColor: new Color(0,0,0,[0.3]),shadowBlur: 20,shadowOffset: new Point((stacks-z)*2.3, (stacks-z)*2.3)};
}

function cutMarks(z){
    if (z<stacks-1 && z!=0) {
          for (etch=0;etch<stacks-z;etch++){
                var layerEtch = new Path.Circle(new Point(50+etch*10,25),2)
                cut(z,layerEtch)
            } 
        }
}

function signature(z){
    shawn = new CompoundPath(sig);
    shawn.strokeColor = 'green';
    shawn.fillColor = 'green';
    shawn.strokeWidth = 1;
    shawn.scale(ratio*.9)
    shawn.position = new Point(wide-framewidth-~~(shawn.bounds.width/2), high-framewidth+~~(shawn.bounds.height));
    cut(z,shawn)
}


function hanger (z){
    if (z < stacks-2 && scale>0){
        var r = 30*ratio;
        rt = 19*ratio;
        if (z<3){r = 19*ratio}
        layerEtch = new Path.Rectangle(new Point(framewidth/2, framewidth),new Size(r*2, r*3), r)
        layerEtch.position = new Point(framewidth/2,framewidth);   
        cut(z,layerEtch)

        layerEtch = new Path.Rectangle(new Point(wide-framewidth/2, framewidth),new Size(r*2, r*3), r)
        layerEtch.position = new Point(wide-framewidth/2,framewidth);   
        cut(z,layerEtch)

        layerEtch = new Path.Rectangle(new Point(wide/2, framewidth/2),new Size(r*4, r*2), r)
        layerEtch.position = new Point(wide/2,framewidth/2);   
        cut(z,layerEtch)
    }
}



//--------- Interaction functions -----------------------
var interactiontext = "Interactions\nB = Blueprint mode\nV = Export SVG\nP = Export PNG\nC = Export colors as TXT\nE = Show layers\n"

view.onDoubleClick = function(event) {
    console.log("png")
    canvas.toBlob(function(blob) {saveAs(blob, $fx.hash+'.png');});
};

document.addEventListener('keypress', (event) => {

       //Save as SVG 
       if(event.key == "v") {
            fileName = $fx.hash;
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
            var key = [];for (l=stacks;l>0;l--){key[stacks-l] = colors[l-1].Name;}; 
            var svg1 = "<!--"+key+"-->" + paper.project.exportSVG({asString:true})
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg1);
            var link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();
            }


       //Format for Lightburn
       if(event.key == "b") {
        floatingframe();
            for (z=0;z<stacks;z++){
                sheet[z].style = {fillColor: null,strokeWidth: .1,strokeColor: lightburn[stacks-z-1].Hex,shadowColor: null,shadowBlur: null,shadowOffset: null}
                sheet[z].selected = true;}
            }

            //new hash
           if(event.key == " ") {
                setquery("fxhash",null);
                location.reload();
                }

            //toggle half vs full width
            if(event.key == "0") {
            if(w){setquery("w",null);}
            if(wide==800) {setquery("w","4");}
            location.reload();
            }

        //scale
       if(event.key == "1" || event.key =="2" ||event.key =="3" || event.key =="4") {
            setquery("scale",event.key);
            location.reload();
            }

        //oriantation
       if(event.key == "w" || event.key =="t" ||event.key =="s" ) {
            setquery("orientation",event.key);
            location.reload();
            }

        //help
       if(event.key == "h" || event.key == "/") {
            alert(interactiontext);
            }

  

            //layers
       if(event.key == "l") {
            var l = prompt("How many layers", stacks);
            setquery("layers",l);
            location.reload();
            }
        
        
        //Save as PNG
        if(event.key == "p") {
            canvas.toBlob(function(blob) {saveAs(blob, $fx.hash+'.png');});
            }

        //Export colors as txt
        if(event.key == "c") {
            var key = [];
            for (l=stacks;l>0;l--){
                key[stacks-l] =  colors[l-1].Name;
            }; 
            console.log(key.reverse())
            var content = JSON.stringify(key.reverse())
            var filename = $fx.hash + ".txt";
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename);
            }


       //Explode the layers     
       if(event.key == "e") {     
            h=0;t=0;maxwidth=3000;
               for (z=0; z<sheet.length; z++) { 
               sheet[z].scale(1000/2300)   
               sheet[z].position = new Point(wide/2,high/2);        
                    sheet[z].position.x += wide*h;
                    sheet[z].position.y += high*t;
                    sheet[z].selected = true;
                    if (wide*(h+2) > panelWide) {maxwidth=wide*(h+1);h=0;t++;} else{h++};
                    }  
            paper.view.viewSize.width = maxwidth;
            paper.view.viewSize.height = high*(t+1);
           }
 
}, false); 
}