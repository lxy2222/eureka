---
title: "在Eclipse中调用Algs4库"
date: 2016-04-21
draft: false
tags: ["tutorial", "translation"]
categories: ["programming"]
aliases: 
    - /2016/04/21/algs4-Eclipse.html
---

这篇是接[上一篇](http://shuxiao.wang/2016/04/20/algs4-windows.html)继续讲的，上一篇讲了如何在DrJava和命令行中使用javac-algs4和java-algs4，这一篇将讲述如何在Eclipse中调用教材库，也就是Algs4.jar

首先[下载Eclipse](https://www.eclipse.org/downloads/)，我选择的是[
Eclipse IDE for Java Developers](http://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/mars2)64位版本，下载下来之后解压缩到喜欢的位置然后双击Eclipse.exe启动

然后开始新建项目，File -> New Java Project，项目名随便写，如下图

![algs1](/images/algs4-translation/algs1.png)

右键src文件夹，Add -> New Java Class，这里需要注意Name一栏里填写的内容就是类名，这里我写了TestAlgs4，为了测试「算法 第四版」作者给的那个[测试样例
](http://algs4.cs.princeton.edu/windows/TestAlgs4.java.html)

![algs2](/images/algs4-translation/algs2.png)

代码如下：

```java
import edu.princeton.cs.algs4.StdDraw;

public class TestAlgs4 {
    public static void main (String[] args) {
        StdDraw.setScale(-1, 1);
        StdDraw.clear(StdDraw.BLACK);
        
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.square(0, 0, 1);
        
        // write some text
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.text(0, +0.95, "Hello, world! This is a test Java program.");
        StdDraw.text(0, -0.95, "Close this window to finish the installation.");
        
        // draw the bullseye
        StdDraw.setPenColor(StdDraw.BOOK_BLUE);
        StdDraw.filledCircle(0, 0, 0.9);
        StdDraw.setPenColor(StdDraw.BLACK);
        StdDraw.filledCircle(0, 0, 0.8);
        StdDraw.setPenColor(StdDraw.BOOK_BLUE);
        StdDraw.filledCircle(0, 0, 0.7);
        StdDraw.setPenColor(StdDraw.BLACK);
        StdDraw.filledCircle(0, 0, 0.6);

        // draw a picture of the textbook        
        StdDraw.picture(0, 0, "cover.jpg", 0.65, 0.80);
    }
}
```

这时候Eclipse应该会报错无数，不要急，添加对教材库Algs4.jar的引用：

右键工程名（我这里是HelloWorld）-> Properties -> Java Build Path -> Libraries -> Add Extenernal JARs，选中C:\Users\username\algs4\algs4.jar 即可，如图：

![algs3](/images/algs4-translation/algs3.png)

点击OK退出，报错信息消失，编译运行可以看到跟安装Algs4.exe一样的结果：

![algs4](/images/algs4-translation/algs4.png)

收工~

PS：以前只写过C#，没有用过Eclipse也对Java不太熟悉，都是按照C#和.Net的思路在配置，如果有不对的地方还请指出（知乎私信或者发邮件都可以），谢谢！