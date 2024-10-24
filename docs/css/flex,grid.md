# flex，grid

## flex

参考文章：阮一峰flex，张鑫旭flex

本质：

grow：剩余空间的分配，如果占满了也就没有分配空间了。

shrink：基于原本大小的等比例缩小

## grid

来源mdn

![image-20230301104057384](.\img\image-20230301104057384.png)

fr本质：分配剩余空间

### 等分布局解决方案

当有元素内容过大时，`repeat(2, 1fr)`，不能等分，解决方法，`repeat(2, minmax(0, 1fr))`

