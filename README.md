pig2d
=====

#### HTML5 2D game engine ####

fast and samll but strong html5 2d game engine

이 엔진은 세가지 기본 구성요소인 
node , model , scenemanager
 로 이루어져 있습니다.

씬매니져를 만들고 노드를 만들어서 씬매니져에 추가 시켜는 형식으로 사용합니다.

엔진을 사용하기 위해서 헤더에 추가 시켜야할 것들 입니다.

```html
<link rel="stylesheet" href="../libs/pig2d/css/core.css" />

<script src="../libs/jquery-2.0.3.min.js"></script>

<script src="../libs/backbone/underscore.js"></script>
<script src="../libs/backbone/backbone.js"></script>

<script src="../libs/gl-matrix-min.js"></script>
<script src="../libs/pig2d/js/core.js"></script>
<script src="../libs/pig2d/js/node2d.js"></script>

```

CDN 버전

```html
<link href="https://rawgithub.com/gbox3d/pig2d/master/libs/pig2d/css/core.css" rel="stylesheet"></link>

    
<script src="http://code.jquery.com/jquery-latest.js"></script>

    
<script src="https://rawgithub.com/gbox3d/pig2d/master/libs/backbone/underscore.js"></script>
<script src="https://rawgithub.com/gbox3d/pig2d/master/libs/backbone/backbone.js"></script>


    
<script src="https://rawgithub.com/gbox3d/pig2d/libs/gl-matrix-min.js"></script>
<script src="https://rawgithub.com/gbox3d/pig2d/master/libs/pig2d/js/core.js"></script>
<script src="https://rawgithub.com/gbox3d/pig2d/master/libs/pig2d/js/node2d.js"></script>

```

https://rawgithub.com/gbox3d/  대신에  http://gbox3d.github.io/ 로 해주셔도 됩니다.

기본 1 형식

전체화면모드로 씬을 만들고 그안에서 노드로 씬을 구성합니다.

[기본샘플 보기](http://gbox3d.github.io/pig2d/sample/1.1.simplesample.html)

```html

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />

    <title> simple sample </title>

    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.0, user-scalable=no">

    <link rel="stylesheet" href="../libs/pig2d/css/core.css" />

    <!--제이쿼리가 종속성 관계에서 가장 높은 위치이다 그래서 맨먼저 쓴다-->
    <script src="../libs/jquery-2.0.3.min.js"></script>

    <script src="../libs/backbone/underscore.js"></script>
    <script src="../libs/backbone/backbone.js"></script>


    <script src="../libs/gl-matrix-min.js"></script>

<!--pig2d 엔진은 제이쿼리와 백본에 종속적이므로 맨 나중에 쓴다-->
    
    <script src="../libs/pig2d/js/core.js"></script>
    <script src="../libs/pig2d/js/node2d.js"></script>
    
</head>

<body>

<div class="pig2d-fullscreen" >
    <p id ='text-framerate-info' style="position: absolute" >frame rate</p>
</div>

<script>

    //씬메니져 생성하기
    var Smgr = new Pig2d.SceneManager({
        container : document.querySelector('.pig2d-fullscreen')
    });

    //스프라이트 노드 만들어서 씬노드메니져에 추가하기
    var node = Smgr.addImageNode({
        img_info : {
            texture : '../res/atat/atat-body.png',
            texture_size : {
                width :298,
                height : 191
            }
        }
    });

    //컨트롤러 설정
    Pig2d.util.setup_pig2dTestController(
            document, //이벤트를 받을 대상 (여기서는 화면 전체임)
            node//조종할 대상이 되는 오브잭트
    );

    //타이머 설정 및 퍼포먼트 테스트용 정보
    var mytimer = new gbox3d.core.Timer();
    var framerate_info = document.querySelector("#text-framerate-info");
    var frame_total = 0;
    var loop_count = 0;

    //게임 루프
    requestAnimationFrame(
            function loop() {

                var deltaTime = mytimer.getDeltaTime();
                frame_total += Math.round(1.0 / deltaTime);

                loop_count++;

                framerate_info.innerText = Math.round(frame_total / loop_count);

                //씬메니져 업데이트
                //여기서 모든 노드들의 최신상태가 화면에 반영이 된다.
                Smgr.updateAll();

                requestAnimationFrame(loop);

            }

    );

</script>



</body>
</html>

```

[jsfiddle 연습용 예제](http://jsfiddle.net/gbox3d/VhSgu/)





