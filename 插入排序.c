#include<stdio.h>
#define N 10
void insertionSort(int arr[], int n);
int main(void)
{
	int i;
	int arr[N] = { 10,568,465,654,55,998,15,12,51,88 };
	for (i = 0; i < N; i++)
	{
		printf("%6d", arr[i]);
	}
	putchar('\n');
	insertionSort(arr, N);
	for (i = 0; i < N; i++)
	{
		printf("%6d", arr[i]);
	}
	return 0;
}

void insertionSort(int arr[], int n)
{
	int tmp;
	int i, j;
	for (i = 1; i < n; i++)
	{
		tmp = arr[i];
		for (j = i; j > 0 && arr[j - 1] > tmp; j--)
			arr[j] = arr[j - 1];
		arr[j] = tmp;
	}
}
