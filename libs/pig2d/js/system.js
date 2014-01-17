/**
 * Created by gbox3d on 2013. 11. 16..
 */

Pig2d.system = {

    currentFPS : 0,
    startGameLoop : function(param) {
        ////////////////////////////////
        //타이머 설정 및 퍼포먼트 테스트용 정보
        var mytimer = new gbox3d.core.Timer();


        var framerate_info_element = param.framerate_info_element;
        var gameLoopCallBack = param.gameLoopCallBack;

        var frame_total = 0;
        var loop_count = 0;


        //게임 루프
        requestAnimationFrame( function loop() {

            var deltaTime = mytimer.getDeltaTime();

            if(framerate_info_element) {
                if(deltaTime != 0 )
                    frame_total += Math.round(1.0 / deltaTime);

                if(param.loopCount_limit) {
                    if(loop_count > param.loopCount_limit) {
                        frame_total = deltaTime;
                        loop_count = 0;
                    }
                }

                loop_count++;


                Pig2d.system.currentFPS = Math.round(frame_total / loop_count);
                framerate_info_element.innerText = Pig2d.system.currentFPS + '/' + loop_count;
            }

            if(gameLoopCallBack) {
                gameLoopCallBack(deltaTime);
            }
            requestAnimationFrame(loop);

        });
    },
    //////////////////////////////
    LoadAsset : function(param) {

        var asset_path = param.asset_path;
        var img_files = param.img_files;
        var animation_files = param.animation_files;
        var OnLoadComplete = param.OnLoadComplete;
        var OnLoadProgress = param.OnLoadProgress;
        var textures = {};
        var animations = {};
        var i=0;


        function preLoadAnimation(filename,data) {

            if(data) {
                //console.log(filename);
                animations[filename] = data;
            }

            if(animation_files.length <= i) {

                var result = {};
                result.textures = textures;
                result.animations = animations;
                if(OnLoadComplete != undefined)
                    OnLoadComplete(result);

            }
            else {
                var url = asset_path + animation_files[i];
                var file_name = animation_files[i];
                i++;
                $.ajax({
                    type : "GET",
                    url : url,
                    dataType : "json",
                    success : preLoadAnimation.bind(this,file_name),
                    error : function(evt,status,xhr) {

                        console.log(status);

                    }
                });
            }

        }


        (function preLoadImg() {

            var imgObj = new Image();
            imgObj.onload = function() {

                var evt = {};
                textures[img_files[i]] = imgObj;

                evt.percent = (i/img_files.length) * 100;
                evt.currentIndex = i;

                if(OnLoadProgress != undefined)
                    OnLoadProgress(evt);

                i++;

                if(i < img_files.length) {
                    preLoadImg(); //다음 이미지 로딩
                }
                else {

                    if(animation_files) {
                        i=0;
                        preLoadAnimation();
                    }
                    else {
                        var result = {};
                        result.textures = textures;
                        if(OnLoadComplete != undefined)
                            OnLoadComplete(result);

                    }


                }

            }

            imgObj.src =  asset_path + img_files[i];


        })();
    },
    InitAssetSystem : function(param) {

        function ProcessAsset(data) {

            var assetData = data;
            //assetData = data;
            assetData.OnLoadComplete = (function(resData) {

                //프레임을 표시하기위해서 필요한 캔버스 최대 크기를 구한다.
                function calcMaxCanvasSize(animations) {

                    function getCanvasSize(animation) {

                        var maxw=0,maxh=0;
                        for(var i=0;i< animation.frames.length;i++) {

                            var width = animation.frames[i].sheets[0].width;
                            var height = animation.frames[i].sheets[0].height;

                            if(maxw < width ) {
                                maxw = width
                            }

                            if(maxh < height ) {
                                maxh = height
                            }
                        }

                        animation.canvas_size = {
                            width : maxw,
                            height : maxh
                        };
                    }

                    for(var key in animations) {
                        getCanvasSize(animations[key]);
                    }
                }
                calcMaxCanvasSize(resData.animations);


                this.getAssetDataInfo = function (name) {

                    var object_info = this.objects[name];

                    return {
                        texture : resData.textures[this.img_files[object_info.texture]],
                        animation : resData.animations[this.animation_files[object_info.animation]]
                    }

                }

                this.resData = resData;



                param.OnLoadComplete(this);
            }).bind(assetData);

            assetData.OnLoadProgress = param.OnLoadProgress;


            Pig2d.system.LoadAsset(
                assetData
            );

        }

        if(param.filename) {
            $.ajax({
                type : "GET",
                url : param.filename,
                dataType : "json",
                success : function(data,status,xhr) {

                    console.log(data);

                    ProcessAsset(data);

                },
                error : function(evt,status,xhr) {

                    console.log(status);

                }
            });
        }
        else if(param.data) {
            ProcessAsset(param.data);
        }




    }

}

