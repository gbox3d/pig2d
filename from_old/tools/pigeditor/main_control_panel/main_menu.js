/**
 * Created by gbox3d on 2013. 11. 25..
 */



//스크립트 실행하기
document.querySelector('#main-control-panel .main-menu .btn-run-cmd').addEventListener('click',function() {

    var cmd = document.querySelector('#main-control-panel .main-menu .cmd').value;

    window.eval(cmd);
});


//어셋파일 수동으로 로드하기
document.querySelector('#main-control-panel .main-menu .load-asset').addEventListener('change',function(evt) {



    var file = evt.target.files[0];

    var reader = new FileReader();
    reader.onload = function(theFile) {

        Pig2d.system.InitAssetSystem({
            data : JSON.parse(theFile.target.result),
            OnLoadProgress : OnLoadProgress,
            OnLoadComplete : function(evt) {
                theApp.asset_data = evt;
                theApp.reset_prefeb();
            }
        });
    }
    reader.readAsText(file,'utf-8');
    this.value = '';
});

//씬 저장하기
document.querySelector('#main-control-panel .main-menu .btn-save').addEventListener('click',function() {

    var result = theApp.Smgr.serialize(theApp.CameraNode);

    console.log(result);

    /*
    var blob = new Blob([JSON.stringify(result)], {type: "text/json;charset=utf-8"});
    saeAs(blob, "pigeditor.json");
    */

    theApp.fileDlgObj.Open(
        {
            currentPath : '/engine/pig2d/res/pangpangfarm/',
            selectCallBack : function(e) {

                console.log(e);


                var param = {
                    password : '1234',
                    file : e.select_file,
                    path : e.path,
                    data : JSON.stringify(result)
                }

                $.ajax({
                    url:  theApp.webDosUrl + '/save',
                    type: 'POST',
                    processData: false,
                    data: JSON.stringify(param),
                    success: function(data, textStatus, jqXHR) {
                        console.log('success receive  data');
                        console.log( data );

                        //catalogFileList(theApp.currentPath);

                    },
                    complete: function(jqXHR, textStatus) {
                        console.log('complete');

                    },
                    error: function(qXHR, textStatus, errorThrown) {
                        console.log('error');
                    }
                });

            }

        }
    )

});



///////씬로드 하기
//document.querySelector('#main-control-panel .main-menu .btn-load input').addEventListener('change',function(evt) {
document.querySelector('#main-control-panel .main-menu .btn-load').addEventListener('click',function(evt) {

    theApp.fileDlgObj.Open(
        {
            currentPath : '/engine/pig2d/res/pangpangfarm/',
            selectCallBack : function(e) {

                var param = {
                    password : '1234',
                    file : e.select_file,
                    path : e.path
                }

                $.ajax({
                    url:  theApp.webDosUrl + '/load',
                    type: 'POST',
                    processData: false,
                    data: JSON.stringify(param),
                    success: (function(data, textStatus, jqXHR) {
                        console.log('success receive  data');
                        //console.log( data );

                        var dataObj = JSON.parse(data);

                        if(dataObj.result == 'loadOk')
                        {
                            //console.log(dataObj.data);


                            var data =  JSON.parse(dataObj.data);

                            console.log(data);

                            //씬그라프 클리어
                            //theApp.CameraNode.removeChildAll();
                            var parent_node = theApp.CurrentNode || theApp.CameraNode;

                            //씬그라프 만들기
                            var new_node = theApp.Smgr.deserialize({
                                parent: parent_node,
                                //root_name : 'camera_node',
                                data : data, //첫노드는 카메라 노드 이므로 다음 자식노드부터 읽어 들이도록한다.
                                asset_data : theApp.asset_data
                            });

                            //오브잭트 리스트 클리어
                            var obj_list_element = document.querySelector('#main-control-panel .object-list ul');

                            while (obj_list_element.firstChild) {
                                obj_list_element.removeChild(obj_list_element.firstChild);
                            }

                            //편집용 이벤트 핸들러 셋업해주기
                            theApp.CameraNode.traverse(function() {

                                var node = this;
                                //편집 가능 객체 등록
                                if(this.type == 'sprite_dummy' ||
                                    this.type == 'dummy' ||
                                    this.type == 'html' ||
                                    this.type == 'custom_html') {


                                    if(this.type == 'sprite_dummy')
                                    {
                                        //툴에서 해당 노드를 쉽게 찾을수 있도록
                                        node.node_sprite.get('model').get('sheet').target_node = node;
                                    }

                                    theApp.toolSetup(node);

                                }

                            });

                            console.log('load ok..');


                            //theApp.UIElement.inpFileName.value = this.file_info.name;
                            //theApp.UIElement.inpFileContent.value = dataObj.data;
                        }

                    }).bind(this),
                    complete: function(jqXHR, textStatus) {
                        console.log('complete');

                    },
                    error: function(qXHR, textStatus, errorThrown) {
                        console.log('error');
                    }
                });//ajax end

            }
        }
    );




    /*
    var file = evt.target.files[0];

    var reader = new FileReader();
    reader.onload = function(theFile) {

        //console.log(theFile);

        var data =  JSON.parse(theFile.target.result);

        //씬그라프 클리어
        //theApp.CameraNode.removeChildAll();
        var parent_node = theApp.CurrentNode || theApp.CameraNode;

        //씬그라프 만들기
        var new_node = theApp.Smgr.deserialize({
            parent: parent_node,
            //root_name : 'camera_node',
            data : data, //첫노드는 카메라 노드 이므로 다음 자식노드부터 읽어 들이도록한다.
            asset_data : theApp.asset_data
        });

        //오브잭트 리스트 클리어
        var obj_list_element = document.querySelector('#main-control-panel .object-list ul');

        while (obj_list_element.firstChild) {
            obj_list_element.removeChild(obj_list_element.firstChild);
        }

        //편집용 이벤트 핸들러 셋업해주기
        theApp.CameraNode.traverse(function() {

            var node = this;
            //편집 가능 객체 등록
            if(this.type == 'sprite_dummy' ||
                this.type == 'dummy' ||
                this.type == 'html' ||
                this.type == 'custom_html') {


                if(this.type == 'sprite_dummy')
                {
                    //툴에서 해당 노드를 쉽게 찾을수 있도록
                    node.node_sprite.get('model').get('sheet').target_node = node;
                }

                theApp.toolSetup(node);

            }

        });

        console.log('load ok..');

    }

    //읽기 시작..
    reader.readAsText(file,'utf-8');

    this.value = ''; //같은 파일 다시 선택해도 되도록...
    */


});

//로드 메뉴를 클릭 했을때 처리 해주기
document.querySelector('#main-control-panel .main-menu .btn-load').addEventListener('click',function() {

    $('#main-control-panel .main-menu .btn-load input').trigger('click');


});

//커멘드 버튼 스크립트 실행하기
$('#main-control-panel .cmd-group').on('click',function(evt) {

    //console.log(evt.target.classList.contains('btn-run'));

    var target_node = evt.target;

    if(target_node.classList.contains('btn-run') == true) {

        console.log(target_node.parentNode.querySelector('input').value);

        window.eval(target_node.parentNode.querySelector('input').value);


    }

    //console.log($(evt.target).parent().find('input').val());
    //window.eval($(evt.target).parent().find('input').val());

});