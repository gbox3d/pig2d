/**
 * Created by gbox3d on 2013. 11. 22..
 */

///////////////////////////////////

theApp.reset_prefeb = function() {
    var obj_array = [];

    for(var key in theApp.asset_data.objects ) {

        var obj = {};

        obj.name = key;
        obj.data = {};
        obj.data.texture =  theApp.asset_data.resData.textures[theApp.asset_data.img_files[theApp.asset_data.objects[key].texture]];
        obj.data.animation =  theApp.asset_data.resData.animations[theApp.asset_data.animation_files[theApp.asset_data.objects[key].animation]];

        obj_array.push(obj);

    }


    var prefeb_list = document.querySelector('#main-control-panel .prefeb-list');

    prefeb_list.querySelector('ul').innerHTML = '';

    //프리펩리스트 세팅
    d3.select('#main-control-panel .prefeb-list ul')
        .selectAll('li')
        .data(obj_array)
        .enter()
        .append('li')
        .text(function(d) {

            return d.name;

        })
        .on('click',function(d) {

            console.log(d);

            theApp.current_select_prefeb = d;
            prefeb_list.querySelector('.select').innerText = d.name;
        });

}

///////////////////////////////
function OnLoadComplete(evt) {

    var em_prefeb_list = document.querySelector('#main-control-panel .prefeb-list');


    theApp.asset_data = evt;
    theApp.reset_prefeb();


    console.log(theApp.PluginFilePath);

    //메인 메뉴 플러그인 로딩
    theApp.LoadCmdMenuPlugin({
        url : theApp.PluginFilePath
    });

    //오브잭트 리스트 뷰 갱신
    theApp.refreshObjectListView();


}

function OnLoadProgress(evt) {
    //console.log(evt);
}


//파일 다이얼로그 초기화
theApp.fileDlgObj = new theApp.fileDlg({
    container : '#file-dialogue'
});

console.log(theApp.AssetFilePath);

//디폴트 어셋파일
Pig2d.system.InitAssetSystem({
    filename: theApp.AssetFilePath,
    OnLoadProgress : OnLoadProgress,
    OnLoadComplete : OnLoadComplete
});




var framerate_info_element = document.getElementById('text-framerate-info');

//게임루프시작
Pig2d.system.startGameLoop({

    framerate_info_element : framerate_info_element,
    gameLoopCallBack : function(deltaTime) {

        //씬메니져 업데이트
        //여기서 모든 노드들의 최신상태가 화면에 반영이 된다.
        theApp.Smgr.updateAll(deltaTime);

    },
    loopCount_limit : 30
});
