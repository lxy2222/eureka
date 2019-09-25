---
title: 基于C#的蚁群算法实现
date: 2014-10-25
draft: false
tags: ["homework"]
categories: ["programming"]
aliases:
    - /2014/10/25/ant-colony-optimization-based-on-c-sharp.html

---



这学期有门课，最优化与最优控制，任课老师任华玲，虽然在课堂上我什么都没有学到，但是最后任老师让每个人自己选一篇最优化方向的论文，把其中的算法和算例自己实现一下，并讲解。本科时祝凌曦让我研究过蚁群算法，当时没太弄懂，趁这个机会研究了下，弄懂了并用C#实现出来，效果还不错。以下是代码。

代码主要分为三块：Ant.cs，Tsp.cs和DataAndCal.cs，分别为蚂蚁类，tsp类和静态数据储存计算类。

首先是蚂蚁类：

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AntColonyOptimization
{
    public class Ant
    {
        public int[] DoneCity;//去过的城市，值是依次经过的城市的编号
        public int DoneCityCount;//去过的城市数量
        public int[] IngCity; //没去过的城市,序号是城市自带的，这里面的值代表是否去过，1去过，0没有去过
        public int NowCityNo; //当前城市编号
        public double LineLength; //路径总长

        // 新建一个蚂蚁，用于储存最优值
        public Ant()
        {
            IngCity = new int[DataAndCal.CityNum];
            DoneCity = new int[DataAndCal.CityNum];
        }

        /// <summary>
        /// 一只蚂蚁完成一次旅行
        /// </summary>
        public void Travel()
        {
            //1. 初始化//2. 选择一个初始城市
            AntInit();

            while (DoneCityCount < DataAndCal.CityNum)
            {
                //3. 选择下一个城市            
                int nextCityNo = SelectNextCity();

                //4. 移动过去，更新数据
                Move(nextCityNo);

            }
            //5. 移动完成后，计算路径总长
            LineLength = 0.0;
            for (int i = 0; i < DataAndCal.CityNum - 1; i++)
            {
                LineLength = LineLength + DataAndCal.DistenceBetween2City(DoneCity[i], DoneCity[i + 1]);
            }
            LineLength = LineLength + DataAndCal.DistenceBetween2City(DoneCity[0], DoneCity[DataAndCal.CityNum - 1]);
        }

        /// <summary>
        /// 蚂蚁初始化
        /// </summary>
        public void AntInit()
        {
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                DoneCity[i] = 0;
                IngCity[i] = 0;
            }
            NowCityNo = 0;
            LineLength = 0.0;

            //随机选择一个城市出发并记录
            NowCityNo = DataAndCal.RandInt(1, 51);
            DoneCity[0] = NowCityNo;
            DoneCityCount = 1;
            IngCity[NowCityNo] = 1;
        }
        public int SelectNextCity()
        {
            int SelectNo = 0; //初始化要选择的城市的编号
            double info = 0.0; //统计信息素的总和
            double[] Pos = new double[DataAndCal.CityNum]; //去每个城市的概率

            // 计算去每个城市的概率
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                if (IngCity[i] == 0) //没去过该城市
                {
                    Pos[i] = (Math.Pow(DataAndCal.InfoBetwCity[NowCityNo, i], DataAndCal.alpha)) / (Math.Pow(DataAndCal.DistenceBetween2City(NowCityNo, i), DataAndCal.beta));
                    info += Pos[i];
                }
                else
                {
                    Pos[i] = 0.0;
                }
            }

            // 按概率进行选择
            double randInfo = DataAndCal.RandDouble(0, info);
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                if (randInfo - Pos[i] > 0)
                {
                    randInfo = randInfo - Pos[i];
                }
                else
                {
                    SelectNo = i;
                    break;
                }
            }

            //如果没有通过计算得到合适的结果，那么直接指定序号中第一个没有去过的城市作为下一个城市
            if (SelectNo == 0)
            {
                for (int i = 0; i < DataAndCal.CityNum; i++)
                {
                    if (IngCity[i] == 0)
                    {
                        SelectNo = i;
                        break;
                    }
                }

            }
            return SelectNo;
        }

        public void Move(int nextCityNo)
        {
            //下一个城市添加到已经途经的路径数组
            DoneCity[DoneCityCount] = nextCityNo;
            //该城市标记为已经去过
            IngCity[nextCityNo] = 1;
            //增加路径总长
            LineLength = LineLength + DataAndCal.DistenceBetween2City(NowCityNo, nextCityNo);
            //移动到下一城市，把下一城市成为当前城市
            NowCityNo = nextCityNo;
            DoneCityCount++;
        }
    }
}
```

注释都写得比较清楚，就不再解释了，毕竟就是用蚁群算法实现了一个最简单的Tsp问题求解。下面是Tsp类：

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AntColonyOptimization
{
    public class Tsp
    {
        public Ant[] Ants;
        public Ant bestAnt;
        public List<Ant> bestAntList;

        public Tsp()
        {
            Ants = new Ant[DataAndCal.AntNum];
            for (int i = 0; i < DataAndCal.AntNum; i++)
            {
                Ants[i] = new Ant();
            }
            bestAnt = new Ant();
            //bestAntList = new List<Ant>();
        }

        // 初始化全部环境
        public void InitEnvironment()
        {
            //最优值先设定为BigNum
            bestAnt.LineLength = DataAndCal.BigNum;

            // 初始化环境信息素
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                for (int j = 0; j < DataAndCal.CityNum; j++)
                {
                    DataAndCal.InfoBetwCity[i, j] = 1.0;
                }
            }
        }

        //更新信息素
        public void UpdateInfo()
        {
            double[,] AntInfo = new double[DataAndCal.CityNum, DataAndCal.CityNum];

            //计算妹纸蚂蚁留下的信息素, 先全部清零
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                for (int j = 0; j < DataAndCal.CityNum; j++)
                {
                    AntInfo[i, j] = 0;
                }
            }

            //新增的信息素
            for (int i = 0; i < DataAndCal.AntNum; i++)
            {
                for (int j = 0; j < DataAndCal.CityNum - 1; j++)
                {
                    // 第i只蚂蚁，在经过的第j和j+1个城市间留下的信息素，是总信息素/第i只蚂蚁走过的路径总长,并加第i只蚂蚁的信息素叠加到j和j+1个城市上去。
                    AntInfo[Ants[i].DoneCity[j], Ants[i].DoneCity[j + 1]] = AntInfo[Ants[i].DoneCity[j], Ants[i].DoneCity[j + 1]] + DataAndCal.TotalInfo / Ants[i].LineLength;
                    AntInfo[Ants[i].DoneCity[j + 1], Ants[i].DoneCity[j]] = AntInfo[Ants[i].DoneCity[j], Ants[i].DoneCity[j + 1]];
                }

                //最后一个城市和第一个城市
                AntInfo[Ants[i].DoneCity[0], Ants[i].DoneCity[DataAndCal.CityNum - 1]] = AntInfo[Ants[i].DoneCity[0], Ants[i].DoneCity[DataAndCal.CityNum - 1]] + DataAndCal.TotalInfo / Ants[i].LineLength;
                AntInfo[Ants[i].DoneCity[DataAndCal.CityNum - 1], Ants[i].DoneCity[0]] = AntInfo[Ants[i].DoneCity[0], Ants[i].DoneCity[DataAndCal.CityNum - 1]];
            }

            //更新信息素，原始值*挥发+新增值
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                for (int j = 0; j < DataAndCal.CityNum; j++)
                {
                    DataAndCal.InfoBetwCity[i, j] = DataAndCal.InfoBetwCity[i, j] * (1 - DataAndCal.rou) + AntInfo[i, j];
                }
            }


        }

        // 全部搜索一遍
        public void Search()
        {
            //迭代次数内循环
            bestAntList = new List<Ant>();
            for (int i = 0; i < DataAndCal.IterateTime; i++)
            {
                //每只蚂蚁都搜索
                for (int j = 0; j < DataAndCal.AntNum; j++)
                {
                    Ants[j].Travel();

                    if (Ants[j].LineLength < bestAnt.LineLength)
                    {
                        bestAnt.LineLength = Ants[j].LineLength;
                        bestAnt.DoneCity = Ants[j].DoneCity;
                        Ant tmp = new Ant();
                        tmp.LineLength = Ants[j].LineLength;
                        tmp.DoneCity = Ants[j].DoneCity;
                        bestAntList.Add(tmp);
                    }
                }
                //更新信息素
                //UpdateInfo();

            }
        }
    }
}
```

