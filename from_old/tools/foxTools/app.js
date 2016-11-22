/**
 * Created by gbox3d on 13. 10. 4..
 */

var App = {
    editor_info : {
        width : 512,
        height : 512
    },
    editor : {

    }
};


//console.log(gbox3d.helper.css.getElementWidth(document.getElementById('kinetic_stage_editor')));

App.SpriteData = {
    name : "",
    frames : []
};

//시작용 하나추가..
App.SpriteData.frames.push({

    sheets : []

});

//이미지 뷰어창
var stage = new Kinetic.Stage({
    container : "kinetic_stage",
    width : App.editor_info.width,
    height : App.editor_info.height
});

var layer = new Kinetic.Layer({
    name : 'root_layer'
});
stage.add(layer); //스테이지 붙이기

//스프라이트 에디터창
var stage_editor = new Kinetic.Stage({
    container : "kinetic_stage_editor",
    width : App.editor_info.width,
    height : App.editor_info.height
});

var layer_editor = new Kinetic.Layer({
    name : 'root_layer2'
});
stage_editor.add(layer_editor);

App.editor.ImageCutterStage = stage;
App.editor.SpriteEditStage = stage_editor;


function InitSpriteWindowGrid() {


//그리드 관련
    function drawGridSprite(size) {

        var svg = d3.select('#sprite_window .grid-sprite');

        var grid_svg = d3.select('#sprite_window .grid-sprite .detail');
        grid_svg.select('.grid-root').remove();

        var g = grid_svg.append('g')
            .attr('class','grid-root');

        var width = App.editor_info.width * 4;
        var height = App.editor_info.height * 4;

        svg.style('width',width)
            .style('height',height)
            .style('-webkit-transform','translate('+ ((-width/2) + App.editor_info.width/2)  +'px,'+ (-height/2 + App.editor_info.height/2 ) +'px)');

        for(var i=0; i < (width/size) ; i++)
        {
            g.append('line')
                .attr('x1',size*i)
                .attr('x2',size*i)
                .attr('y1',0)
                .attr('y2',height)
                .style('stroke',document.querySelector('#control-sprite-frame .grid-color').value);
        }

        for(var i=0; i < (height/size) ; i++) {
            g.append('line')
                .attr('x1',0)
                .attr('x2',width)
                .attr('y1',size*i)
                .attr('y2',size*i)
                .style('stroke',document.querySelector('#control-sprite-frame .grid-color').value);

        }

        //축 그리기
        var g_axies = d3.select('#sprite_window .grid-sprite .axies');

        g_axies.select('.root').remove();
        var g_axies_root = g_axies.append('g')
            .attr('class','root');

        g_axies_root.append('line')
            .attr('x1',width/2)
            .attr('x2',width/2)
            .attr('y1',0)
            .attr('y2',height)
            .style('stroke','black');

        g_axies_root.append('line')
            .attr('x1',0)
            .attr('x2',width)
            .attr('y1',height/2)
            .attr('y2',height/2)
            .style('stroke','black');



    }

    document.querySelector('#control-sprite-frame .chk-grid-show').addEventListener('change',function(evt) {

        //console.log(evt.target.checked);

        if(evt.target.checked) {

            drawGridSprite(document.querySelector('#control-sprite-frame .grid-size').value);

            //d3.select('#sprite_window .grid-root')
            //    .style('visibility','visible');
        }
        else {
            d3.select('#sprite_window .grid-root')
                .style('visibility','hidden');

        }

    });

    document.querySelector('#control-sprite-frame .grid-color').addEventListener('change',function(evt) {

        var g = d3.select('#sprite_window .grid-root');

        //console.log(evt.target.value);

        //console.log(g.selectAll('line'));

        g.selectAll('line')
            .style('stroke',function(d,i) {

                //console.log(i);

                return evt.target.value;

            });


    });

}

/////////////


