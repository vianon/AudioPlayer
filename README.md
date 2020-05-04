# AudioPlayer
在线音频播放器

# Sample
在网页源码中直接插入代码：
<pre><script src="AudioPlayer.js?url=http://xxxxxxxx.mp3"></script></pre>
<pre><script src="AudioPlayer.js?file=songs"></script></pre>

# Readme
可使用三个参数，按下列顺序优先：<br>
url: 单文件播放，直接填入音频文件地址；<br>
file: 外部JSON文件，默认放在同级目录，Key为PlayList，类型为Array；<br>
id: 数据库读取接口（预留，需自行开发）。

# 特点
原生JS无依赖、兼容好、单文件、轻量级、移动端支持