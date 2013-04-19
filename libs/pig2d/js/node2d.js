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
 * 1. 씬트리관리 함수 추가 setParent,removeChild 함수
 * 2. 씬 오더링 문재 해결
 * 3. 변환 메트릭스 추가
 *
*
 */


Pig2d = {};

Pig2d.model = Backbone.Model.extend({
    initialize: function() {

        this.attributes.translation = new gbox3d.core.Vect2d(0,0);
        this.attributes.scale = new gbox3d.core.Vect2d(1,1);
        this.attributes.matrix = new mat2d.create();

    },
    defaults: {
        rotation : 0
    },
    setPosition : function(x,y) {

        this.attributes.translation.set(x,y);

        return this;
    },

    setRotation : function(angle) {
        this.attributes.rotation = angle;
        return this;
    },
    rotate : function(angle_delata) {
        this.attributes.rotation += angle_delata;
        return this;
    },
    setScale : function(x,y) {

        this.attributes.scale.set(x,y);

        return this;

    },
    updateCSS : function(element) {

        var trans = this.attributes.translation;
        var rot = this.attributes.rotation;
        var scale = this.attributes.scale;

        //mat2d.setRotation(this.attributes.matrix);
        mat2d.setTranslation(this.attributes.matrix,trans.X,trans.Y);


        var css_val =    'translate(' +  trans.X+'px,' + trans.Y+'px)' +
            ' rotate('+ rot +'deg)' +
            ' scale(' + scale.X +','+ scale.Y +')';

        $(element).css('-webkit-transform',css_val);
    }
});

Pig2d.SpriteModel = Pig2d.model.extend({
    initialize: function() {
        Pig2d.model.prototype.initialize.call(this);
        this.attributes.currentFrame = 0;


    },
    updateCSS : function (element) {

        Pig2d.model.prototype.updateCSS.call(this,element);

        var texture =  this.attributes.data.texture;
        var frame = this.attributes.data.frames[this.attributes.currentFrame];

        var sheet = frame.sheet[0];

        var css_val ="-" + sheet.x+"px " + "-" + sheet.y +"px";

        $(element).css('background-position',  css_val );
        $(element).css('width',  sheet.width + 'px' );
        $(element).css('height',  sheet.height + 'px' );
        $(element).css('background-image','url('+ texture +')');


    }
});

//////////////////node//
/////////////////////////

Pig2d.node = Backbone.Model.extend({
    initialize: function() {

        this.attributes.chiledren = new Array();
        this.show(false);

        if(this.attributes.name != undefined) {
            $(this.attributes.el).attr('id',this.attributes.name);
        }

    },
    update: function(applyChild) {

        this.attributes.model.updateCSS(this.get('el'));

        if( applyChild == true) {
            for(var index in this.attributes.chiledren) {

                this.attributes.chiledren[index].update(applyChild);

            }
        }

        return this;

    },
    show : function(bVisible) {
        if(bVisible == true) {
            $(this.attributes.el).css('visibility','visible');         /* visible|hidden|collapse|inherit */

        }
        else {
            $(this.attributes.el).css('visibility','hidden');
        }
        return this;

    },
    clone : function() {

        var clone_el = $(this.attributes.el).clone();
        $(clone_el).removeAttr('id');
        var clone_model = this.attributes.model.clone();

        return new Pig2d.node({
            el : clone_el,
            model :   clone_model
        });

    },
    findByName : function(name) {

        if(name == this.attributes.name) return this;

        for(var index in this.attributes.chiledren ) {
            var obj = this.attributes.chiledren[index].findByName(name);
            if(obj != null)
                return obj;
        }
        return null;
    },
    add : function(child_node,parents) {

        if(parents == undefined || parents == null) {
            parents = this;
        }

        parents.get('chiledren').push(child_node);
        $(parents.attributes.el).append($(child_node.get('el')));
        child_node.attributes.parent = parents;

    },
    setDrawOrder : function(order) {
        $(this.attributes.el).css('z-index',order);
    }
});


///////////////matrix2d

mat2d.setRotation = function(a,rad) {

    var st = Math.sin(rad),
    ct = Math.cos(rad);

    a[0] = ct;
    a[1] = st;
    a[2] = -st;
    a[3] = ct;
}


mat2d.setTranslation = function(a,tx,ty) {

    a[4] = tx;
    a[5] = ty;
}

