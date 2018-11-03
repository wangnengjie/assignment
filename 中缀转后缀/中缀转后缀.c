#include "у╩й╣ож.h"
#include<stdlib.h>
#include<stdio.h>
#include<stdbool.h>
int main(void)
{
	char ch;
	Stack S = create();
	while ((ch = getchar()) != '\n')
	{
		
		if (ch == ' ')
			continue;
		if (ch >= '0'&&ch <= '9')
			putchar(ch);
		else if (IsEmpty(S))
		{
			push(S, ch);
			putchar(' ');
		}
		else
		{
			if (ch == '(')
				push(S, ch);
			else if (ch == ')')
			{
				while (top(S) != '(')
				{
					putchar(' ');
					putchar(pop(S));
				}
				pop(S);
				putchar(' ');
			}
			else if (ch == '*' || ch == '/')
			{
				while (top(S) == '*' || top(S) == '/')
				{
					putchar(' ');
					pop(S);
				}
				push(S, ch);
				putchar(' ');
			}
			else if (ch == '+' || ch == '-')
			{
				while (top(S) == '*' || top(S) == '/' || top(S) == '+' || top(S) == '-')
				{
					putchar(' ');
					putchar(pop(S));
				}
				putchar(' ');
				push(S, ch);
			}
		}
	}
	while (!IsEmpty(S))
	{
		putchar(' ');
		putchar(pop(S));
	}
	return 0;
}