/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 6. 1.
 * Time: 오전 10:52
 * To change this template use File | Settings | File Templates.
 *
 * tested kinetic version : 4.5.x
 *
 */



gbox3d.Kinetic = {};
gbox3d.Kinetic.Util = {};

gbox3d.Kinetic.Util.Cutter = function (layer) {

    //최상위 객체 자신..
    var theThat = this;

    var cutter_group = new Kinetic.Group({
        x: 0,
        y: 0,
        name : "cutter",
        draggable: true
    });
    layer.add(cutter_group);

    var RectShape = new Kinetic.Shape({
        drawFunc: function(canvas) {
            var context = canvas.getContext();

            if(this.rgnInfo == undefined) {
                this.rgnInfo = {
                    start : new gbox3d.core.Vect2d(0, 0),
                    end : new gbox3d.core.Vect2d(100, 100)

                };

            }
            //console.log(this.rgnInfo);
            context.beginPath();
            var size = this.rgnInfo.end.sub(this.rgnInfo.start);
            context.rect(this.rgnInfo.start.X,this.rgnInfo.start.Y,size.X,size.Y);
            context.stroke();
            context.closePath();
            canvas.fillStroke(this);
        },
        name : "rgn",
        stroke: 'black',
        strokeWidth: 1
    });

    cutter_group.add( RectShape  );

    var anchor_group = new Kinetic.Group({x:0,y:0});
    cutter_group.add(anchor_group);

    var anchor_topleft = addAnchor( 0, 0, "topLeft",anchor_group);
    var anchor_topRight =addAnchor(100, 0, "topRight",anchor_group);
    var anchor_bottomRight =addAnchor(100, 100, "bottomRight",anchor_group);
    var anchor_bottomLeft =addAnchor(0, 100, "bottomLeft",anchor_group);

    cutter_group.on("mouseover",function() {
        anchor_group.show();
        layer.draw();
    });

    cutter_group.on("mouseout",function() {
        anchor_group.hide();
        layer.draw();
    });



    cutter_group.on("dragmove",function(evt) {
        anchor_group.show();
        layer.draw();

        if(theThat.OnDragMove != undefined) {
            theThat.OnDragMove(evt);
        }

        //console.log('base call');
    });


    //사각형 영역을 갱신해주는 함수.
    function update(group, activeAnchor) {
        var topLeft = group.get(".topLeft")[0];
        var topRight = group.get(".topRight")[0];
        var bottomRight = group.get(".bottomRight")[0];
        var bottomLeft = group.get(".bottomLeft")[0];
        var rgn = cutter_group.get(".rgn")[0];
        //var image = group.get(".image")[0];


        // update anchor positions
        switch (activeAnchor.getName()) {
            case "topLeft":
                topRight.setY(activeAnchor.getY());
                bottomLeft.setX(activeAnchor.getX());
                break;
            case "topRight":
                topLeft.setY(activeAnchor.getY());
                bottomRight.setX(activeAnchor.getX());
                //topLeft.attrs.y = activeAnchor.attrs.y;
                //bottomRight.attrs.x = activeAnchor.attrs.x;
                break;
            case "bottomRight":
                bottomLeft.setY(activeAnchor.getY());
                topRight.setX(activeAnchor.getX());
                //bottomLeft.attrs.y = activeAnchor.attrs.y;
                //topRight.attrs.x = activeAnchor.attrs.x;
                break;
            case "bottomLeft":
                //console.log(activeAnchor.getName());
                bottomRight.setY(activeAnchor.getY());
                topLeft.setX(activeAnchor.getX());
                //bottomRight.attrs.y = activeAnchor.attrs.y;
                //topLeft.attrs.x = activeAnchor.attrs.x;
                break;
        }

        rgn.rgnInfo.start.set_point(topLeft.getPosition());
        rgn.rgnInfo.end.set_point(bottomRight.getPosition());
    }

    //편집 앵커 객체들을 추가 하는 함수
    function addAnchor( x, y, name,group) {

        var layer = group.getLayer();

        var anchor = new Kinetic.Circle({
            x : x,
            y : y,
            stroke : "#666",
            fill : "#ddd",
            strokeWidth : 2,
            radius : 8,
            name : name,
            draggable : true
        });

        anchor.on("dragmove", function() {
            update(group, this);
            this.show();
            layer.draw();
        });
        anchor.on("mousedown touchstart", function() {
            group.setDraggable(false);
            this.moveToTop();
        });
        anchor.on("dragend", function() {
            group.setDraggable(true);
            layer.draw();
        });
        // add hover styling
        anchor.on("mouseover", function() {
            var layer = this.getLayer();
            document.body.style.cursor = "pointer";
            this.setStrokeWidth(4);
            layer.draw();
        });
        anchor.on("mouseout", function() {
            var layer = this.getLayer();
            document.body.style.cursor = "default";
            this.setStrokeWidth(2);
            layer.draw();
        });

        group.add(anchor);

        return anchor;
    }

    this.getRect = function(offset) {

        if(offset == undefined)
        {
            offset = {x:0,y:0};
        }

        var cutterpos = new gbox3d.core.Vect2d(cutter_group.getPosition());
        var rgninfo = RectShape.rgnInfo; //특권함수 장점을 살려 그냥 내부 변수 바로 접근하긔

        var start = rgninfo.start.clone();
        var end = rgninfo.end.clone();

        start.addToThis(cutterpos);
        end.addToThis(cutterpos);

        return {sx:start.X+offset.x,sy:start.Y+offset.y,width:(end.X - start.X),height:(end.Y - start.Y)};
    };

    this.setRect = function(start,end) {

        var rgninfo = RectShape.rgnInfo;

        rgninfo.start.set(0,0);
        rgninfo.end.copy(end.sub(start));


        //var rgn = cutter_group.get(".rgn")[0];

        cutter_group.setX(start.X);
        cutter_group.setY(start.Y);

        anchor_topleft.setX(0);
        anchor_topleft.setY(0);

        anchor_topRight.setX(end.X - start.X);
        anchor_topRight.setY(0);

        anchor_bottomLeft.setX(0);
        anchor_bottomLeft.setY(end.Y - start.Y);

        anchor_bottomRight.setX(end.X - start.X);
        anchor_bottomRight.setY(end.Y - start.Y);

        //rgnInfo.start.set_point(topLeft.getPosition());
        //rgn.rgnInfo.end.set_point(bottomRight.getPosition());



        layer.draw();
        //anchor_topleft.draw();
        //console.log(anchor_topleft.getX());
    }

}

