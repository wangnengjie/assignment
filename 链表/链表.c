#include<stdio.h>
#include<stdlib.h>
#include "链表.h"

void createList(List p)
{
	p->next = NULL;
}

bool listIsEmpty(const List p)
{
	if (p->next == NULL)
		return true;
	else
		return false;
}

unsigned int listNumber(const List p)
{
	unsigned int count = 0;
	Node ptr;
	ptr = p;
	while (ptr->next != NULL)
	{
		count++;
		ptr = ptr->next;
	}
	return count;
}

void addNode(Node node, List p)
{
	Node temp;
	Node ptr;
	temp = (Node)malloc(sizeof(struct list));
	copyToNode(temp, node);
	temp->next = NULL;
	ptr = p->next;
	if (ptr == NULL)
		p->next = temp;
	else
	{
		while (ptr->next != NULL)
			ptr = ptr->next;
		ptr->next = temp;
	}
}

void emptyTheList(List p)
{
	Node ptr, temp;
	ptr = p->next;
	p->next = NULL;
	while (ptr != NULL)
	{
		temp = ptr->next;
		free(ptr);
		ptr = temp;
	}
}

void insert(Node target, Node node, List p)/*将传入的target插入到node之后,node可以通过findprevious或find查找*/
{
	Node temp;
	temp = (Node)malloc(sizeof(struct list));
	copyToNode(temp, target);               /*将传入的target内的数据传给temp*/
	temp->next = node->next;
	node->next = temp;
}

Node findPrevious(int x, List p)
{
	Node ptr;
	ptr = p;
	while (ptr->next != NULL && ptr->next->element != x)
		ptr = ptr->next;
	return ptr;
}

void Delete(int x, List p)
{
	Node ptr, temp;
	ptr = findPrevious(x, p);
	if (!islast(ptr, p))
	{
		temp = ptr->next;
		ptr->next = temp->next;
		free(temp);
	}
}

int islast(Node node, List p)
{
	return node->next == NULL;
}

Node find(int x, List p)
{
	Node ptr;
	ptr = p->next;/*从表头的后一个结构开始找*/
	while (ptr != NULL && ptr->element != x)
	{
		ptr = ptr->next;
	}
	return ptr;
}


static void copyToNode(Node target, Node has);
static void copyToNode(Node target, Node has)
{

}