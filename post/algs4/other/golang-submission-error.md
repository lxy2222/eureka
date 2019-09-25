---
title: "P0: Golang Submission Error"
date: 2019-05-31
draft: false
tags: ["golang"]
categories: ["programming"]
---

## Review

过了一段时间自己看都觉得这代码写得好蠢，于是改了一版，如下：

```go
package main

import "fmt"

func main() {
    fmt.Println(permute([]int{1,0,3}))
}

func permute(nums []int) [][]int {
    if len(nums) == 1 {
        return [][]int{
            nums,
        }
    }
    array := nums
    var result [][]int
    generate(len(nums), &array, &result)
    return result
}

func generate(k int, array *[]int, result *[][]int) {
    if k == 1 {
        *result = append(*result, append([]int{}, (*array)...))
    } else {
        generate(k - 1, array, result)
        for i := 0; i < k-1; i++ {
            if k%2 == 0 {
                swap(i, k-1, array)
            } else {
                swap(0, k-1, array)
            }
            generate(k - 1, array, result)
        }
    }
}

func swap(i, j int, array *[]int) {
    (*array)[i], (*array)[j] = (*array)[j], (*array)[i]
}

```

## Original

刷[LeetCode全排列时](https://leetcode.com/problems/permutations)，我用了一个很简单的Heap's Algorithm，自己本地跑单元测试和在LeetCode Console跑单个case的时候轻轻松松过，于是就提交了，还以为能一把过，结果连续Wrong Answer，就有点懵，代码如下

```go
package main

import "fmt"

func main() {
	fmt.Println(permute([]int{1,0}))
}

func permute(nums []int) [][]int {
	if len(nums) == 1 {
		return [][]int{
			nums,
		}
	}
	array = &nums
	generate(len(nums))
	return result
}

var result [][]int

var array *[]int

func generate(k int) {
	if k == 1 {
		ret := make([]int, len(*array))
		copy(ret, *array)
		result = append(result, ret)
	} else {
		generate(k - 1)
		for i := 0; i < k-1; i++ {
			if k%2 == 0 {
				swap(i, k-1)
			} else {
				swap(0, k-1)
			}
			generate(k - 1)
		}
	}
}

func swap(i, j int) {
	tem := (*array)[i]
	(*array)[i] = (*array)[j]
	(*array)[j] = tem
}
```

还可以去[play.golang.org](https://play.golang.org/p/3-Faj8nt74g)直接运行

在LeetCode的报错信息也非常有意思，如下图

![submission-error](/images/go-submission-error/submission-detail.png)

明明跑的case是`[]int{0, 1}`，为什么结果里会出现1、2、3呢，百思不得其解，于是发到twitter上，有好事者用Scala试了下发现没问题，我自己换Python试了下也没问题，可以认为不是LeetCode的问题了，那么换个其他人的答案呢，于是我找了一个也是go的解答，放上去一次就过了，那么肯定是我自己的问题了

那么问题在哪儿呢？

再仔细审视一下报错信息，为什么会加上1、2、3呢？于是我就扔了个错误的submission上去，让第一个case就报错，第一个case就是`[]int{1, 2, 3}`，也就是说，我的第二个case的解答里出现了第一个case的答案！

原因已经很明显了，因为我在程序里用了全局变量`result [][]int`

虽然不知道LeetCode是如何循环的，但是可以猜想是在循环过程中，`result`作为全局变量在第2个case没有被初始化，里面还存着前一个case的答案，于是在第10行插入一行初始化的代码：

```go
func permute(nums []int) [][]int {
    result = [][]int{}
    if len(nums) == 1 {
    	return [][]int{
    		nums,
    	}
    }
    array = &nums
    generate(len(nums))

```

于是顺利通过

非常尴尬，所以说啊，全局变量害死人，还是应该老老实实传入传出数组，稍有不慎，线上就P0了

不过，这里如果用全局指针的话时间上可以打败100%的go submission，老老实实传数组只能48%，很显然，我选择100%