//시터 편집 객체
gbox3d.Kinetic.Util.Sheeter = function (param) {

    //최상위 객체 자신..
    var theThat = this;



    var attrs = {};

    attrs.layer = param.layer;

    var current_node = param.current_node;

    //편집 사각형 구룹생성
    var main_group = new Kinetic.Group({
        x: 0,
        y: 0,
        name : "main_group",
        draggable: true
    });

    attrs.layer.add(main_group);

    var RectShape = new Kinetic.Shape({
        drawFunc: function(canvas) {

            var context = canvas.getContext();

            context.beginPath();
            var size = this.attrs.rgnInfo.end.sub(this.attrs.rgnInfo.start);
            context.rect(this.attrs.rgnInfo.start.X,this.attrs.rgnInfo.start.Y,size.X,size.Y);
            context.stroke();
            context.closePath();
            canvas.fillStroke(this);
        },
        name : "rgn",
        stroke: 'black',
        strokeWidth: 1,
        rgnInfo : {
            start : new gbox3d.core.Vect2d(0, 0),
            end : new gbox3d.core.Vect2d(100, 100)

        }
    });

    //console.log(RectShape);

    main_group.add( RectShape  );
    main_group.on("dragmove",function(evt) {

        //console.log('drag');
        //attr.layer.draw();

        if(current_node != null) {
            var rect = theThat.getRect();
            $(current_node).css('-webkit-transform','translate(' + rect.sx +'px,' + rect.sy +'px)');
        }
        else {
            console.log('current node null');
        }

        if(theThat.OnDragMove != undefined) {
            theThat.OnDragMove(evt);
        }


    });

    //앵커 구룹 만들기
    var anchor_group = new Kinetic.Group({x:0,y:0});
    main_group.add(anchor_group);

    //console.log('anchor');
    //삭제 앵커 추가 여부
    if(param.NoDelelteAnchor) {

    }
    else {
        //삭제 앵커 추가
        (function ( x, y, name,group) {

            var layer = group.getLayer();

            var anchor = new Kinetic.Circle({
                x : x,
                y : y,
                stroke : "#666",
                fill : "#d00",
                strokeWidth : 2,
                radius : 8,
                name : name,
                draggable : true
            });


            anchor.on("mousedown touchstart", function(evt) {

                //console.log('click');

                $(current_node).remove();

                current_node = null;

                main_group.hide();

            });
            group.add(anchor);

            return anchor;
        })( 0, 0, "topLeft",anchor_group);

    }




    /////////////////
    //멤버 함수 선언하기

    //싸이즈 조정함수
    this.setRect = function(param) {

        RectShape.attrs.rgnInfo = {
            start : param.start,
            end : param.end

        };

        //param.layer.draw();
        //attr.layer.draw();

        return this;
    }

    this.getRect = function(offset) {
        if(offset == undefined)
        {
            offset = {x:0,y:0};
        }

        var cutterpos = new gbox3d.core.Vect2d(main_group.getPosition());
        var rgninfo = RectShape.attrs.rgnInfo; //특권함수 장점을 살려 그냥 내부 변수 바로 접근하기

        var start = rgninfo.start.clone();
        var end = rgninfo.end.clone();

        start.addToThis(cutterpos);
        end.addToThis(cutterpos);

        return {sx:start.X+offset.x,sy:start.Y+offset.y,width:(end.X - start.X),height:(end.Y - start.Y)};
    }

    this.setCurrentNode= function(node) {
        current_node = node;

        var rect = theThat.getRect();
        $(current_node).css('-webkit-transform','translate(' + rect.sx +'px,' + rect.sy +'px)');

        return this;
    }

    this.show = function() {
        main_group.show();

        //attr.layer.draw();

        return this;
    }
    this.hide = function() {
        main_group.hide();

        //attr.layer.draw();

        return this;
    }

    this.setPosition = function(x,y) {

        main_group.setPosition(x,y);

    }
    this.getPosition = function() {
        return new gbox3d.core.Vect2d(main_group.getPosition());
    }

    main_group.hide();
    //레이어 갱신해주기
    attrs.layer.draw();
}