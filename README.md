pig2d
=====

#### HTML5 2D game engine ####

fast and samll but strong html5 2d game engine

씬매니져를 만들고 노드를 만들어서 씬매니져에 추가 시켜는 형식으로 사용합니다.

엔진을 사용하기 위해서 헤더에 추가 시켜야할 것들 입니다.

```html
<link rel="stylesheet" href="../libs/pig2d/css/core.css" />

<script src="../libs/jquery-2.0.3.min.js"></script>

<script src="../libs/backbone/underscore-min.js"></script>
<script src="../libs/backbone/backbone-min.js"></script>

<script src="../libs/pig2d/js/core.js"></script>
<script src="../libs/pig2d/js/node2d.js"></script>

```

CDN 버전

```html
<link href="http://gbox3d.github.io/pig2d/libs/pig2d/css/core.css" rel="stylesheet"></link>

<script src="https://code.jquery.com/jquery-latest.js"></script>

    
<script src="https://gbox3d.github.io/pig2d/libs/backbone/underscore-min.js"></script>
<script src="https://gbox3d.github.io/pig2d/libs/backbone/backbone-min.js"></script>

            
<script src="https://gbox3d.github.io/pig2d/libs/pig2d/js/core.js"></script>
<script src="https://gbox3d.github.io/pig2d/libs/pig2d/js/node2d.js"></script>

             
```

기본 예제

전체화면모드로 씬을 만들고 그안에서 노드로 씬을 구성합니다.

[기본샘플 보기](http://gbox3d.github.io/pig2d/sample/basic/1.simplesample.html)

```html

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />

    <title> simple sample </title>

    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.0, user-scalable=no">

    <link rel="stylesheet" href="../../libs/pig2d/css/core.css" />

    <!--제이쿼리가 종속성 관계에서 가장 높은 위치이다 그래서 맨먼저 쓴다-->
    <script src="../../libs/jquery-2.0.3.min.js"></script>

    <!--백본은 제이쿼리 다음에 포함시키는것이 건강에 이롭다 -->
    <script src="../../libs/backbone/underscore-min.js"></script>
    <script src="../../libs/backbone/backbone-min.js"></script>

    <!--pig2d 엔진은 제이쿼리와 백본에 종속적이므로 맨 나중에 쓴다-->

    <script src="../../libs/pig2d/js/core.js"></script>
    <script src="../../libs/pig2d/js/node2d.js"></script>
    <script src="../../libs/pig2d/js/system.js"></script>


</head>

<body>

<div class="pig2d-fullscreen" >
    <p id ='text-framerate-info' style="position: absolute" >frame rate</p>
</div>

<script>


    function main(evt) {

        var textures = evt.textures;

        //씬메니져 생성하기
        var Smgr = new Pig2d.SceneManager({
            container : document.querySelector('.pig2d-fullscreen')
        });

        //스프라이트 노드 만들기
        var node = Pig2d.util.createSlicedImage({
            imgObj : textures['av8_harrier.png'],
            basex : -textures['av8_harrier.png'].width/2,
            basey : -textures['av8_harrier.png'].height/2
        });

        node.get('model').setPosition(300,200);

        //씬메니져 등록하기
        Smgr.add(node);

        //컨트롤러 설정
        Pig2d.util.setup_pig2dTestController(
                document, //이벤트를 받을 대상 (여기서는 화면 전체임)
                node//조종할 대상이 되는 오브잭트
        );

        //게임루프시작
        Pig2d.system.startGameLoop({

            framerate_info_element : document.querySelector("#text-framerate-info"),
            gameLoopCallBack : function(deltaTime) {

                //씬메니져 업데이트
                //여기서 모든 노드들의 최신상태가 화면에 반영이 된다.
                Smgr.updateAll(deltaTime);

            },
            loopCount_limit : 30
        });

    }


    Pig2d.util.SetupAsset({
        asset_path : "../../res/",
        img_files : [
                "av8_harrier.png"
        ],
        OnLoadComplete : main

    });


</script>



</body>
</html>

```






