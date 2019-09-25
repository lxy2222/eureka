---
title: "CLI App in C# 其三"
date: 2019-05-14
draft: false
tags: ["cli in csharp", "dotnet core"]
categories: ["programming"]
---

这是 CLI App in C# 系列的第三篇，本篇主要介绍`gen`的打包和发布。

.Net Core控制台应用的打包方法主要是两类：

+ 可执行文件，对应直接运行，Windows平台体现为exe文件
+ nuget包，对应dotnet core global tool的部署方法

## 可执行文件

> 打包成exe的方法完全兼容Windows/Linux/macOS三大主流平台，所以只是简单以Windows为例进行演示，其他平台只需要修改编译和打包参数即可，在任何平台打包和编译都是可以的

最终目标是在当前环境下打包一个可以在64位Windows10环境下执行的exe文件，希望能不依赖dotnet core SDK，所以加上自包含的特性，并且去掉debug信息，指定打包类型为`Release`

### 调整项目配置

打包之前，需要调整项目配置

{{< highlight xml "linenos=table, hl_lines=4 5 7,linenostart=1" >}}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
        <AssemblyName>gen</AssemblyName>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp2.1</TargetFramework>
	<Version>1.0.0</Version>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="McMaster.Extensions.CommandLineUtils" Version="2.3.4" />
  </ItemGroup>

</Project>
{{< / highlight >}}

在没有其他配置的情况下，最后生成的exe的名字跟程序集名字一样，输出类型决定了是打包成exe还是nuget包

### 发布应用

使用以下脚本发布应用

```powershell
dotnet publish -r win10-x64 --self-contained true -c Release
```

执行以上命令后，可以在`./bin/Release/netcoreapp2.1/win10-64/publish`目录下找到生成的所有exe和dll文件，此时可以直接运行exe文件使用演示应用

### 打包成单文件

