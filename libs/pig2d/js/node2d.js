/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 3. 30.
 * Time: 오후 3:35
 *
 * it is parts of pig2d engine
 * this engine is base on html5 css3
 *
 * todos..
 *
 * 1)더미노드
 * 2)이동(translate,rotate) 함수
 * 3)transition 연동 애니메이터
 * 4) 샘플게임개발 Total Army - the macrobots
*
 */


Pig2d = {};
Pig2d.model = Backbone.Model.extend({
    initialize: function() {

        //console.log(this.get('texture'));

    },
    defaults: {
        frames : [],
        texture : '',
        frame_index : 0,
        //Transform: new gbox3d.core.Matrix4(true),
        rotation : 0,
        translation : new gbox3d.core.Vect2d(0,0),
        scale : new gbox3d.core.Vect2d(1,1)
    }
});

Pig2d.node = Backbone.View.extend({
    initialize: function(param) {
        _.bindAll(this, 'render');

        this.data = new Pig2d.model(
            param.data
        );
        this.show(false);
        //this.frame_index = 0;
        //this.render();


    },
    render: function() {

        var sheet = this.data.attributes.frames[0][0];
        var texture =  this.data.attributes.texture;
        var transform = this.data.attributes.Transform;

        var css_val ="-" + sheet.x+"px " + "-" + sheet.y +"px";
        //console.log(css_val);


        $(this.el).css('background-position',  css_val );
        $(this.el).css('width',  sheet.width + 'px' );
        $(this.el).css('height',  sheet.height + 'px' );
        $(this.el).css('background-image','url('+ texture +')');

        var trans = this.data.attributes.translation;
        var rot = this.data.attributes.rotation;
        var scale = this.data.attributes.scale;

        css_val =    'translate(' +  trans.X+'px,' + trans.Y+'px)' +
            ' rotate('+ rot +'deg)' +
            ' scale(' + scale.X +','+ scale.Y +')';
        //console.log(css_val);

        $(this.el).css('-webkit-transform',css_val);

        return this;

    },
    setPosition : function(x,y) {
//        var transform = this.data.attributes.Transform;
//        transform.setTranslation(new gbox3d.core.Vect3d(x,y,0));

        this.data.attributes.translation.set(x,y);

        return this;
    },
    setRotation : function(angle) {
//        var transform = this.data.attributes.Transform;
//        transform.setRotationDegrees(new gbox3d.core.Vect3d(0,0,angle));
        this.data.attributes.rotation = angle;
        return this;
    },
    setScale : function(x,y) {
//        var transform = this.data.attributes.Transform;
//        transform.setScale(new gbox3d.core.Vect3d(x,y,1));

        this.data.attributes.scale.set(x,y);

        return this;

    },
    show : function(bVisible) {
        if(bVisible == true) {
            $(this.el).css('visibility','visible');         /* visible|hidden|collapse|inherit */

        }
        else {
            $(this.el).css('visibility','hidden');
        }
        return this;

    },
    clone : function(element) {
        return new Pig2d.node({
            el : $(element),
            data : {
                frames : this.data.attributes.frames,
                texture : this.data.attributes.texture
            }
        });

    }


});