#ifndef _Stack_h
#define _Stack_h
#include<stdbool.h>

struct node;

typedef struct node *Stack;
typedef struct node *Node;
struct node
{
	char x;            /*因为要实现中缀转后缀，所以为char型*/
	Node next;
};
/*创建空栈*/
Stack create(void);

/*清空栈*/
void MakeEmpty(Stack S);

/*判断栈是否为空*/
bool IsEmpty(Stack S);

/*进栈*/
void push(Stack S, char ch);

/*返回栈顶元素*/
char top(Stack S);

/*从栈顶弹出，并返回弹出元素*/
char pop(Stack S);

#endif // !_Stack_h

