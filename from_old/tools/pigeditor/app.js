/**
 * Created by gbox3d on 2013. 11. 22..
 */

var theApp = {
    AssetFilePath : "../../res/pangpangfarm/asset_index.json",
    PluginFilePath : "./ui/ui_tools.json",
    webDosUrl : 'http://localhost:12800'
};

(function() {

    theApp.editor_info = {
        width : 512,
        height : 512

    }

    //씬관리자 만들기
    theApp.Smgr = new Pig2d.SceneManager({
        container :  document.querySelector('#main-window'),
        window_size : { //클리핑 범위 지정
            width : theApp.editor_info.width,
            height: theApp.editor_info.height
        }
    });


    //카메라 노드 만들기
    var camera_node = Pig2d.util.createDummy();
    camera_node.get('model').setPosition(theApp.editor_info.width/2,theApp.editor_info.height/2);
    camera_node.set('name','camera_node');
    camera_node.type = 'camera';
    camera_node.get('model').get('element').classList.add('camera');
    theApp.Smgr.add(camera_node);
    theApp.CameraNode = camera_node;


    //유아이 앨리먼트 만들기
    theApp.UIelements = {
        EditorWindow : document.querySelector('#main-window'),
        AssetListView : document.querySelector('#main-control-panel .prefeb-list'),
        ObjectInfoView : document.querySelector('#main-control-panel .object-info'),
        ObjectListView : document.querySelector('#main-control-panel .object-list'),
        fileSelectDialogue : document.querySelector('#file-dialogue')
    }; //유아이 앨리먼트 모음

    theApp.selection_element = document.getElementById('selection_hud');

////////////////////////////
    //툴이밴트 관련 처리
    theApp.tool_event = {
        OnChangeNodeSelect : function(evt) {
            theApp.updateCurrentNode(evt.node);
        },
        OnDragNode : function(evt) {
            updateNodeInfo(evt.node);
        }
    }
//////////////////////

    theApp.updateCurrentNode = function(node) {

        this.CurrentNode = node;


        switch(node.type) {
            case 'dummy':
            case 'custom_html':
            case 'html':
                theApp.selection_element.style.visibility = 'visible';

                theApp.selection_element.style.width = '100px';
                theApp.selection_element.style.height = '100px';

                theApp.selection_element.style.webkitTransform = 'translate(-50px,-50px)';
                break;
            case 'sprite_dummy':

                theApp.selection_element.style.visibility = 'visible';

                var sheet = theApp.CurrentNode.node_sprite.get('model').get('sheet');
                if(sheet) {
                    theApp.selection_element.style.width = sheet.width+'px';
                    theApp.selection_element.style.height = sheet.height+'px';

                    theApp.selection_element.style.webkitTransform = 'translate(-' + sheet.width/2 +'px,-' + sheet.height/2  + 'px)';

                }
                else {
                    theApp.selection_element.style.width = '100px';
                    theApp.selection_element.style.height = '100px';

                    theApp.selection_element.style.webkitTransform = 'translate(-50px,-50px)';
                }
                break;
        }

        // Drager 를 위해서 연결된 노드 지정
        theApp.selection_element.target_node = theApp.CurrentNode;

        theApp.CurrentNode.get('model').get('element').appendChild(theApp.selection_element);
        updateNodeInfo(theApp.CurrentNode);
    }

    //오브잭트 뷰 리프레쉬
    theApp.refreshObjectListView = function() {

        //오브잭트 리스트 클리어
        var obj_list_element = theApp.UIelements.ObjectListView.querySelector('ul');

        while (obj_list_element.firstChild) {
            var child = obj_list_element.firstChild;

            //var old_element = child;
            //var new_element = old_element.cloneNode(true);
            //old_element.parentNode.replaceChild(new_element, old_element);

            obj_list_element.removeChild(child); //이밴트들도 모두 날라감
        }

        var prev_liElement;

        //편집용 이벤트 핸들러 셋업해주기
        theApp.CameraNode.traverse(function() {

            var node = this;

            var node_type = node.type;

            if(node_type == undefined) {
                node_type = node.get('type');
            }

            //편집 가능 객체 등록
            if(node_type == 'sprite_dummy' ||
                node_type == 'dummy' ||
                node_type == 'html' ||
                node_type == 'custom_html' ||
                node_type == 'camera'
                ) {

                var li_element = document.createElement('div');

                var li_root_element =  document.createElement('li');

                li_root_element.appendChild(li_element);

                //드래그인 드롭관련 처리
                li_element.setAttribute('draggable',true);
                li_element.addEventListener('dragstart',function(evt) {

                    evt.dataTransfer.setData("cid",node.cid);

                });

                li_element.addEventListener('drop',function(evt) {

                    evt.preventDefault();

                    var child =  theApp.Smgr.getRootNode().findByID(evt.dataTransfer.getData("cid"));
                    var parent = theApp.Smgr.getRootNode().findByID(evt.target.getAttribute("cid"));

                    //console.log(evt.target.getAttribute("cid"));
                    //console.log( 'child id : ' + child_id);

                    theApp.makeHierarchy({
                        parent:parent,
                        child:child
                    })

                    theApp.refreshObjectListView();

                });

                li_element.addEventListener('dragover',function(evt) {

                    evt.preventDefault();

                });
                /////////////////


                var name = node.get('name');
                if(name == undefined) {
                    name = '';
                }

                li_element.innerText = node.cid + '(' + name + ')';
                li_element.setAttribute('cid',node.cid);

                var item_width = (li_element.innerText.length) * 10;

                li_element.style.width = item_width + 'px';

                var ul_element = document.createElement('ul');
                li_root_element.appendChild(ul_element);

                //리스트아이템 클릭 이밴트 처리
                li_element.addEventListener('click',function(evt) {

                    console.log(this);

                    theApp.updateCurrentNode(node);

                    //이전에 선택한것은 원래 대로
                    if(prev_liElement) {

                        prev_liElement.style.backgroundColor = '';

                    }

                    this.style.backgroundColor = 'red';
                    prev_liElement = this;

                    //이밴트 전달 금지
                    evt.cancelBubble = true;
                    evt.stopPropagation();
                });

                node.set('listElement',ul_element);

                if(node.get('parent')) {
                    if(node.get('parent').get('listElement')) {

                        //console.log(node.get('parent').get('listElement'));
                        node.get('parent').get('listElement').appendChild(li_root_element);
                        //obj_list_element.appendChild(li_element);

                    }
                    else {
                        obj_list_element.appendChild(li_root_element);
                    }
                }
                else {
                    obj_list_element.appendChild(li_root_element);
                }
            }


        });
    }

    theApp.toolSetup = function(node) {

        node.Dragger = new Pig2d.util.controller.Drager({
            listener_element: document.querySelector('#main-window'),
            node : node,
            camera : theApp.CameraNode,
            OnDragStart : function(evt) {
                theApp.tool_event.OnChangeNodeSelect(evt);
            },
            OnDragMove : function(evt) {
                theApp.tool_event.OnDragNode(evt);
            }
        });

        this.updateCurrentNode(node);

        theApp.refreshObjectListView();

        /*
        var name = node.get('name');
        if(name == undefined) {
            name = '';
        }

        //리스트에 추가 시키기
        var obj_list_element = document.querySelector('#main-control-panel .object-list ul');

        var li_element = document.createElement('li');


        li_element.innerText = node.cid + '(' + name + ')';
        li_element.setAttribute('cid',node.cid);

        //리스트아이템 클릭 이밴트 처리
        li_element.addEventListener('click',function(evt) {

            theApp.updateCurrentNode(node);

        });

        obj_list_element.appendChild(li_element);
        */

    }


    theApp.makeHierarchy = function(param) {

        var parent_node = param.parent;
        var child_node = param.child;

        if(parent_node && child_node ) {

            if(parent_node !=  child_node) {
                child_node.setParent(parent_node);
                parent_node.update(true,0);
            }
            else {
                alert('같은 노드로는 붙일수 없습니다.');
            }
        }
        else {
            alert('잘못된 대상입니다.');

        }

    }

    theApp.addDummyNode = function(param) {

        param = param || {};

        var parent = param.parent || camera_node;

        var node = Pig2d.util.createDummy();
        if(param.name) {
            node.set('name',param.name);
        }
        node.type = 'dummy';
        parent.add(node);

        node.get('model').setPosition(
            param.x,
            param.y);

        this.toolSetup(node);

    }

    theApp.addCustomHtmlNode = function(param) {

        param = param || {};

        var parent = param.parent || camera_node;
        var x = param.x || 0;
        var y = param.y || 0;

        var node = Pig2d.util.createDummy();
        if(param.name) {
            node.set('name',param.name);
        }
        node.type = 'custom_html';
        node.get('model').setPosition(
            x,
            y);
        parent.add(node);

        var node_html = Pig2d.util.createDummy();

        node.add(node_html);
        node.node_html = node_html;
        node.html = node_html.get('model').get('element').innerHTML = param.html;

        this.toolSetup(node);
    };

    theApp.addHtmlNode = function(param) {

        param = param || {};

        var parent = param.parent || camera_node;
        var x = param.x || 0;
        var y = param.y || 0;

        var node = Pig2d.util.createDummy();
        if(param.name) {
            node.set('name',param.name);
        }

        node.type = 'html';

        node.get('model').setPosition(
            x,
            y);

        var innerElement = document.createElement('div');
        innerElement.classList.add('pig2d-inner-html');

        node.get('model').get('element').style.width = '64px';
        node.get('model').get('element').style.height = '64px';
        node.get('model').get('element').style.backgroundColor = 'gray';
        node.get('model').get('element').style.opacity = '0.5';

        node.get('model').get('element').appendChild(innerElement);

        parent.add(node);

        this.toolSetup(node);
    };

    theApp.addSpriteNode = function(param) {

        var x = param.x || 0;
        var y = param.y || 0;
        var prefeb_name = param.prefeb_name;
        //var parent = param.parent || this.Smgr.getRootNode();

        return this.addSprite({
            x : x,
            y : y,
            prefeb : {
                name : prefeb_name,
                data : {
                    texture : theApp.asset_data.resData.textures[theApp.asset_data.img_files[theApp.asset_data.objects[prefeb_name].texture]],
                    animation :  theApp.asset_data.resData.animations[theApp.asset_data.animation_files[theApp.asset_data.objects[prefeb_name].animation]]
                }
            },
            parent : param.parent

        });


    }

    theApp.addSprite = function(param) {

        /*

         내부적인 종속 관계

         node -> node_control-> node_sprite

         node 는 실제 연결된 객체의 위치,회전,크기 변환시에 사용한다.

         node_control 에는 css 애니메이션 효과를 붙인다.

         node_sprite 에는 좌우 반전 또는 프레임애니메이션 효과를 제어 할때 사용한다.

         */

        var parent = param.parent || this.CameraNode;
        var prefeb = param.prefeb || this.current_select_prefeb;

        if(!prefeb) {
            alert('오브잭트 프리펩을 먼저 선택해주세요')
            return null;
        }

        var node = Pig2d.util.createDummy();
        node.type = 'sprite_dummy';
        if(param.name) {
            node.set('name',param.name);
        }
        //초기위치를 카메라 스케일에 맞추어 보정해준다.
        var cam_scale = this.CameraNode.get('model').getScale();

        node.get('model').setPosition(
            param.x * (1.0 / cam_scale.X) ,
            param.y * (1.0 / cam_scale.Y) );
        parent.add(node);

        //css 이펙트를 적용 시키기위한 더미 노드 ,
        var node_control = Pig2d.util.createDummy();
        node_control.type = 'control_dummy';

        //루트 노드에 추가 시키기
        node.add(node_control);
        node.node_control = node_control; //쉽게 찾을수 있도록 참조값 만들기

        if(prefeb.data.animation) {
            //스프라이트 노드 (반전,애니메이션 기능을 수행한다)
            var node_sprite = Pig2d.util.createSprite(
                prefeb.data
            );
            node_sprite.type = 'sprite';
            node_sprite.prefeb = prefeb;

            //인자들은 기본값은으로 세팅
            node_sprite.get('model').setupAnimation({
                isAnimationLoop: false,
                AnimationStatus : 'stop'

            });
            node_control.add(node_sprite);

            node.node_sprite = node_sprite; //쉽게 찾을수 있도록 참조값 만들기

            //툴에서 해당 노드의 캔버스 앨리먼트 클릭시 노드를 쉽게 찾을수 있도록 참조값 만들어준다.
            node_sprite.get('model').get('sheet').target_node = node;


        }
        else {
            var node_sprite = Pig2d.util.createSlicedImage({
                imgObj: prefeb.data.texture
            });

            node_sprite.type = 'image';
            node_sprite.prefeb = prefeb;

            node_control.add(node_sprite);

            node.node_sprite = node_sprite; //쉽게 찾을수 있도록 참조값 만들기

        }






        this.toolSetup(node);

        return node;
    }

    theApp.CloneNode = function(param) {

        var clone = param.node.clone({
            extendCallBack : function(evt) {
                evt.clone.type = evt.original.type;
            }
        });

        //clone.type = param.node.type;

        //불필요한 편집 객체 제거
        var temp_hud = clone.get('model').get('element').querySelector('#selection_hud');
        if(temp_hud) {
            clone.get('model').get('element').removeChild(temp_hud);
        }

        console.log(clone);


        if(param.parent) {
            param.parent.add(clone);
        }
        else {
            param.node.get('parent').add(clone);

        }

        this.toolSetup(clone);

    }



    function drawGridSprite(size,grid_color) {

        var svg = d3.select('#main-window .grid-sprite');

        var grid_svg = d3.select('#main-window .grid-sprite .detail');
        grid_svg.select('.grid-root').remove();

        var g = grid_svg.append('g')
            .attr('class','grid-root');

        var width = this.editor_info.width;
        var height = this.editor_info.height;

        svg.style('width',width)
            .style('height',height)
            .style('-webkit-transform','translate('+ ((-width/2) )  +'px,'+ (-height/2  ) +'px)');

        for(var i=0; i < (width/size) ; i++)
        {
            g.append('line')
                .attr('x1',size*i)
                .attr('x2',size*i)
                .attr('y1',0)
                .attr('y2',height)
                .style('stroke',grid_color);
        }

        for(var i=0; i < (height/size) ; i++) {
            g.append('line')
                .attr('x1',0)
                .attr('x2',width)
                .attr('y1',size*i)
                .attr('y2',size*i)
                .style('stroke',grid_color);

        }

        //축 그리기
        var g_axies = d3.select('#main-window .grid-sprite .axies');

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

        //카메라 노드 밑으로 붙이기
        this.CameraNode.get('model').get('element').appendChild(document.querySelector('#main-window .grid-sprite'));


    }

    drawGridSprite.bind(theApp)(64,'#00ff00');


    //메뉴 플러그인 로딩
    theApp.LoadCmdMenuPlugin = function(option) {

        var cmd_group = document.querySelector('#main-control-panel .cmd-group');

        if(!option) {

            option = {
                url : "main_menu.json"
            };

        }

        //todo
        //자식 노드 노드 지우기


        $.ajax({
            type : "GET",
            url : option.url,
            dataType : "json",
            success : function(data,status,xhr) {

                //console.log(data);

                for(var key in data) {

                    console.log(key);

                    var btn = document.createElement('button');
                    btn.innerText = key;
                    btn.classList.add('btn-run');

                    var input = document.createElement('input');
                    input.value = data[key];

                    var root = document.createElement('div');

                    root.appendChild(input);
                    root.appendChild(btn);

                    cmd_group.appendChild(root);

                }

//                ProcessAsset(data);

            },
            error : function(evt,status,xhr) {

                console.log(status);

            }
        });

    }




})();

