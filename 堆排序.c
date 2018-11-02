#include<stdio.h>
void heapsort(int arr[], int n);
void percdown(int arr[], int i, int n);
void swap(int *a, int *b);
int main(void)
{
	int arr[20] = { 56,1,86,561,1651,189,5,6,1,9,51,89,5,89,6,1684,13,8,65,495 };
	for (int i = 0; i < 20; i++)
		printf("%5d", arr[i]);
	putchar('\n');
	heapsort(arr, 20);
	for (int i = 0; i < 20; i++)
		printf("%5d", arr[i]);
	return 0;
}

void heapsort(int arr[], int n)
{
	int i;
	for (i = n / 2; i >= 0; i--)/*����*/
		percdown(arr, i, n);
	for (i = n - 1; i > 0; i--)/*�������*/
	{
		swap(&arr[0], &arr[i]);
		percdown(arr, 0, i);
	}
}

void swap(int *a, int *b)
{
	int c;
	c = *a;
	*a = *b;
	*b = c;
}

void percdown(int arr[], int i, int n)
{
	int child, number;
	for (number = arr[i]; (2 * i + 1) < n; i = child)
	{
		child = 2 * i + 1;
		if (child != n - 1 && arr[child + 1] > arr[child])/*�Ƚ����Ҷ��ӣ�ȡ�ϴ����*/
			child++;
		if (arr[child] > number)
			arr[i] = arr[child];
		else
			break;
	}/*�����е����Ʋ������У��������ƣ�ֱ��ֹͣ���ֵ����*/
	arr[i] = number;
}



