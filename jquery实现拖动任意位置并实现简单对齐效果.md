##### jquery实现拖动任意位置并实现简单对齐效果
从列表拖动元素到画布，在画布任意拖动，缩放大小，选择多个元素，以第一个为基准实现上对齐和左对齐。
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>drag</title>
    <script type="text/javascript" src="https://dss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/jquery/jquery-1.10.2.min_65682a2.js"></script>
</head>

<body>
    <div class="wrap">
        <button class="setReferToTop">上对齐</button>
        <button class="setReferToLeft">左对齐</button>
        <ul class="charts">

        </ul>
        <div class="drop-panel" ondrop="drop(event)" ondragover="allowDrop(event)">

        </div>
    </div>
    <script>
        // 左边拖拽列表数据
        var list = [{
            id: 1,
            type: 'line',
            name: 'line'
        }, {
            id: 2,
            type: 'bar',
            name: 'bar'
        }, {
            id: 3,
            type: 'pie',
            name: 'pie'
        }];

        var id = 0; // canvasMap的id递增初始值
        var canvasMap = []; // 拖动到右面画布上的所有元素数组
        var currentSelect = {}; // 当前选择的元素
        var selectArr = []; // 选择的元素数组
        var activeIndex = 0; // 当前选择的元素的index
        var resizeType = ''; // 缩放大小的方式
        var initDistance = {
            x: 0,
            y: 0
        };
        var dragData = {
            dragX: 0, // 缓存鼠标单次滑动的x
            dragY: 0, // 缓存鼠标单次滑动的y
            startX: 0, // 记录开始位置x
            startY: 0, // 记录开始位置y
            startWidth: 0, // 记录开始缩放的宽度
            startHeight: 0, // 记录开始缩放的高度
            dragging: false
        };

        // ondragover 事件在可拖动元素或选取的文本正在拖动到放置目标时触发，默认情况下，数据/元素不能放置到其他元素中。 如果要实现改功能，我们需要防止元素的默认处理方法。我们可以通过调用 event.preventDefault() 方法来实现 ondragover 事件。
        function allowDrop(ev) {
            ev.stopPropagation();
            ev.preventDefault();
        };

        // ondragstart 事件在用户开始拖动元素或选择的文本时触发
        function drag(ev, id) {
            var obj = {}
            list.forEach(function(item) {
                item.id == id ? obj = item : undefined;
            })

            ev.dataTransfer.setData("text", JSON.stringify(obj));
        };

        // 获取拖动到画布中的相对于画布的坐标
        function getXY(ev) {
            var distance = {
                x: ev.clientX,
                y: ev.clientY
            };
            var center = {
                x: document
                    .getElementsByClassName("drop-panel")[0]
                    .getBoundingClientRect().left,
                y: document
                    .getElementsByClassName("drop-panel")[0]
                    .getBoundingClientRect().top
            };
            return {
                x: distance.x - center.x,
                y: distance.y - center.y
            };
        };

        // ondrop 事件在可拖动元素或选取的文本放置在目标区域时触发。
        // 拖动完成以后往canvasMap数组追加一个对象，标识这个元素，同时使用append追加dom元素
        function drop(ev) {
            ev.stopPropagation();
            ev.preventDefault();

            var item = JSON.parse(ev.dataTransfer.getData("text"));

            var position = getXY(ev);

            item = $.extend(true, item, {
                id: id,
                width: 200,
                height: 100,
                x: position.x,
                y: position.y
            })
            currentSelect = item;
            id++;
            canvasMap.push(item);
            selectArr.push(item);
            // $('.drop-panel').find('.canvas').addClass('hide');
            var str = '<div class="canvas transform-handler" style="width:' + item.width + 'px; height: ' + item.height + 'px; left: ' + item.x + 'px; top: ' + item.y + 'px"><input type="hidden" value=' + item.id + ' />' + item.name + '<i class="top-handler"><span class="control-point"></span></i><i class="left-handler"><span class="control-point"></span></i><i class="bottom-handler"><span class="control-point"></span></i><i class="right-handler"><span class="control-point"></span></i><i class="top-left-handler"><span class="control-point"></span></i><i class="top-right-handler"><span class="control-point"></span></i><i class="bottom-left-handler"><span class="control-point"></span></i><i class="bottom-right-handler"><span class="control-point"></span></i></div>';
            $('.drop-panel').append(str);
        };
        console.log(132456798);
        $(function() {
            // 页面dom加载完成以后动态初始化左边的可拖动列表
            console.log(list, 'list');
            list.forEach(function(item) {
                var str = '<li class="chart" draggable="true" ondragstart="drag(event, ' + item.id + ')"><input type="hidden" value=' + item.id + ' />' + item.name + '</li>';
                $('.charts').append(str);
            });

            // 点击面板时取消所有选择的元素
            $('.drop-panel').on('mousedown', function(ev) {
                $('.drop-panel').find('.canvas').addClass('hide');
                selectArr = [];
            });

            // 拖拽开始
            $('.drop-panel').on('mousedown', '.transform-handler', function(ev) {
                ev.stopPropagation();
                activeIndex = $(this).index();
                currentSelect = canvasMap[activeIndex];

                // 计算鼠标的相对位置
                var distance = {
                    x: ev.clientX,
                    y: ev.clientY
                };
                // 记录开始的xy
                dragData.startX = distance.x;
                dragData.startY = distance.y;

                $(window).on('mousemove', dragMove);
                $(window).on('mouseup', dragEnd);
            });

            // 拖拽移动
            function dragMove(ev) {
                dragData.dragging = true;
                var distance = {
                    x: ev.clientX,
                    y: ev.clientY
                };
                var diffDistance = {
                    x: Math.floor(distance.x - dragData.startX),
                    y: Math.floor(distance.y - dragData.startY)
                };
                canvasMap[activeIndex].x += diffDistance.x;
                canvasMap[activeIndex].y += diffDistance.y;
                $('.drop-panel').find('.canvas').eq(activeIndex).css({
                    'left': canvasMap[activeIndex].x,
                    'top': canvasMap[activeIndex].y
                });
                // 重新赋值开始的xy
                dragData.startX = distance.x;
                dragData.startY = distance.y;

                currentSelect = canvasMap[activeIndex];
            }

            // 拖拽结束
            function dragEnd() {
                if (!dragData.dragging) {
                    var currentDom = $('.drop-panel').find('.canvas').eq(activeIndex);
                    if (currentDom.hasClass('hide')) {
                        currentDom.removeClass('hide');
                        selectArr.push(canvasMap[activeIndex]);
                    } else {
                        currentDom.addClass('hide');
                        selectArr.splice(activeIndex, 1);
                    }
                }
                dragData.dragging = false;
                $(window).off('mousemove');
                $(window).off('mouseup');
            };

            // 缩放开始
            $('.drop-panel').on('mousedown', '.bottom-right-handler .control-point, .bottom-left-handler .control-point, .top-right-handler .control-point, .top-left-handler .control-point, .bottom-handler .control-point, .left-handler .control-point, .top-handler .control-point, .right-handler .control-point', function(ev) {
                var canvas = $(this).parents('.canvas');
                var val = canvas.find('input[type=hidden]').val();
                activeIndex = val;

                currentSelect = canvasMap[activeIndex];

                resizeType = $(ev.target).parent('i').attr('class');

                distance = {
                    x: ev.clientX,
                    y: ev.clientY
                };

                // 缓存鼠标点击位置，会事实更新
                dragData.dragX = distance.x;
                dragData.dragY = distance.y;
                // 记录开始的xy
                dragData.startX = currentSelect.x;
                dragData.startY = currentSelect.y;
                // 记录开始的width height
                dragData.startWidth = currentSelect.width;
                dragData.startHeight = currentSelect.height;
                dragData.dragging = true;

                $(window).on('mousemove', scaleMove);
                $(window).on('mouseup', scaleEnd);

                return false; // 阻止冒泡和默认行为
            });

            // 缩放移动
            function scaleMove(ev) {
                if (!dragData.dragging) return false;

                var distance = {
                    x: ev.clientX,
                    y: ev.clientY
                };
                // 换算实际transform宽高
                var transform = {
                    w: Math.floor(distance.x - dragData.dragX),
                    h: Math.floor(distance.y - dragData.dragY)
                };
                resizeWidth(resizeType, transform.w, transform.h);
            };

            // 缩放结束
            function scaleEnd(ev) {
                dragData.dragging = false;
                resizeType = "none";

                $(window).off('mousemove');
                $(window).off('mouseup');
            };

            // 根据缩放类型来调节宽高
            function resizeWidth(type, w, h) {
                var canvasContainer = $('.drop-panel').find('.canvas').eq(activeIndex);
                switch (type) {
                    case "top-handler": // 上边
                        canvasContainer.css({
                            'height': dragData.startHeight - h,
                            'top': dragData.startY + h
                        });
                        canvasMap[activeIndex].height = dragData.startHeight - h;
                        canvasMap[activeIndex].y = dragData.startY + h;
                        break;
                    case "left-handler": // 左边
                        canvasContainer.css({
                            'width': dragData.startWidth - w,
                            'left': dragData.startX + w
                        });
                        canvasMap[activeIndex].width = dragData.startHeight - h;
                        canvasMap[activeIndex].y = dragData.startY + h;
                        break;
                    case "bottom-handler": // 下面 
                        canvasContainer.css({
                            'height': dragData.startHeight + h
                        });
                        canvasMap[activeIndex].height = dragData.startHeight + h;
                        break;
                    case "right-handler": // 右边                           
                        canvasContainer.css({
                            'width': dragData.startWidth + w
                        });
                        canvasMap[activeIndex].width = dragData.startWidth + w;
                        break;
                    case "top-left-handler": // 左上角
                        canvasContainer.css({
                            'width': dragData.startWidth - w,
                            'height': dragData.startHeight - h,
                            'left': dragData.startX + w,
                            'top': dragData.startY + h
                        });
                        canvasMap[activeIndex].width = dragData.startWidth - w;
                        canvasMap[activeIndex].height = dragData.startHeight - h;
                        canvasMap[activeIndex].x = dragData.startX + w;
                        canvasMap[activeIndex].y = dragData.startY + h;
                        break;
                    case "top-right-handler": // 右上角
                        canvasContainer.css({
                            'width': dragData.startWidth + w,
                            'height': dragData.startHeight - h,
                            'top': dragData.startY + h
                        });
                        canvasMap[activeIndex].width = dragData.startWidth - w;
                        canvasMap[activeIndex].height = dragData.startHeight - h;
                        canvasMap[activeIndex].y = dragData.startY + h;
                        break;
                    case "bottom-left-handler": // 左下角
                        canvasContainer.css({
                            'width': dragData.startWidth - w,
                            'height': dragData.startHeight + h,
                            'left': dragData.startX + w
                        });
                        canvasMap[activeIndex].width = dragData.startWidth - w;
                        canvasMap[activeIndex].height = dragData.startHeight + h;
                        canvasMap[activeIndex].x = dragData.startX + w;
                        break;
                    case "bottom-right-handler": // 右下角
                        canvasContainer.css({
                            'width': dragData.startWidth + w,
                            'height': dragData.startHeight + h
                        });
                        canvasMap[activeIndex].width = dragData.startWidth + w;
                        canvasMap[activeIndex].height = dragData.startHeight + h;
                        break;
                }
            };

            // 以第一个选择的元素为基准上对齐
            $('body').on('click', '.setReferToTop', function() {
                var refer = selectArr[0];
                var ids = [];
                selectArr.forEach(function(item) {
                    ids.push(item.id);
                })
                canvasMap.forEach(function(item, index) {
                    if (ids.indexOf(index) !== -1) {
                        item.y = refer.y;
                        $('.drop-panel .canvas').eq(index).css({
                            'top': refer.y + 'px'
                        });
                    }
                });
            });

            // 以第一个选择的元素为基准左对齐
            $('body').on('click', '.setReferToLeft', function() {
                var refer = selectArr[0];
                var ids = [];
                selectArr.forEach(function(item) {
                    ids.push(item.id);
                })
                canvasMap.forEach(function(item, index) {
                    if (ids.indexOf(index) !== -1) {
                        item.x = refer.x;
                        $('.drop-panel .canvas').eq(index).css({
                            'left': refer.x + 'px'
                        })
                    }
                });
            });
        })
    </script>
    <style>
        .wrap {
            overflow: hidden;
        }
        
        .charts {
            float: left;
        }
        
        .charts li {
            list-style: none;
            width: 60px;
            height: 30px;
            line-height: 30px;
            background: #ccc;
            border: 1px solid #000;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .drop-panel {
            float: left;
            margin-left: 20px;
            width: 1000px;
            height: 800px;
            border: 1px solid #ccc;
            position: relative;
        }
        
        .canvas {
            position: absolute;
            line-height: 100px;
            background-color: #ccc;
            text-align: center;
            border: 1px solid #807c7c;
        }
    </style>
    <style>
        .transform-handler.selected .bottom-handler,
        .transform-handler.selected .left-handler,
        .transform-handler.selected .right-handler,
        .transform-handler.selected .top-handler {
            display: -webkit-box !important;
            display: -ms-flexbox !important;
            display: flex !important;
        }
        
        .transform-handler .top-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            top: -5px;
            width: 100%;
            height: 11px;
        }
        
        .transform-handler .top-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: ns-resize;
        }
        
        .transform-handler .top-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .bottom-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            bottom: -5px;
            width: 100%;
            height: 11px;
            float: left;
        }
        
        .transform-handler .bottom-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: ns-resize;
        }
        
        .transform-handler .bottom-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .left-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: -5px;
            width: 11px;
            height: 100%;
        }
        
        .transform-handler .left-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: ew-resize;
        }
        
        .transform-handler .left-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .right-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            top: 0;
            right: -5px;
            width: 11px;
            height: 100%;
        }
        
        .transform-handler .right-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: ew-resize;
        }
        
        .transform-handler .right-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .top-left-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            left: -5px;
            top: -5px;
            height: 11px;
            width: 11px;
            cursor: nwse-resize;
        }
        
        .transform-handler .top-left-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
        }
        
        .transform-handler .top-left-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .top-right-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            right: -5px;
            top: -5px;
            height: 11px;
            width: 11px;
        }
        
        .transform-handler .top-right-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: nesw-resize;
        }
        
        .transform-handler .top-right-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .bottom-left-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            bottom: -5px;
            left: -5px;
            height: 11px;
            width: 11px;
        }
        
        .transform-handler .bottom-left-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: nesw-resize;
        }
        
        .transform-handler .bottom-left-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler .bottom-right-handler {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: absolute;
            bottom: -5px;
            right: -5px;
            height: 11px;
            width: 11px;
        }
        
        .transform-handler .bottom-right-handler .control-point {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 20px;
            width: 20px;
            z-index: 2;
            cursor: nwse-resize;
        }
        
        .transform-handler .bottom-right-handler .control-point::after {
            content: '';
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background: #fff;
            border: 1px solid #807c7c;
        }
        
        .transform-handler.hide>.transform-bg,
        .transform-handler.hide>i[class$="-handler"],
        .transform-handler.hide>i[class$="-handler"] .control-point {
            display: none;
        }
        
        .transform-handler.hide {
            border: none;
        }
    </style>
</body>

</html>
```