以上编译结果中有好几百个文件，传输、部署和使用都不太方便，经常会有打包成一个单文件exe的需求，这个需求可以借助[warp-packer](https://github.com/dgiagio/warp)解决

warp-paker是一个在命令行下将可执行文件打包成一个单文件的工具，支持三大平台的部分编译方式。安装非常简单，在Windows平台直接下载exe文件放到一个被环境变量`PATH`包含了的目录下就可以全局使用了，如果不需要全局使用，直接放在当前目录运行就行

用warp-packer打包一个64位Windows架构、源目录在`./bin/Release/netcoreapp2.1/win10-64/publish`、输出结果叫`gen-packed.exe`的单文件exe，命令如下：

```pwsh
warp-packer --arch windows-x64 --input_dir bin\Release\netcoreapp2.1\win10-x64\publish --exec gen.exe --output gen-packed.exe
```

完成后，可以在当前目录下找到名为`gen-packed.exe`的最终文件，至此，单文件的可执行文件的打包介绍结束

## dotnet core global tool（全局工具）

dotnet core global tool 的打包和部署都依赖于nuget包，nuget包的打包子命令是pack，本地打包和调试常用的是以下几条命令

```powershell
//打包
dotnet pack --output ./.nupkg

//从本地源安装到本地全局工具
dotnet tool install -g gen --add-source ./.nupkg

//从本地源更新本地全局工具
dotnet tool update -g gen --add-source ./.nupkg

//卸载
dotnet tool uninstall -g gen 
```

### 调整项目配置

为了能打包成dotnet core global tool可用的nuget包，需要对项目文件进行一些修改，为了跟上一节中的exe项目文件区分，这里新建一个项目文件`gen-nuget.csproj`，内容如下：

{{< highlight xml "linenos=table, hl_lines=7,linenostart=1" >}}
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<AssemblyName>gen</AssemblyName>
		<OutputType>Exe</OutputType>
		<TargetFramework>netcoreapp2.1</TargetFramework>
		<PackAsTool>true</PackAsTool>
		<PackageId>gen</PackageId>
		<ToolCommandName>gen</ToolCommandName>
		<Title>gen</Title>
		<Version>1.0.0</Version>
	</PropertyGroup>

	<ItemGroup>
		<PackageReference Include="McMaster.Extensions.CommandLineUtils" Version="2.3.4" />
	</ItemGroup>

</Project>
{{< / highlight >}}

调整的内容里最终的是第7行，ture决定了打包成一个dotnet core gloabl tool，false的话只是一个普通的nuget library包

常规的项目属性可以从[Common MSBuild project properties](https://docs.microsoft.com/en-us/visualstudio/msbuild/common-msbuild-project-properties?view=vs-2019)查看，dotnet core gloabl tool独有的项目属性可以从[Setup the global tool](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools-how-to-create#setup-the-global-tool)查看

### 打包nuget

调整完配置之后使用指令`dotnet pack --output ./.nupkg`就可以开始打包nuget了

命令比较简单，且在dotnet core官网都有文档说明，此处不再赘述。

需要说明的是，生成的nuget包可以通过上传到[nuget.org](https://www.nuget.org/)的方式让其他人安装该全局工具，[nuget.org](https://www.nuget.org/)生成的默认安装指令为

```powershell
dotnet tool install --global gen --version 1.0.0
```

可以看出，nuget包安装dotnet core global tool的工具相对来说比较简单，而且在打包的时候也比较简单，不用考虑跨平台的问题，dotnet core SDK会自动处理好。


## 打包脚本

每次打包过程都需要输入一系列命令，其实可以将这一系列命令都包装成一个脚本文件，好处有两点

1. 每次只需要运行脚本即可完成任务
2. 将打包过程固化，不用再写文档也不怕忘记

powershell的打包脚本如下，bash脚本类似，只需要修改几个特有的命令即可

+ 1-5行 定义了后续要使用的路径
+ 7-11行 从项目中获取版本号信息
+ step 0 对项目进行clean和restore
+ step 1 发布exe
+ step 2 打包成单文件
+ step 3 打包nuget
+ step 4 将生成的文件压缩成一个zip，并删除中间文件夹
+ step 5 并没有什么实际用途

{{< highlight powershell "linenos=table, hl_lines=0,linenostart=1" >}}
$ResultPath = 'pakcages'
$exePath = 'bin/Release/gen' 
$nugetPath = 'bin/Release'
$genExe = 'gen.csproj'
$genNuget = 'gen-nuget.csproj'

$xml = [Xml] (Get-Content $genExe)
$version = [Version] $xml.Project.PropertyGroup.Version
$zip = 'gen-v' + $version + '.zip'
$genExeName = 'gen.' + $version + '.exe'
$genNugetName = 'gen.' +$version + '.nupkg'

write '>>> 0. clean and restore <<<'
dotnet clean -o $exePath $genExe
rm 'obj' -Force -Recurse
dotnet restore $genExe

write '>>> 1. dotnet publish <<<'
dotnet publish -r win10-x64 --self-contained true -c Release -o $exePath $genExe

write '>>> 2. warp-packer package <<<'
warp-packer --arch windows-x64 --input_dir $exePath --exec gen.exe --output ($nugetPath + '/' + $genExeName)


write '>>> 3. dotnet pack <<<'
rm 'obj' -Force -Recurse
dotnet restore $genNuget
dotnet pack --output $nugetPath -c Release $genNuget

write '>>> 4. all files => zip <<<'

mkdir $ResultPath -ErrorAction SilentlyContinue
Compress-Archive -Path ($nugetPath + '/' + $genExeName), ($nugetPath + '/' + $genNugetName) -DestinationPath ($ResultPath + '/' + $zip) -Force

rm -Force -Recurse $nugetPath -ErrorAction SilentlyContinue

write ">>> 5. success! you can find zip file in $($ResultPath + '\' + $zip) <<<"

{{< / highlight >}}
