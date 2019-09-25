---
title: "CLI App in C# 其一"
date: 2019-05-11
draft: false
tags: ["cli in csharp", "dotnet core"]
categories: ["programming"]
---

这是 CLI App in C# 系列的{{< ruby rb="第一篇" rt="Wa Da Keng" >}}

写这个系列的目的是介绍用C#写一个命令行工具的所有内容，从规划、选型、编码、到打包和自动化编译的系列工作都会介绍到

+ 其一：演示应用的主要功能、技术选型及原因

+ 其二：编码细节

+ 其三：打包部署（包括dotnet core global tool和命令行两种方式），自动化编译

那就开始吧

## 演示应用介绍

如果经常在命令行使用`git`的话对`Command SubCommand Option`这种命令形式应该比较熟悉，比如`git push origin master`、`git clone https://github.com/torvalds/linux.git`，演示应用参考了这种形式

演示应用的主要作用是生成各种号码，命名为`gen`，它可以根据不同的子命令和选项生成不同的号码，功能列表如下：

|命令|功能|结果|
|----|----|----|
|`gen mobile`|生成手机号|15810885678|
|`gen id`|生成18位身份证号|210765199707122345|
|`gen id -l 110`|生成以110开头的18位身份证号|110765199707122345|
|`gen id -s`|生成15位身份证号|456719970712234|
|`gen -v`|打印应用信息||

## 术语介绍

在命令`gen id -l 110`中，术语如下：

|命令|术语|备注|
|----|----|----|
|`gen`|Command||
|`id`|SubCommand||
|`-l`|Option||
|`'110'`|Verbs||

## 技术选型

#### 框架

选择 dotnet core 2.1，这是目前 dotnet 平台最新的 LTS 框架


#### 解析命令行参数 

使用[`CommandLineUtils`](https://github.com/natemcmaster/CommandLineUtils)来处理命令行工具的参数。虽然也可以手动处理`main`函数的`string[] args`达到处理SubCommand和Option的目的，但是相当麻烦而且容易出错。

[`CommandLineUtils`](https://github.com/natemcmaster/CommandLineUtils)的前身是ASP.NET团队在开发dotnet core的过程中，为开发dotnet cli而开发的扩展库，后来ASP.NET团队觉得这个功能跟ASP.NET的开发关系不大，于是转入[不活跃状态](https://github.com/aspnet/Extensions/issues/257#issuecomment-322623120)，后续被ASP.NET团队的一个开发小哥以[私人身份fork并继续维护](https://github.com/aspnet/Extensions/issues/257#issuecomment-326726754)，于是就有了现在用的这个库。

#### 打包

dotnet core提供打包工具`build`和`pack`，分别用于打包普通控制台应用和nuget包（用于dotnet core global tool的分发）。

dotnet core的打包工具的打包结果会是一大堆exe、dll和相关配置文件，为了最终获得一个单独的exe文件，使用[wrap](https://github.com/dgiagio/warp)库来将所有的文件打包成一个exe，方便部署和使用。

**つづく** 
