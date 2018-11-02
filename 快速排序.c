#include<stdio.h>
void quicksort(int arr[], int n);
void qsort(int arr[], int left, int right);
int middle3(int arr[],int left,int right);
void swap(int *a, int *b);
void insertionSort(int arr[], int n);
int main(void)
{
	int arr[50] = { 56,1,86,561,1651,189,5,6,1,9,51,89,5,89,6,1684,13,8,65,495,
	                94,64,95,112,8,951,3549,518,951,6,6495,16,549,51,654,9,979,621,3,846,
		            68,1615,6489,651,6,894,91,89,5,21};
	for (int i = 0; i < 50; i++)
	{
		printf("%5d", arr[i]);
	}
	putchar('\n');
	quicksort(arr, 50);
	for (int i = 0; i < 50; i++)
	{
		printf("%5d", arr[i]);
	}
	
	return 0;
}

void quicksort(int arr[], int n)
{
	qsort(arr, 0, n - 1);
}

void qsort(int arr[], int left, int right)
{
	int i, j;
	int midnum;
	if (left + 10 <= right)
	{
		midnum = middle3(arr, left, right);
		i = left;
		j = right - 1;
		while (1)
		{
			while (arr[++i] < midnum);
			while (arr[--j] > midnum);
			if (i < j)
				swap(&arr[i], &arr[j]);
			else
				break;
		}
		swap(&arr[i], &arr[right - 1]);
		qsort(arr, left, i - 1);
		qsort(arr, i, right);
	}
	else                                        /*数组过小（n<10）就插排，效率会快？？？算了，他分析运算时间的我全看不懂*/
		insertionSort(arr + left,right - left + 1);/*插排的起始处为传入的左下标*/
}

int middle3(int arr[], int left, int right)
{
	int mid = (left + right) / 2;
	if (arr[left] > arr[mid])
		swap(&arr[left], &arr[mid]);
	if (arr[left] > arr[right])
		swap(&arr[left], &arr[right]);
	if (arr[mid] > arr[right])
		swap(&arr[mid], &arr[right]);

	swap(&arr[mid], &arr[right - 1]);
	return arr[right - 1];
}

void swap(int *a, int *b)
{
	int c;
	c = *a;
	*a = *b;
	*b = c;
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
