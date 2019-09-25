---
title: "CLI App in C# 其二"
date: 2019-05-12
draft: false
tags: ["cli in csharp", "dotnet core"]
categories: ["programming"]
---

这是 CLI App in C# 系列的第二篇，本篇主要介绍`gen`的开发过程。教程里的所有代码参见[keaising/gen](https://github.com/keaising/gen)

## 新建项目

1. 在合适的地方使用`dotnet new console -n gen`新建一个名字是gen的控制台项目

2. 通过命令行工具cd到项目目录下

3. 输入`dotnet run`运行该项目，应当能看到`Hello World!`

如下图所示：

![new console app](/images/cli-in-csharp/new-console-app.png)

## 添加引用

在项目目录下输入如下命令，添加对CommandLineUtils项目的引用

```powershell
dotnet add package McMaster.Extensions.CommandLineUtils
```
这一步是通过命令行的方式引入nuget包，也可以在Visual Studio里进行nuget包管理，效果完全一样

添加完成之后，项目文件`gen.csproj`可见`ItemGroup`中已经有了对[`CommandLineUtils`](https://github.com/natemcmaster/CommandLineUtils)的引用

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.2</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="McMaster.Extensions.CommandLineUtils" Version="2.3.4" />
  </ItemGroup>

</Project>
```

## 改造Programs文件

此时应用还只能输出`Hello World!`，根据[`CommandLineUtils`文档](https://github.com/natemcmaster/CommandLineUtils/blob/master/docs/samples/subcommands/nested-types/Program.cs)稍做改造，实现输出应用信息的功能。修改代码如下：

```C#
using System;
using McMaster.Extensions.CommandLineUtils;

namespace gen
{
    [Command(Name = "gen", Description = "A simple console app.")]
    class Program
    {
        public static int Main(string[] args)
            => CommandLineApplication.Execute<Program>(args);

        private int OnExecute(CommandLineApplication app, IConsole console)
        {
            app.ShowHelp();
            return 0;
        }
    }
}
```

可以通过`dotnet run`和`dotnet run -- -h`直接运行应用和查看帮助信息，如下图：

![help info](/images/cli-in-csharp/help-info.png)

## 生成手机号

添加一个`Mobile.cs`文件，实现生成一个随机手机号的功能

```C#
using McMaster.Extensions.CommandLineUtils;
using System.Linq;
using System;

[Command("mobile", Description = "generate mobile numbers.")]
public class Mobile
{
    private static readonly Random rand = new Random();
    public void OnExecute(IConsole console)
    {
        console.WriteLine(GenMobile());
    }

    string GenMobile()
    {
        var second = rand.Next(3, 9);
        var tail = Enumerable.Range(1, 9).Select(r => rand.Next(0, 9));
        return $"1{second}{string.Join("", tail)}";
    }
}
```

此外还需要在`Programs.cs`的`Program`类的标签上加上`Mobile`的作为SubCommand：

```C#
[Command(Name = "gen", Description = "A simple console app."), Subcommand(typeof(Mobile))]
```
现在就可以使用mobile作为子命令产生随机手机号了

``` bash
$ dotnet run -- mobile
$ 13137575348
```
## 生成身份证号

同理，添加一个`Id.cs`文件用于生成身份证号，实现逻辑与`Mobile.cs`类似，不再赘述。

不同的是，为了支持身份证号类型和身份证号开头，需要使用`Argument`和`Option`两个Attribute

#### 身份证号码类型

此处通过引入`Option`，来实现在命令后增加` -l`或者` -s`来区分18位和15位的身份证号，

```cs
[Option(ShortName = "l", LongName = "eighteen", ShowInHelpText = true, Description = "18位身份证号")]
public bool Long { get; set; }

[Option("-s|--fifteen", Description = "15位身份证号")]
public bool Short { get; set; }
```

当用户输入`gen id -l`时，bool类型的`Long`字段的值为`true`，`Short`字段没有处理，值是默认值`false`，以此为据进行分支选择，代码如下：

```cs
public void OnExecute(IConsole console)
{
	if (Long)
	{
		console.WriteLine(genLong());
	}
	else if (Short)
	{
		console.WriteLine(genShort());
	}
}

```

此外，`Option`还有多种写法和多个选项可供配置，详情参阅文档

#### 身份证号码开头

为了支持用户输入的内容作为身份证号码的开头，需要引入一个参数`StartWith`：

```cs
[Argument(0, Description = "The start of ID card number.", Name = "Start")]
public string StartWith { get; }
```

`Start`参数为`Id`子命令的第一个参数（0），名字是`Start`，代码里对应的是`StartWith`字段，代码如下：

```cs
private string genLong()
{
	var r = new Random();
	var myValues = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 }; 
	var head = Enumerable.Range(0, 6 - StartWith.Length).Select(e => myValue[r.Next(myValues.Length)]);
	var year = r.Next(1970, 2018);
	var month = $"{r.Next(1, 12)}".PadLeft(2, '0');
	var day = $"{r.Next(1, 28)}".PadLeft(2, '0');
	var tail = Enumerable.Range(0, 4).Select(e => myValues[r.Nex(myValues.Length)]);
	return StartWith + string.Join("", head) + year + month + day + string.Join("", tail);
}
```

## 调试 & 运行

至此，命令行工具`gen`的所有功能都已经实现，可以通过以下几个命令来调用功能和调试

```powershell

.\gen>  //查看gen的帮助和版本信息
.\gen>  dotnet run -- -h

.\gen>  //查看gen mobile的帮助信息
.\gen>  dotnet run -- mobile -h

.\gen>  //运用gen mobile, 生成一个随机手机号
.\gen>  dotnet run -- mobile 
.\gen>  15810458877

.\gen>  //查看gen id的帮助信息
.\gen>  dotnet run -- id -h

.\gen>  //运行gen id, 生成一个随机的18位身份证号
.\gen>  dotnet run -- id -l

.\gen>  //运行gen id, 以110为开头, 生成一个随机的15位身份证号
.\gen>  dotnet run -- id -s 110

```

此外，也可以通过配置Visual Studio的Debug参数实现在VS里运行和实时调试，例如要运行`gen id -s 100`，只需要在 Project Property -> Debug -> Application arguments里填写`id -s 100`即可，如下图

![project property](/images/cli-in-csharp/project-property.png)

**つづく** 
