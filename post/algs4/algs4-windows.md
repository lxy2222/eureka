---
title: 在Windows上安装「算法 第四版」组件
date: 2016-04-20
draft: false
tags: ["tutorial", "translation"]
categories: ["programming"]
aliases: 
    - /2016/04/20/algs4-windows.html
---

这篇日志翻译自[Hello, World in Java on Windows](http://algs4.cs.princeton.edu/windows/)，翻译的原因是[知乎的一个回答](https://www.zhihu.com/question/36491917/answer/67791083)，回答完这个问题之后，得到了广泛的。。嗯。。。私信，私信我如何处理相关问题。惭愧地说，其实我也没有刷完这本书的所有题，但是处理一点入门型的问题好像还可以。但是我也没有精力挨个回复，所以翻译一下官方的回复，应该是够用了。所以说：其实大部分伸手党在伸手之前连官方文档都没有看全_(:з」∠)_

下面我们开始！

## 简介

这篇文档将向你介绍如何在Windows系统上安装本书将用到的Java开发环境，同时我们也提供了一个手把手的、使用我们提供的DrJava工具或者用命令行来创建、编译和运行你的第一个Java程序的手册，这个过程中用到的所有软件都可以自由下载

本操作指南适用于32位和64位的Windows 8、Windows 7、Vista SP1和XP SP3

## 0. 安装开发环境

我们提供的安装器将会自动下载、安装和配置你将用到的所有开发环境，包括Java SE 7、DrJava、教材库和命令行工具

+ 在电脑上登陆以后你会用来写代码的那个Windows账户，这个账户必须具有管理员权限（Administrator）且电脑必须连接到网络。『译者注：以我的经验，你最好还有一个全局翻墙工具，VPN或者Shadowsocks，不然很有可能下载失败』

+ 下载[algs4.exe](http://algs4.cs.princeton.edu/windows/algs4.exe)并双击进行安装，如果在安装开始前你收到一个用户账户控制的警告，点击「是」或者「允许」，如果在安装结束后你收到一个程序兼容性警告，点击「该程序已正确安装」

+ 如果安装成功，你将看到如下两个信息：
    
    * 一个内容这个[运行日志](http://algs4.cs.princeton.edu/windows/log.txt)的命令行窗口
    * 一个内容为蓝色靶心和教科书的标准绘图窗口
    
    需要注意的是：如果你的网络连接较慢的话，安装程序需要持续几分钟甚至更长时间
    
+ 删掉「algs4.exe」

## 1. 在DrJava中创建程序

现在你已经为你的第一个Java程序做好了准备，你将在一个叫DrJava的程序中开发你的Java程序。DrJava包含了语法高亮、匹配括号、自动缩进和显示行号等特性。

+ 在上一节中的安装包已经在桌面上创建了DrJava的快捷方式『译者注：如果不慎删掉，还可以在如下目录中找到该程序：C:\Users\Username\algs4』。双击以启动DrJava，如果你收到一个Windows安装警告，点击「允许运行」或者「不禁止」

+ 在DrJava的主窗体中，请向下面一样准确无误得输入[HelloWorld.java](http://introcs.cs.princeton.edu/java/11hello/HelloWorld.java.html)中的代码，哪怕你只是漏掉了一个分号，这个程序也不会运行,在你输入的时候，DrJava会为你准备缩进

```java
public class HelloWorld {
    public static void main(String[] args) { 
        System.out.println("Hello, World");
    }
}
```

+  最后，点击「保存」按钮来保存该文件，使用DrJava创建文件夹C:\Users\username\algs4\hello并将文件命名为「HelloWorld.java」，这个文件名是大小写敏感的而且必须匹配Java程序中的类名，其中username是你的Windows用户名

## 2. 在DrJava中编译程序

现在我们来将你的Java代码转化为可以在你的电脑上运行的东西，点击「编译」按钮（Compile），如果一切顺利的话，你会在DrJava底部的编译器输出窗格（Compiler Output Pane）看到这样一条信息

```
Compilation completed.
```

如果DrJava没有编译成功，你应该是输入错了一些东西，重新仔细检查你的代码，你可以用编译器输出窗格中的信息作为参考

## 3. 在DrJava中运行程序


现在来运行你的程序，这是很有趣的部分

在底部的交互窗格（Interactions pane）中输入下列信息，按照习惯，我们高亮了你用粗体输入的部分『译者注：由于博客模板限制我没办法在我这里加粗相应内容，需要看加粗的去看原文吧』

```
> java HelloWorld
```
  
如果一切顺利，你会看到如下信息：

```
Welcome to DrJava.  Working directory is C:\Users\username\algs4\hello
> java HelloWorld 
Hello, World
```
你或许会在成功运行前重复很多遍「编辑 - 编译 - 运行」的循环

## 4. 命令行界面

命令行工具提供了DrJava中也有的功能，包括重定向和管道。你将在「命令行工具」中输入你的指令

安装器在桌面上创建了一个命令行工具（Command Prompt），双击以启动命令行，你将会看到类似于这样的消息：

```
Microsoft Windows [Version 6.3.9600]
(c) 2013 Microsoft Corporation. All rights reserved.

C:\Users\username>
```

首先确认一下Java编译器已经被正确安装，在命令行中输入```javac -version```并确保输出内容跟下面一样

```
C:\Users\username>javac -version
javac 1.7.0_67
```

其次确认一下Java解释器被正确安装，在命令行中输入```java -version```并确保输出内容跟下面一样

```
C:\Users\username>java -version
java version "1.7.0_67"
Java(TM) SE Runtime Environment (build 1.7.0_67-b01)
Java HotSpot(TM) 64-Bit Server VM (build 24.65-b04, mixed mode)
```

如果你的机器是32位的，那么最后一行的内容应该是

```
Java HotSpot(TM) Client VM (build 24.65-b04, mixed mode, sharing)
```

## 5. 在命令行中编译程序

你可以使用`javac`命令来将你的Java代码转化为可以在你的电脑上运行的东西

在命令行中，通过`cd`命令导航到包含`HelloWorld.java`的目录下，一般是`C:\Users\username\algs4\hello`，例如：

```
C:\Users\username>cd C:\Users\username\algs4\hello
C:\Users\username\algs4\hello>
```

用```javac```命令进行编译

```
C:\Users\username\algs4\hello>javac HelloWorld.java
C:\Users\username\algs4\hello>
```

如果```HelloWorld.java```在当前目录下的话，你应该没有看到任何报错信息

如果用到了我们的标准库，你应该用```javac-algs4```来代替```javac```，例如：如果需要编译[TestAlgs4.java](http://algs4.cs.princeton.edu/windows/TestAlgs4.java.html)，这个程序引用了我们的标准绘图库，你应该这样写命令：

```
C:\Users\username\algs4>javac-algs4 TestAlgs4.java
```

『译者注 - start』

同理，如果你需要运行```javac-algs4```编译出来的```.class```文件的话，你也需要使用```java-algs4``` 来运行，而不是使用```java```来运行

『译者注 - end』

## 6. 在命令行中运行程序

你需要使用```java```命令来运行你的程序：

```
C:\Users\username\algs4\hello>java HelloWorld
Hello, World
```

你会在输出中看到```Hello, World```


如果你想使用教科书提供的库的话，需要用```java-algs4``` 来替代```java```，例如，在测试标准绘图和标准音频时你可以使用下面两条命令：

『译者注：使用之前需要注意！！！第一条命令是标准绘图，随便使用；第二条命令是标准音频，使用之后麦克风会开始播放奇怪的声音，请先调小音量，运行之后如果需要停止运行，除了直接关闭命令行窗口外，你还可以使用Ctrl+C的组合键来关闭这个运行』

```
C:\Users\username\algs4\hello>java-algs4 edu.princeton.cs.algs4.StdDraw
[ displays a graphics window with some geometric shapes and text ]

C:\Users\username\algs4\hello>java-algs4 edu.princeton.cs.algs4.StdAudio
[ plays an A major scale ]
```

## 7. 检查风格和查找bug

你可以使用检查缝合查找bug两个工具来核查你的代码风格并检查一些简单的bug

在命令行中可以这样使用检查风格功能：

```
C:\Users\username\algs4\hello>checkstyle-algs4 HelloWorld.java
Running checkstyle on HelloWorld.java:
Starting audit...
Audit done.
```

下面是一张可以检查的清单，你可以自定义这个风格检查，自定义的方法是编辑这个文件：```C:\Users\username\algs4\checkstyle-6.9\checkstyle.xml```

在命令行中可以这样使用查找bug功能

```
C:\Users\username\algs4\hello>findbugs-algs4 HelloWorld.class
Running findbugs on HelloWorld.class:
```

下面是一张可以检查的清单，你可以自定义这个bug检查，自定义的方法是编辑这个文件：```C:\Users\username\algs4\findbugs-3.0.1\findbugs.xml```




## 常见问题



**Q：我之前使用过另一本教材「Introduction to Programming in Java」的「introcs.app」安装器，我还应该使用「algs4.exe」安装器吗？**

A: 是的，我们推荐「algs4.exe」安装器是因为「introcs.app」安装器不包含「algs4.jar」库和相应的命令```javac-algs4```和```java-algs4``` 

**Q: 运行安装器时我遇到了访问被拒绝的错误信息，我该怎么办**

A： 确保你使用了一个管理员权限的账户，再重新运行一次安装器。另外，你的机器上可能有加密软件禁止写入```C:\Users\username\AppData\Local```目录，这也可能导致安装器运行失败

**Q：安装器根本不运行，为什么？**

A：这个安装器的运行需要PowerShell。运行Windows Update来升级你的电脑，如果是XP系统，你需要SP3。在XP SP3或者Vista环境下你也可以[手动下载PowerShell2.0](https://support.microsoft.com/en-us/kb/968929)

**Q: 我可以把安装目录设置在C盘以外的驱动器上吗？**

可以，但是你需要自己手动修改参数

**Q: 安装器在我的机器上不工作，怎么办？**

A: 联系一个工作人员，然后检查一下哪儿出问题了

**Q： 安装器到底做了些什么？**

A: 简而言之就是：下载，安装，配置了Java、DrJava、Checkstyle、Findbugs和教材库，下面是一个更加详细的清单：
    
  1. 从[java32.zip](http://algs4.cs.princeton.edu/windows/java32.zip)或者[java64.zip](http://algs4.cs.princeton.edu/windows/java64.zip)下载和安装[Java SE 7 Update 67](http://www.oracle.com/technetwork/java/javase/downloads/index.html)，这其中包含了Java Runtime Environment(java.exe)和一部分Java Development Kit(javac.exe and toools.jar)
    
  2. 从[algs4.jar](http://algs4.cs.princeton.edu/code/algs4.jar)下载教材库，并创建好```javac-algs4```和```java-algs4```的包装脚本
    
  3. 从[checkstyle.zip](http://algs4.cs.princeton.edu/windows/checkstyle.zip)下载并安装[Checkstyle 6.9](http://checkstyle.sourceforge.net/)，并从[checkstyle.xml](http://algs4.cs.princeton.edu/windows/checkstyle.xml)下载checkstyle的配置文件，给```checkstyle-algs4```创建包装脚本
    
  4. 从[findbugs.zip](http://algs4.cs.princeton.edu/windows/findbugs.zip)下载和安装[Findbug3.0.1](http://findbugs.sourceforge.net/)，从[findbugs.xml](http://algs4.cs.princeton.edu/windows/findbugs.xml)下载findbugs的配置文件，为```findbugs-algs4```创建包装脚本
    
  5. 从[drjava.jar](http://algs4.cs.princeton.edu/windows/drjava.jar)下载最新版本的[DrJava](http://drjava.org/)，为DrJava在桌面上创建一个快捷方式，从[drjava-config.txt](http://algs4.cs.princeton.edu/windows/drjava-config.txt)下载一个DrJava的配置文件到```C:\Users\username\.drjava```，注意，这个操作会覆盖掉任何已经存在的```.drjava```配置文件
    
  6. 在环境变量中，将```C:\Users\username\algs4\java\bin```和```C:\Users\username\algs4\bin```添加到用户变量的PATH中
    
  7. 定制命令行工具，启用QuickEdit和Insert模式，将Screen Buffer Size设置为800-by-500，在桌面上创建一个命令行的快捷方式
    
  8. 通过编译和运行[TestAlgs4.java](http://algs4.cs.princeton.edu/windows/TestAlgs4.java.html)测试是否安装成功
    
**Q: 我要如何完全卸载 algs4.exe？**

A: 
    
  1. 删除```C:\Users\username\algs4```文件夹（但是要注意保存你的.java文件）
    
  2. 从你的环境变量的PATH变量中删除下面两个条目：
        
   * C:\Users\username\algs4\bin
        
   * C:\Users\username\algs4\bin
   
  3. 删除DrJava配置文件```C:\Users\username\.drjava```
    
  4. 删除桌面上的DrJava和命令行的快捷方式
    
**Q: 我如果重新运行安装器会怎么样？**

A: 重新下载、安装一遍，完全重复上述过程

**Q: 如果我之前在其他位置安装过DrJava会怎么样？**

A: 我们建议你删除他然后使用```C:\Users\username\algs4 ```这个版本

**Q: 我可以使用其他版本的Java 吗？**

A: 是的，但你需要自行配置Windows环境变量和DrJava的编译器属性

**Q: 我可以使用除了DrJava以外的IDE吗？**

A: 是的，你可以使用其他的IDE（比如Eclipse）但你需要自己配置编译器属性，比如classpath

**Q: 当我启动Eclipse时，我收到这样一个报错信息“Failed to load JNI shared library”，我该怎么办？**

A: 你多半是使用了一个64位的Java和32位的Eclipse。如果你是64位的机器，安装器会自动安装64位的Java，这会替代之前的32位版本的Java。有两种方法解决这个问题：要么将Eclipse升级到64位，要么将```C:\Users\username\introcs\java```移除，这样的话Windows就会使用之前的32位Java。当然你可以可以在[Eclipse.ini](http://wiki.eclipse.org/Eclipse.ini)中指定使用特定的Java版本

**Q: 我要怎么中断一个无限循环？**

A: 在DrJava中，直接点击Reset按钮即可或者在菜单里选择```Tools->Reset Interactions```，如果是在命令行里面的话，使用```Ctrl+C```

**Q: 当使用标准输入时，我要怎么表明输入完成（没有后续数据了）**

A: 如果你是从键盘输入的话，使用```Ctrl+z```表示文件结尾（EOF）

**Q: 在Windows中要怎么显示 .java 和 .class 的后缀名？**

A: 在很多Windows系统中后缀名都被隐藏了，在这种情况下，这样打开他，选择```Start -> My Computer -> Tools -> Folder Options -> View```，取消对```Hide file extensions for known file types```选项的选中状态，确认退出即可

**Q: 当我在命令行输入```java -version```和```javac -version```时报错了，我该怎么办？**

A: 首先确认这两个文件存在：

    C:\Users\username\algs4\java\bin\javac.exe

    C:\Users\username\algs4\java\bin\java.exe

如果存在的话，应该是环境变量中PATH的值不对，在命令行中输入下面一句：

    C:\Users\username> echo %PATH%
    
PATH环境变量应该包含```C:\Users\username\algs4\java\bin```

**Q: 当我在命令行中编译或者运行一个引用了教材库的程序时报错了，为什么？**

A: 注意要使用```javac-algs4```和```java-algs4```而不是```javac```或者```java```

**Q: 在命令行中我应该如何导航到另一个驱动器？**

A: 在命令行中，用```H:```导航到H盘，用```cd```导航到当前驱动器的其他文件夹

**Q: 我该如何学习更多与命令行有关的知识？**

A: 微软提供了一个[命令行知识库](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/ntcmds.mspx?mfr=true)

**Q: 我是否可以用Windows PowerShell来替代命令行？**

A: PowerShell是一个比命令行更高级的命令行工具，但是，它现在还不支持重定向标准输入
