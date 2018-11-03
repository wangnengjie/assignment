#include "у╩й╣ож.h"
#include<stdlib.h>
#include<stdio.h>
#include<stdbool.h>
Stack create(void)
{
	Stack S;
	S = malloc(sizeof(struct node));
	S->x = '\n';
	S->next = NULL;
	MakeEmpty(S);
	return S;
}

void MakeEmpty(Stack S)
{
	while (!IsEmpty(S))
		pop(S);
}

bool IsEmpty(Stack S)
{
	if (S->next == NULL)
		return true;
	else
		return false;
}

void push(Stack S, char ch)
{
	Node tmp;
	tmp = malloc(sizeof(struct node));
	tmp->next = S->next;
	tmp->x = ch;
	S->next = tmp;
}

char top(Stack S)
{
	if(!IsEmpty(S))
		return S->next->x;
	return 0;
}

char pop(Stack S)
{
	Node tmp;
	char ch = S->next->x;
	tmp = S->next;
	S->next = S->next->next;
	free(tmp);
	return ch;
}
