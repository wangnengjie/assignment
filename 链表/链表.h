#ifndef LIST_H_
#define LIST_H_
#include<stdbool.h>

/*链表大小，这个东西貌似用处不大？？？*/
#define SIZE 1000

/*结构*/
struct list
{
	int element;/*个人认为这个数值作为链表区分依据，1号节点，2号节点之类的*/
	Node next;
};

typedef struct list * List;/*表头*/
typedef struct list * Node;/*节点*/

/*初始化表头*/

void createList(List p);

/*判断链表是否为空——传入表头*/

bool listIsEmpty(const List p);

/*判断链表是否已满——传入表头;暂不编写*/
bool listIsFull(const List p);

/*确定项数*/
unsigned int listNumber(const List p);

/*末尾添加节点*/
void addNode(Node node, List p);

/*清空链表释放内存*/
void emptyTheList(List p);

/*在某元素后插入节点，理论上应该要通过节点的某个属性进行判断，同时要处理属性重复出现的情况，这个可能需要实际应用时编写*/
void insert(int x, Node node,List p);

/*找到某节点的前一节点，不足同上*/
Node findPrevious(int x, List p);

/*删除某节点，不足同上*/
void Delete(int x, List p);

/*判断是否为最后一个节点*/
int islast(Node node, List p);

/*拷贝结构数据copyToNode……cpp把这个写在原文件里，什么局部函数原型static的，估计是我为了学数据结构给跳了*/

/*找到某节点，并返回节点地址*/
Node find(int x, List p);

#endif // !1

