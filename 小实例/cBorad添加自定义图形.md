## cBorad添加自定义图形
### 一.在widgetCtrl.js里面需要做的修改
#### 1.$scope.chart_types数组里面加上需要加的图形的一些定义的对象，如：
```
{
    name: translate('CONFIG.WIDGET.THERMOMETER'),
    value: 'thermometer',
    class: 'cThermometer',
    row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
    column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
    measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
}
```
#### 2.$scope.chart_types_status对象里面加上上面1中对应value的名字，这里是‘thermometer’，设置值为true，如：
```
"thermometer": true
```
这里必须要加上，后面每次处理数据或者渲染之前都要先判断该图形在$scope.chart_types_status对象中对象的名字是否为true。    
#### 3. $scope.configRule对象中添加上面1中对应的value的名字的对象，这里是‘thermometer’，为其设置keys，groups，filters，values属性，如：
```
thermometer: {keys: 0, groups: 0, filters: -1, values: 1},
```
在这段代码的上面有注释：    
         *  0:  None items    
         *  1:  only 1 item    
         * -1:  None Restrict    
         *  2:  1 or more    
这里表示鼠标悬浮在小图标上给的提示：
![image](https://github.com/tiankongyujiao/zjProject/blob/master/dog.jpg)
keys代表的是图形界面中的Row,groups对应Column，filters对应Filter,values对应Value。    
#### 4. $scope.changeChart方法里面在switch ($scope.curWidget.config.chart_type) {}里面添加一个你添加的图表的对应的case，如：
```
case 'thermometer':
    $scope.curWidget.config.values.push({name: '', cols: []});
    _.each(oldConfig.values, function (v) {
        _.each(v.cols, function (c) {
            $scope.curWidget.config.values[0].cols.push(c);
        });
    });
    $scope.curWidget.config.selects = angular.copy($scope.columns);
    break;
```
### 二.chartService.js需要做的修改
#### 1.引入新的图表service，如：
```
cBoard.service('chartService', function($q, dataService, chartPieService,..., chartThermometerService) {
```
#### 2.getChartServices函数添加对应的service，如：
```
case 'thermometer':
      chart = chartThermometerService;
      break;
```
### 三.添加在chartService.js里面getChartServices()方法获取的处理该图表的servie文件，这里是添加了一个chartThermometerService.js文件：
目录在org/cboard/service/chart/chartThermometerService.js。   
```
'use strict';
cBoard.service('chartThermometerService', function () {

    this.render = function (containerDom, option, scope, persist) {
        if (option == null) {
            containerDom.html("<div class=\"alert alert-danger\" role=\"alert\">No Data!</div>");
            return;
        }
        var height;
        scope ? height = scope.myheight - 20 : null;
        return new CBoardThermometerRender(containerDom, option).chart(height, persist);
    };

    this.parseOption = function (data) {
        var aggregate_data = data.data;
        var value = aggregate_data.length > 0 ? aggregate_data[0][0] : 'N/A';
        var option = {
            value: value
        }
        return option;
    };
});
```
### 四.添加一个渲染该图表的渲染文件，这里是:CBoardThermometerRender.js
路径是：org/cboard/util/CBoardThermometerRender.js
```
/**
 * Created by zhaojiao on 2018/9/18.
 */
var CBoardThermometerRender = function (jqContainer, options, isDeepSpec) {
    this.container = jqContainer; // jquery object
    this.options = options;
};
CBoardThermometerRender.prototype.chart = function (group, persist) {
    var self = this,
        percent = parseFloat(self.options.series[0].data[0].value) / 1.1; // 总共100%的长度分了110份  所以要除1.1
    percent = percent/100 > 1/1.1 ? 105/110*100 : percent; // 如果大于105就固定显示在105的位置，总共就110，超过100只是一个提示作用
    $(this.container).html('<div class="thermometerContainer" style="position:relative;">'
        +'<div class="progress-bar progress-bar-danger progress-bar-striped" aria-valuenow="80%" style="width:60%">80%</div>'
        +'<div class="progress-bar progress-bar-info progress-bar-striped" aria-valuenow="95%" style="width:20%">95%</div>'
        +'<div class="progress-bar progress-bar-striped progress-bar-warning" aria-valuenow="100%" style="width:10%">100%</div>'
        +'<div class="progress-bar progress-bar-success progress-bar-striped" aria-valuenow=">100%" style="width:10%">>100%</div>'
        +'<div class="percentValue" style="left:'+ percent +'%"><i title="Current： '+ percent.toFixed(2) +'%" class="fa faArrow fa-sort-desc" data-toggle="tooltip" data-placement="right"></i></div>'
        +'</div>')
};
```
在chartService.js里面获取数据完了以后会调用chart.render的方法，chart就是这里添加的chartThermometerService服务，然后再chartThermometerService的render方法里面会new一个CBoardThermometerRender.js里面的CBoardThermometerRender的一个实例，并调用实例的render方法，渲染出具体的图表。    
其中在chartThermometerService.js里面还有一个parseOption方法，这是每个service服务必不可少的一个方法，它用来处理最终要使用的数据形式。 
### 五.最后还要加上两个html文件：
1. src\main\webapp\org\cboard\view\config\chart\thermometer.html    
2. src\main\webapp\org\cboard\view\config\chart\options\thermometer.html    
第一个文件是widget页面的配置文件，如下：
![image](https://github.com/tiankongyujiao/zjProject/blob/master/config.jpg)
第二个文件是widget页面的配置tab的options tab下面的内容，如下：
![image](https://github.com/tiankongyujiao/zjProject/blob/master/option.jpg)
这里只是实现了一个简单的类似体温计横过来的百分比的显示，类似仪表盘的功能，只是展示界面样式风格不一样，当然样式要自己加上。
### 六.后续发现的问题：
#### （1）在dashboard页面点击param筛选的时候，其他之前的图表都会重新请求数据，而新加的图表没有重新请求数据，因为刷新页面和点击param筛选渲染图表前面的逻辑不是一套，筛选走的是chartService.js里面的realTimeRender函数，刷新页面走的是render函数，realTimeRender函数的第一个参数是realTimeTicket，这个是在刷新页面第一次渲染的时候在如下图位置赋值的：
![image](https://github.com/tiankongyujiao/zjProject/blob/master/dashboard.jpg)
一直追踪查找，会发现这个值最开始是在图表render文件里面return的，即要在CBoardThermometerRender.js里面CBoardThermometerRender.prototype.chart方法最后retrun这个对象：
```
return function (o) {
    self.options = o;
    self.chart(self.tall);
}
```
加上去之后就可以了。
#### (2)导出的时候新加的图表是空的：
同样要在CBoardThermometerRender.jsCBoardThermometerRender.prototype.chart方法加上：
```
if(persist){
    setTimeout(function () {
        self.container.css('background', '#fff');
        html2canvas(self.container[0], {
            onrendered: function (canvas) {
                persist.data = canvas.toDataURL("image/jpeg");
                persist.type = "jpg";
                persist.widgetType = "thermometer";
            }
        });
    }, 1000);
}
```
