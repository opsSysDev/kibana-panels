kibana-panels
=============

## 基于kibana3 v0.0.2


## 安装
1. 将panels下面的statisticstrend目录拷贝到kibana的app/panels下面.
2. 配置config.js. 在panel_names列表中添加相应的panel名字(statisticstrend).


## 配置使用范例

### 对比历史数据图表

####不一定准确,取决于trysize(trysize >= distinct field count时可以确保准确.); Min/Max Count还没实现

> 配置页面.
统计appname的timetakne的平均值, 和上周同一时间段对比.
按timetaken平均值的大小倒排.
<img src="https://raw.githubusercontent.com/opsSysDev/kibana-panels/master/images/statisticstrend/edit.png">

> 图表显示页面.
<img src="https://raw.githubusercontent.com/opsSysDev/kibana-panels/master/images/statisticstrend/display.png">

