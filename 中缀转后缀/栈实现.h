#ifndef _Stack_h
#define _Stack_h
#include<stdbool.h>

struct node;

typedef struct node *Stack;
typedef struct node *Node;
struct node
{
	char x;            /*��ΪҪʵ����׺ת��׺������Ϊchar��*/
	Node next;
};
/*������ջ*/
Stack create(void);

/*���ջ*/
void MakeEmpty(Stack S);

/*�ж�ջ�Ƿ�Ϊ��*/
bool IsEmpty(Stack S);

/*��ջ*/
void push(Stack S, char ch);

/*����ջ��Ԫ��*/
char top(Stack S);

/*��ջ�������������ص���Ԫ��*/
char pop(Stack S);

#endif // !_Stack_h