接下来是静态数据储存计算类：

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AntColonyOptimization
{
    public static class DataAndCal
    {
        public static double alpha = 1.0; //信息素重要程度
        public static double beta = 2.0; //城市间距离重要程度
        public static double rou = 0.5; //信息残留程度

        public static int AntNum = 34; //蚂蚁数量
        public static int IterateTime = 1000; //迭代次数

        public static int CityNum = 51; //城市数量
        public static double TotalInfo = 100.0; //总信息素

        public static double[,] InfoBetwCity = new double[CityNum, CityNum]; //两城市间信息素
        public static double[,] DistBetwCity = new double[CityNum, CityNum]; //两城市间距离

        // 城市坐标，用x,y分别表示
        public static double[] xCity = new double[]
        {
	        37,49,52,20,40,21,17,31,52,51,
	        42,31,5,12,36,52,27,17,13,57,
	        62,42,16,8,7,27,30,43,58,58,
	        37,38,46,61,62,63,32,45,59,5,
	        10,21,5,30,39,32,25,25,48,56,
	        30
        };

        public static double[] yCity = new double[]
        {
            52,49,64,26,30,47,63,62,33,21,
            41,32,25,42,16,41,23,33,13,58,
            42,57,57,52,38,68,48,67,48,27,
            69,46,10,33,63,69,22,35,15,6,
            17,10,64,15,10,39,32,55,28,37,
            40
        };

        /// <summary>
        /// 两城市间距离
        /// </summary>
        /// <param name="City1No">第一个城市的序号</param>
        /// <param name="City2No">第二个城市序号</param>
        /// <returns></returns>
        public static double DistenceBetween2City(int City1No, int City2No)
        {
            double x1x2 = Math.Pow((xCity[City1No] - xCity[City2No]), 2);
            double y1y2 = Math.Pow((yCity[City1No] - yCity[City2No]), 2);
            double dis = Math.Pow((x1x2+y1y2),0.5);
            return dis;
        }


        public static Random ran = new Random(System.DateTime.Now.Millisecond);
        public static int BigNum = 65535;
        /// <summary>
        /// 产生一个随机整数，区间是n1，n2
        /// </summary>
        /// <param name="n1"></param>
        /// <param name="n2"></param>
        /// <returns></returns>
        public static int RandInt(int n1, int n2)
        {

            int n = n1 + (n2 - n1) * ran.Next(BigNum) / BigNum;
            return n;
        }

        public static double RandDouble(double n1,double n2)
        {
            double n = n1 + (n2 - n1) * ran.Next(BigNum) / BigNum;
            return n;
        }
    }
}
```
最后是用C#基于WinForm开发了个窗口进行展示，AntCoOp.cs：

```

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AntColonyOptimization
{
    public partial class AntCoOp : Form
    {
        public AntCoOp()
        {
            InitializeComponent();
            InitData();

        }


        public static Tsp Calculate()
        {

            Tsp tspant = new Tsp();
            tspant.InitEnvironment();
            tspant.Search();

            return tspant;
        }

        #region
        Tsp tsp = Calculate();

        bool DrawLine = false;
        Ant OneBestAnt = new Ant();
        Pen DotPen = new Pen(Color.Blue, 3);
        Pen LinePen = new Pen(Color.Red, 1);
        double xMax = 0.0;
        double yMax = 0.0;
        double xMin = DataAndCal.BigNum;
        double yMin = DataAndCal.BigNum;

        double[] xxCity = new double[DataAndCal.CityNum];
        double[] yyCity = new double[DataAndCal.CityNum];

        int nextBtni = 0;
        private void InitData()
        {
            //找出城市坐标最大值
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                if (DataAndCal.xCity[i] > xMax)
                {
                    xMax = DataAndCal.xCity[i];
                }
                if (DataAndCal.yCity[i] > yMax)
                {
                    yMax = DataAndCal.yCity[i];
                }
                if (DataAndCal.xCity[i] < xMin)
                {
                    xMin = DataAndCal.xCity[i];
                }
                if (DataAndCal.yCity[i] < yMin)
                {
                    yMin = DataAndCal.yCity[i];
                }
            }

            xMax = xMax + 10;
            yMax = yMax + 10;
            //xMin = 0.0;
            //yMin = 0.0;
            //画出所有点，按比例
            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                xxCity[i] = (DataAndCal.xCity[i] - xMin) / (xMax - xMin) * PaintPanel.Width + xMin;
                yyCity[i] = (DataAndCal.yCity[i] - yMin) / (yMax - yMin) * PaintPanel.Height + yMin;

            }
        }

        #endregion


        private void PaintPanel_Paint(object sender, PaintEventArgs e)
        {

            Graphics g = e.Graphics;

            for (int i = 0; i < DataAndCal.CityNum; i++)
            {
                g.DrawEllipse(DotPen, (int)xxCity[i], (int)yyCity[i], 2, 2);
            }

            if (DrawLine)
            {
                for (int i = 0; i < OneBestAnt.DoneCity.Count() - 1; i++)
                {
                    g.DrawLine(LinePen, new PointF((float)xxCity[OneBestAnt.DoneCity[i]], (float)yyCity[OneBestAnt.DoneCity[i]]), new PointF((float)xxCity[OneBestAnt.DoneCity[i + 1]], (float)yyCity[OneBestAnt.DoneCity[i + 1]]));

                }
                g.DrawLine(LinePen, new PointF((float)xxCity[OneBestAnt.DoneCity[0]], (float)yyCity[OneBestAnt.DoneCity[0]]), new PointF((float)xxCity[OneBestAnt.DoneCity[DataAndCal.CityNum - 1]], (float)yyCity[OneBestAnt.DoneCity[DataAndCal.CityNum - 1]]));

                string strInfo1 = String.Format("当前值：{0}，最优值：{1} ", (int)OneBestAnt.LineLength, (int)tsp.bestAntList.Last().LineLength);
                string strInfo2 = String.Format("共有{0}个迭代值，第{1}个 ", tsp.bestAntList.Count(), nextBtni);
                Brush strBru = new SolidBrush(Color.Black);
                Font strFont = new Font("微软雅黑", 14);
                g.DrawString(strInfo1, strFont, strBru, new PointF(20, (float)PaintPanel.Height - 60));
                g.DrawString(strInfo2, strFont, strBru, new PointF(20, (float)PaintPanel.Height - 35));
            }
            DrawLine = false;
        }

        private void PaintPanel_SizeChanged(object sender, EventArgs e)
        {
            Refresh();
        }

        private void RefreshBtn_Click(object sender, EventArgs e)
        {
            tsp = Calculate();
            nextBtni = 0;
            //Refresh();
            //PaintPanel.Paint();
        }

        private void NextBtn_Click(object sender, EventArgs e)
        {
            if (nextBtni < tsp.bestAntList.Count())
            {
                OneBestAnt = tsp.bestAntList[nextBtni];
                DrawLine = true;
                nextBtni++;
                Refresh();
            }

        }

        private void FinalBtn_Click(object sender, EventArgs e)
        {
            OneBestAnt = tsp.bestAntList.Last();
            DrawLine = true;
            nextBtni = tsp.bestAntList.Count();

            Refresh();
        }

        private void ReturnBtn_Click(object sender, EventArgs e)
        {
            OneBestAnt = tsp.bestAntList.First();
            DrawLine = true;
            nextBtni = 1;
            Refresh();
        }
    }
}
```

运行截图就不再给了，也不是什么很好看的图

以前从来被人碾压习惯了突然变成这样其实也挺不习惯的，要多和更强的人比比才行，不然没有进步的，我可不是混个硕士毕业证就志得意满去工作的人。