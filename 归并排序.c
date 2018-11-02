#include<stdio.h>
#include<stdlib.h>
void Mergesort(int arr[], int n);
void msort(int arr[], int tmparr[], int left, int right);
void merge(int arr[], int tmparr[], int left, int mid, int right);
int main(void)
{
	int arr[20] = { 56,1,86,561,1651,189,5,6,1,9,51,89,5,89,6,1684,13,8,65,495 };
	for (int i = 0; i < 20; i++)
	{
		printf("%5d", arr[i]);
	}
	putchar('\n');
	Mergesort(arr, 20);
	for (int i = 0; i < 20; i++)
	{
		printf("%5d", arr[i]);
	}
	return 0;
}

void Mergesort(int arr[], int n)
{
	int *tmparr;
	tmparr = malloc(n * sizeof(int));
	msort(arr, tmparr, 0, n - 1);
	free(tmparr);
}

void msort(int arr[], int tmparr[], int left, int right)
{
	int mid;
	if (left < right)
	{
		mid = (left + right) / 2;
		msort(arr, tmparr, left, mid);
		msort(arr, tmparr, mid + 1, right);
		merge(arr, tmparr, left, mid+1, right);
	}
}

void merge(int arr[], int tmparr[], int left, int mid, int right)
{
	int i = left;
	int length = right - left + 1;
	int lmid = mid -1;
	while (left <= lmid&&mid<=right)
	{
		if (arr[left] > arr[mid])
		{
			tmparr[i++] = arr[mid++];
		}
		else
		{
			tmparr[i++] = arr[left++];
		}
	}
	while (left<=lmid)
	{
		tmparr[i++] = arr[left++];
	}
	while (mid<=right)
	{
		tmparr[i++] = arr[mid++];
	}
	for (i = 0; i < length; right--,i++)
		arr[right] = tmparr[right];
}

