/**
 * Created by gbox3d on 2013. 11. 13..
 */


//툴 메인
//////////////////////////////////////
(function() {

    var scrollPos={x:0,y:0};
    var current_frame_index = 0;
    var current_sheet_element = null;
    var current_texture = null; //이미지 오브잭트

    App.editor.ScrollPos = scrollPos;


    //자르기 툴
    var cutter = new gbox3d.Kinetic.Util.Cutter(layer);
    App.editor.Cutter = cutter;

    //스프라이트 위치 편집툴
    var sheeter = new gbox3d.Kinetic.Util.Sheeter(
        {
            layer : layer_editor,
            NoDelelteAnchor : true
        }
    );
    App.editor.Sheeter = sheeter;

    App.editor.Overlay_Root_sheet = document.getElementById('overlay-sheet-root');
    App.editor.Overlay_sheet = document.createElement('div');
    App.editor.Overlay_sheet.classList.add('sheet');

    App.editor.Overlay_sheet.style.position = 'absolute';
    App.editor.Overlay_sheet.style.visibility = 'hidden';
    App.editor.Overlay_Root_sheet.appendChild(App.editor.Overlay_sheet);

    App.editor.camObj = new camera({
        listener_element : document.querySelector("#sprite_window"),
        target_element : document.querySelector("#sprite_window .camera")
    });

    //그리드 초기화
    InitSpriteWindowGrid();


    //시트추가하기
    function addSheet() {
        if(current_sheet_element == null) {

            current_sheet_element = $('<div></div>')
                .addClass('sheet')
                .addClass("editing")
                .appendTo('#sheet-root');
        }

        else {

            current_sheet_element.removeClass("editing");
            current_sheet_element.addClass("edited");

            current_sheet_element = $('<div></div>')
                .addClass('sheet')
                .addClass("editing")
                .appendTo('#sheet-root');

        }

        current_sheet_element.css('position','absolute');
        current_sheet_element.css('background-image','url('+ App.imgObj.src + ')');


        var cut_rect = App.editor.Cutter.getRect(App.editor.ScrollPos);

        App.editor.Sheeter.setPosition(
            App.editor_info.width/2 - (cut_rect.width/2)  ,
            App.editor_info.height/2 - (cut_rect.height/2)
        );

        App.editor.Sheeter.setCurrentNode(current_sheet_element);

    }

    function Node2Sheet(node) {

        var width =  parseInt( node.css('width').slice(0,-2));
        var height = parseInt (node.css('height').slice(0,-2));

        //console.log(node.css('-webkit-transform'));

        var sx,sy
        var strmat = node.css('-webkit-transform');

        if(strmat == 'none') {
            sx = 0;
            sy = 0;

        }
        else {

            strmat = strmat.slice(0,-1);
            strmat = strmat.slice(7,strmat.length);

            var temp = strmat.split(',');

            sx = parseInt( temp[4]);
            sy = parseInt( temp[5] );
        }

        var bp_x,bp_y;
        strmat = node.css('background-position');

        if(strmat == 'none') {
            bp_x = 0;
            bp_y = 0;
        }
        else {
            var temp = strmat.split('px');
            bp_x = parseInt(temp[0]);
            bp_y = parseInt(temp[1]);
        }

        return {
            x:sx,
            y:sy,
            width:width,
            height:height,
            centerOffset: {x:0,y:0},
            bp_x : bp_x,
            bp_y : bp_y,
            scrollpos : node.data('scrollpos'),
            texture: node.data('texture')

        }

    }

    //dom 내용을 메모리에 저장
    function storeFrame(index,sheet_root) {

        var frame = {};
        frame.sheets = [];

        var sheet_nodes = $(sheet_root).find('.sheet');

        $.each(sheet_nodes,function(index,node) {
            var sheet = Node2Sheet($(node));
            frame.sheets.push(sheet);
        });

        frame.delay = $('#inp-framedelay').val();

        App.SpriteData.frames[index] = frame;

    }

    //메모리 내용을 dom으로 복귀
    function restoreFrame(index,sheet_root) {

        var frame = App.SpriteData.frames[index];

        if(!App.imgObj) {

            alert('텍스춰를 선택해주세요');

        }
        else {
            $.each(frame.sheets,function(i,d) {

                $('<div></div>')
                    .addClass("sheet")
                    .addClass("edited")
                    .css('width', d.width)
                    .css('height', d.height)
                    .css('-webkit-transform','translate('+ d.x + 'px,' + d.y+'px)')
                    .css('background-image','url(' + App.imgObj.src + ')')
                    .css('background-position',d.bp_x +'px ' + d.bp_y + 'px')
                    .data('texture', d.texture)
                    .data('scrollpos', d.scrollpos)
                    .appendTo(sheet_root);
            });//each end


            $('#inp-framedelay').val( frame.delay ? frame.delay : 100 );


            //보조 프레임
            var pre_frame;

            if(index > 0) {
                pre_frame = App.SpriteData.frames[index-1];

            }
            else {
                pre_frame = App.SpriteData.frames[App.SpriteData.frames.length-1];
            }

            var sheet = pre_frame.sheets[0];

            App.editor.Overlay_sheet.style.width = sheet.width + 'px';
            App.editor.Overlay_sheet.style.height = sheet.height + 'px';
            App.editor.Overlay_sheet.style.WebkitTransform = 'translate('+ sheet.x + 'px,' + sheet.y+'px)';
            App.editor.Overlay_sheet.style.backgroundImage = 'url(' + App.imgObj.src + ')';
            App.editor.Overlay_sheet.style.backgroundPosition = sheet.bp_x +'px ' + sheet.bp_y + 'px';
            //App.editor.style
        }
    }
    ///////
    //새로운 프레임 만들기
    function addFrame() {

        //시터 숨기기
        sheeter.hide();
        layer_editor.draw();

        storeFrame($('#slider-frame-select').val(),$('#sheet-root'));
        $('#sheet-root').empty();

        //새로운 빈프레임 추가
        App.SpriteData.frames.push({
            sheets : []
        });

        current_sheet_element = null;
        current_frame_index = App.SpriteData.frames.length-1;

        $('#slider-frame-select').attr("max",current_frame_index);
        $('#slider-frame-select').val(current_frame_index);
        $('#control-sprite-frame .frameindex').text(current_frame_index);
    }

    //커팅에리어정보 업데이트
    function OnUpdateCutter() {
        var cut_rect = App.editor.Cutter.getRect(App.editor.ScrollPos);
        document.getElementById('inp-cutter-rgn').value = JSON.stringify(cut_rect);
    }

    //스프라이트에리어 정보 업데이트
    function OnUpdateSheeter() {
        var element = document.getElementById('inp-center-pos');
        var rect = sheeter.getRect();

        var centerX = rect.sx - (App.editor_info.width/2);
        var centerY = rect.sy - (App.editor_info.height/2);

        element.value =
            '{"cx" :' + centerX + ',"cy":' + centerY + '}';

        //connsole.log(rect);
        //중심점 보정값 계산해서 반영하기
        var sheet = App.SpriteData.frames[current_frame_index].sheets[0];
        sheet.centerOffset.x =  centerX;
        sheet.centerOffset.y =  centerY;

//        $.each(App.SpriteData.frames[current_frame_index].sheets,function(index,sheet) {
//            sheet.centerOffset.x =  centerX;
//            sheet.centerOffset.y =  centerY;
//        });



    }


    /////////////////////
    //이밴트 핸들러

    cutter.OnDragMove = function() {

        OnUpdateCutter();

    };


    sheeter.OnDragMove = function() {

        //console.log('test');
        OnUpdateSheeter();


    };

    //이미지뷰 스크롤 처리
    $('#main_window').on('scroll',function(evt) {


        $('#kinetic_stage').css('top',  evt.currentTarget.scrollTop + 'px');
        $('#kinetic_stage').css('left',  evt.currentTarget.scrollLeft + 'px');

        scrollPos.y = evt.currentTarget.scrollTop;
        scrollPos.x = evt.currentTarget.scrollLeft;

        OnUpdateCutter();


    });
    ///////////////////////////////////////

    document.getElementById('btn-rgn-set').addEventListener('click',function(evt) {

        //{"sx":44,"sy":34,"width":100,"height":100}
        //console.log(document.getElementById('inp-cutter-rgn').value);

        var strValue = document.getElementById('inp-cutter-rgn').value;

        if(strValue == "") {

            alert('영역정보를 입력하세요.');

        }
        else {
            var data = JSON.parse(strValue);

            cutter.setRect(
                new gbox3d.core.Vect2d(data.sx - scrollPos.x,data.sy - scrollPos.y),
                new gbox3d.core.Vect2d(data.sx + data.width -scrollPos.x ,data.sy + data.height - scrollPos.y)
            );

        }
    });



    //텍스춰 로딩 관련
    document.getElementById('inp-select-files').addEventListener('change',function(evt) {

        var files = evt.target.files; // FileList object

        for (var i = 0, f; f = files[i]; i++) {

            //console.log(f);

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {

                return function(e) {

                    App.imgObj = new Image();

                    var imgObj = App.imgObj;
                    var view_element = document.querySelector('#img_view');

                    imgObj.onload = function() {

                        current_texture = imgObj;

                        while (view_element.firstChild) {
                            view_element.removeChild(view_element.firstChild);
                        }

                        var canvas = document.createElement('canvas');

                        canvas.width = imgObj.width;
                        canvas.height = imgObj.height;

                        var context = canvas.getContext('2d');

                        context.drawImage(imgObj,0,0);

                        view_element.appendChild(canvas);

                        $('#sprite_window .sheet').css('background-image','url('+ imgObj.src +')');

                    }
                    imgObj.src = e.target.result;
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    });

    $('#sprite_window').on('click',function(evt) {

        var cutter = App.editor.Cutter;
        var sheeter = App.editor.Sheeter;

        sheeter.hide();
        current_sheet_element = null;

        var sheet_nodes = $('#sheet-root .sheet');

        for(var i=0;i<sheet_nodes.length;i++) {

            var node =  $(sheet_nodes[i]);

            var area = new gbox3d.core.Box2d();//getCollisionArea(node);
            area.getCollisionArea(node);

            if(area.ptInBox(evt.offsetX,evt.offsetY)) {

                if(current_sheet_element != null) {
                    current_sheet_element.removeClass("editing");
                    current_sheet_element.addClass("edited");
                }

                current_sheet_element = node;
                current_sheet_element.removeClass("edited");
                current_sheet_element.addClass("editing");

                sheeter.show();
                sheeter.setPosition(area.topLeft.X,area.topLeft.Y);
                sheeter.setCurrentNode(node);

                var sheet = Node2Sheet(current_sheet_element);
                var scroll_pos = sheet.scrollpos;

                var mainwindow = document.getElementById('main_window');

                mainwindow.scrollTop =  -sheet.bp_y;
                App.editor.ScrollPos.y = mainwindow.scrollTop;

                mainwindow.scrollLeft = -sheet.bp_x;
                App.editor.ScrollPos.x = mainwindow.scrollLeft;

//                ($('#main_window')[0]).scrollTop =  scroll_pos.y;
//                ($('#main_window')[0]).scrollLeft = scroll_pos.x;

                var sx = -sheet.bp_x - App.editor.ScrollPos.x;
                var sy = -sheet.bp_y - App.editor.ScrollPos.y;


                cutter.setRect(
                    new gbox3d.core.Vect2d(sx,sy), //시작점
                    new gbox3d.core.Vect2d(sheet.width + sx ,sheet.height + sy) //끝점
                );

                //document.getElementById('inp-cutter-rgn').value = JSON.stringify(cutter.getRect(scrollPos));
                OnUpdateCutter();
                OnUpdateSheeter();

                break;
            }
        }

    });
    /////

    $('#btn-add-frame').on('click',function() {
        //addFrame();

        //첫번째 추가일 경우
        if(App.SpriteData.frames.length == 1 && App.SpriteData.frames[0].sheets.length == 0 )
        {
            //프레임추가없이 시트만 추가한다.
            addSheet();
            storeFrame(0,$('#sheet-root'));

        }
        else { //두번째 부터는...

            //프레임을 추가 시키고 시트를 넣는다.
            addFrame();
            addSheet();
        }

        //코루틴 (스프라이트 영역에 대한 업데이트를 해야하므로 한턴 쉬었다가 다음 턴에 처리하도록)
        requestAnimationFrame(function() {
            current_sheet_element = null;
            //sheeter.hide();
        });


    });
    ///////

    //현재 프레임 삭제
    $('#btn-del-frame').on('click',function() {



        if(App.SpriteData.frames.length > 1 ) {

            //$('#sheet-root').empty();

            App.SpriteData.frames.splice(current_frame_index,1);
            current_sheet_element = null;
            if(current_frame_index > App.SpriteData.frames.length-1 ) {
                current_frame_index = 0;
            }
            $('#sheet-root').empty();
            restoreFrame(current_frame_index,$('#sheet-root'));

            var slider =$('#slider-frame-select')[0];

            $('#slider-frame-select').attr("max",App.SpriteData.frames.length-1);
            $('#slider-frame-select').val(current_frame_index);
            //슬라이더 상태 갱신하기
            $('#slider-frame-select').trigger('change');
        }
        else {
            //그냥 내용만 지우기
            $('#sheet-root').empty();
            current_sheet_element = null;
            current_frame_index = 0;

            sheeter.hide();
            layer_editor.draw();

            console.log('cannot delete last frame!');
        }

    });
    ////////
    $('#btn-ins-frame').on('click',function() {

        storeFrame($('#slider-frame-select').val(),$('#sheet-root'));
        $('#sheet-root').empty();

        //새로운 빈프레임 추가
        App.SpriteData.frames.splice(current_frame_index, 0,{
            sheets : []
        });

        addSheet();
        //코루틴 (스프라이트 영역에 대한 업데이트를 해야하므로 한턴 쉬었다가 다음 턴에 처리하도록)
        requestAnimationFrame(function() {
            current_sheet_element = null;
            //sheeter.hide();
        });


        //current_sheet_element = null;
        $('#slider-frame-select').attr("max",App.SpriteData.frames.length-1);

    });
    ///////

    ////중심점 재조정
    document.getElementById('btn-set-center-pos').addEventListener('click',function() {

        var centerpos = document.getElementById('inp-center-pos').value;

        centerpos = JSON.parse(centerpos);

        App.editor.Sheeter.setPosition(
            App.editor.SpriteEditStage.getWidth()/2 + centerpos.cx,
            App.editor.SpriteEditStage.getHeight()/2 + centerpos.cy);

    });


    //프레임이 바뀌면...
    $('#slider-frame-select').on('change',function(evt) {

        //시터 숨기기
        sheeter.hide();
        layer_editor.draw();

        storeFrame(current_frame_index,$('#sheet-root'));
        $('#sheet-root').empty();

        var sheet = App.SpriteData.frames[current_frame_index].sheets[0];
        sheet.centerOffset.x =  sheet.x - (App.editor_info.width/2);
        sheet.centerOffset.y =  sheet.y - (App.editor_info.height/2);

        //console.log(App.SpriteData.frames[current_frame_index].sheets[0]);
//        //중심점 보정값 계산
//        $.each(App.SpriteData.frames[current_frame_index].sheets,function(index,sheet) {
//            sheet.centerOffset.x =  sheet.x - (App.editor_info.width/2);
//            sheet.centerOffset.y =  sheet.y - (App.editor_info.height/2);
//        });

        //새로운 프레임인덱스로 갱신
        current_frame_index = $(this).val();
        current_sheet_element = null;

        restoreFrame(current_frame_index,$('#sheet-root'));

        $('#control-sprite-frame .frameindex').text(current_frame_index);
    });


    //데이터 후처리 작업(중심점 값 보정하기 등등 )
    function UpdateSpriteDatas() {
        $.each(App.SpriteData.frames,function(index,frame) {
            $.each(frame.sheets,function(index,sheet) {
                //중심점 보정값 계산
                console.log(sheet.centerOffset.x);
                sheet.centerOffset.x =  sheet.x - (App.editor_info.width/2);
                sheet.centerOffset.y =  sheet.y - (App.editor_info.height/2);

            });
        });

    }

    ///////
    $('#control-file .btn-export').on('click',function() {

        var filename = $('#control-file .inp-filename').val();

        storeFrame(current_frame_index,$('#sheet-root'));
        UpdateSpriteDatas();

        console.log(JSON.stringify(App.SpriteData));
        $('#control-file .textarea-export').val(JSON.stringify(App.SpriteData));

    });

    ///////
    document.querySelector('#control-file .btn-save').addEventListener('click',function() {

        App.SpriteData =  JSON.parse( $('#control-file .textarea-export').val() );

        var blob = new Blob([JSON.stringify(App.SpriteData)], {type: "text/json;charset=utf-8"});

        if(App.SpriteData.name == "") {
            saveAs(blob, "foxtool.json");
        }
        else {
            saveAs(blob, App.SpriteData.name +".json");
        }
    });


    //////////
    document.querySelector('#control-file .btn-import').addEventListener('click',function() {

        var result = document.querySelector('#control-file .textarea-export').value;

        var data = JSON.parse(result);

        //console.log(data);

        App.SpriteData = data;

        //새로운 프레임인덱스로 갱신
        current_frame_index = 0;
        current_sheet_element = null;

        $('#slider-frame-select').attr("max",App.SpriteData.frames.length-1);
        $('#slider-frame-select').val(current_frame_index);
        $('#control-sprite-frame .frameindex').text(current_frame_index);

        var prevw_range = {
            start : 0,
            end : App.SpriteData.frames.length-1
        }

        $('#inp-preview-range').val( JSON.stringify(prevw_range));


        $('#sheet-root').empty();
        restoreFrame(current_frame_index,$('#sheet-root'));


    });

    //////////
    document.querySelector('#control-file .inp-load-files').addEventListener('change',function(evt) {

        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) {

            //console.log(f);

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {

                return function(e) {

                    var result = e.target.result;
                    document.querySelector('#control-file .textarea-export').value = result;

                };

            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f,'utf-8');
        }


    });

    //////////프리펩 컨트롤 관련/////
    ///////

    function selectPrefeb(select_value) {
        //var select_value = this.value;
        var prefeb = App.editor.prefeb[select_value];

        //console.log(App.editor.prefeb[select_value]);

        //스크롤 포지션으로 이동
        var mainwindow = document.getElementById('main_window');

        mainwindow.scrollTop =  prefeb.sy;
        App.editor.ScrollPos.y = mainwindow.scrollTop;

        mainwindow.scrollLeft = prefeb.sx;
        App.editor.ScrollPos.x = mainwindow.scrollLeft;

        App.editor.Cutter.setRect(
            new gbox3d.core.Vect2d(prefeb.sx-App.editor.ScrollPos.x,prefeb.sy-App.editor.ScrollPos.y),
            new gbox3d.core.Vect2d(prefeb.sx+prefeb.width - App.editor.ScrollPos.x,prefeb.sy+prefeb.height - App.editor.ScrollPos.y)
        );

        OnUpdateCutter();

    }

    document.querySelector('#control-prefeb-list .inp-load-files').addEventListener('change',function(evt) {

        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) {

            //console.log(f);

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {

                return function(e) {

                    var selObj = document.querySelector('#control-prefeb-list .sel-prefeb');
                    var result = JSON.parse(e.target.result);

                    App.editor.prefeb = result;
                    selObj.innerHTML = '';

                    for(var i=0;i<result.length;i++) {

                        var opt_el = document.createElement('option');
                        opt_el.value = i;
                        opt_el.innerText = JSON.stringify(result[i]);

                        selObj.appendChild(opt_el);
                    }

                    selObj.value = 0;
                    selectPrefeb(0);
                };

            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f,'utf-8');
        }

    });

    document.querySelector('#control-prefeb-list .sel-prefeb').addEventListener('change',function(evt) {

        selectPrefeb(this.value);

    });
    //일괄적용 버튼
    document.querySelector('#control-prefeb-list .btn_batch').addEventListener('click',function() {

        App.SpriteData.frames.length = 0;


        for(var i=0;i < App.editor.prefeb.length;i++) {

            var prefeb = App.editor.prefeb[i];

            //console.log(prefeb);

            //새로운 빈프레임 추가
            App.SpriteData.frames.push({
                sheets : [{
                    x:App.editor_info.width/2 - prefeb.width/2,
                    y:App.editor_info.height/2 - prefeb.height/2,
                    width:prefeb.width,
                    height:prefeb.height,
                    centerOffset: {
                        x: -prefeb.width/2 ,
                        y: -prefeb.height/2
                    },
                    bp_x : -prefeb.sx,
                    bp_y : -prefeb.sy

                }],
                delay : 100
            });

        }



        current_sheet_element = null;
        current_frame_index = App.SpriteData.frames.length-1;

        $('#slider-frame-select').attr("max",current_frame_index);
        $('#slider-frame-select').val(current_frame_index);
        $('#control-sprite-frame .frameindex').text(current_frame_index);

        restoreFrame(current_frame_index,$('#sheet-root'));

    });

    //방향키로 한도트씩 움직이기
    document.body.addEventListener('keydown',function(event) {

        //console.log(event);

        //쉬프트 키가 눌러 졌을 때만 움직인다.
        if(event.shiftKey) {
            var pos = App.editor.Sheeter.getPosition();

            if(current_sheet_element != null) {
                switch (event.keyCode) {
                    case 37:
                        App.editor.Sheeter.setPosition(
                            pos.X - 1,pos.Y);
                        break;
                    case 38:
                        App.editor.Sheeter.setPosition(
                            pos.X,pos.Y-1);
                        break;
                    case 39:
                        App.editor.Sheeter.setPosition(
                            pos.X + 1,pos.Y);
                        break;
                    case 40:
                        App.editor.Sheeter.setPosition(
                            pos.X,pos.Y+1);
                        break;
                }
                OnUpdateSheeter();
            }
        }


    });

    //레이어 기능
    document.getElementById('check-overlay').addEventListener('change',function(event) {

        console.log(event.target.checked);

        if(event.target.checked) {
            App.editor.Overlay_sheet.style.visibility = 'visible';
        }
        else {
            App.editor.Overlay_sheet.style.visibility = 'hidden';
        }

    });


    ///////////////////////////////////////////////
    //스프라이트 프리뷰 만들기
    (function() {

        var sprite_preview_element = document.getElementById('window-sprite-preview');
        //console.log( sprite_preview_element.style.width.slice(0,-2) );
        //console.log( sprite_preview_element.style.height.slice(0,-2) );

        var window_size ={ //클리핑 범위 지정
            width : parseInt(sprite_preview_element.style.width.slice(0,-2)) ,
            height: parseInt(sprite_preview_element.style.height.slice(0,-2))
        };

        App.SpritePreView = {};
        App.SpritePreView.Smgr = new Pig2d.SceneManager({
            container : sprite_preview_element,
            window_size : window_size,
            bkg_color : 'black'
        });

        //console.log(App.SpritePreView.Smgr.getRootNode().get('model').get('element'));
        //App.SpritePreView.Smgr.getRootNode().get('model').get('element').style.backgroundColor = '#000000';

        document.querySelector('#btn-preview-play').addEventListener('click',function(evt) {

            if(this.innerText != 'stop') {
                this.innerText = 'stop';

                sprite_preview_element.style.visibility = 'visible';

                if(App.SpriteData.frames.length > 0 ) {

                    App.SpritePreView.Smgr.get('rootNode').removeChildAll();

                    //범위 설정
                    var ani_setup = JSON.parse(document.getElementById('inp-preview-range').value);

                    var node = Pig2d.util.createSprite({
                        texture: App.imgObj,
                        animation : App.SpriteData,
                        startFrame: ani_setup.start,
                        endFrame: ani_setup.end
                    });

                    node.get('model').setPosition(
                        window_size.width/2,
                        window_size.height/2
                    );

                    App.SpritePreView.Smgr.add(node);

                }
            }
            else {
                this.innerText = 'play';
                sprite_preview_element.style.visibility = 'hidden';

            }




        });

    })();
    /////////////////////////////////////////////////



    ////////////////
    //애니메이션 루프
    var mytimer = new gbox3d.core.Timer();
    requestAnimationFrame(
        function loop() {

            var deltaTime = mytimer.getDeltaTime();

            //스프라이트편집 객체 업데이트
            if(current_sheet_element != null) {

                (function (sheetObj) {

                    var sheet = sheetObj
                    var cut_rect = cutter.getRect(scrollPos);

                    //커터 영역 클리핑 처리
                    if(cut_rect.sx < 0) {

                        cut_rect.sx = 0;
                        cut_rect.width += cut_rect.sx;

                    }
                    if(cut_rect.sy < 0) {
                        cut_rect.sy = 0;
                        cut_rect.width += cut_rect.sy;
                    }

                    if(current_texture.width < cut_rect.sx + cut_rect.width) {
                        cut_rect.width -= (cut_rect.sx + cut_rect.width - current_texture.width);
                    }
                    if(current_texture.height < cut_rect.sy + cut_rect.height) {
                        cut_rect.height -= (cut_rect.sy + cut_rect.height - current_texture.height);
                    }

                    var sheeter = App.editor.Sheeter;

                    //쉬트 정보 재설정
                    $(sheet).data('scrollpos',{x:scrollPos.x,y:scrollPos.y});
                    $(sheet).css('width',cut_rect.width+'px');
                    $(sheet).css('height',cut_rect.height+'px');

                    $(sheet).css('background-position',
                        '-' + cut_rect.sx + 'px -' + cut_rect.sy + 'px' );

                    sheeter.setRect({
                        start : new gbox3d.core.Vect2d(0,0),
                        end : new gbox3d.core.Vect2d(cut_rect.width,cut_rect.height)
                    });

                    //위치 갱신해주기
                    sheeter.setCurrentNode(sheet);



                    //$('#text_rgn').text(JSON.stringify(cutter.getRect(scrollPos)));

                } )(current_sheet_element);

                App.editor.camObj.active = false; //카메라 이동 금지

            }
            else {

                App.editor.camObj.active = true; //카메라 이동가능
            }

            stage_editor.draw();
            stage.draw();

            //프리뷰 씬메니져
            var Smgr = App.SpritePreView.Smgr;
            if(Smgr != null) {

                //트래버스 함수를 이용 해서
                //Smgr.updateAll(deltaTime); 과 똑같은 기능을 수행함

                Smgr.get('rootNode').traverse(function() {

                    this.get('model').updateCSS(deltaTime);


                },{
                    deltaTime: deltaTime
                });
            }
            requestAnimationFrame(loop);
        }
    );

})();