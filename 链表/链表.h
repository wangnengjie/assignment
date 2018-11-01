#ifndef LIST_H_
#define LIST_H_
#include<stdbool.h>

/*�����С���������ò���ô����󣿣���*/
#define SIZE 1000

/*�ṹ*/
struct list
{
	int element;/*������Ϊ�����ֵ��Ϊ�����������ݣ�1�Žڵ㣬2�Žڵ�֮���*/
	Node next;
};

typedef struct list * List;/*��ͷ*/
typedef struct list * Node;/*�ڵ�*/

/*��ʼ����ͷ*/

void createList(List p);

/*�ж������Ƿ�Ϊ�ա��������ͷ*/

bool listIsEmpty(const List p);

/*�ж������Ƿ��������������ͷ;�ݲ���д*/
bool listIsFull(const List p);

/*ȷ������*/
unsigned int listNumber(const List p);

/*ĩβ��ӽڵ�*/
void addNode(Node node, List p);

/*��������ͷ��ڴ�*/
void emptyTheList(List p);

/*��ĳԪ�غ����ڵ㣬������Ӧ��Ҫͨ���ڵ��ĳ�����Խ����жϣ�ͬʱҪ���������ظ����ֵ���������������Ҫʵ��Ӧ��ʱ��д*/
void insert(int x, Node node,List p);

/*�ҵ�ĳ�ڵ��ǰһ�ڵ㣬����ͬ��*/
Node findPrevious(int x, List p);

/*ɾ��ĳ�ڵ㣬����ͬ��*/
void Delete(int x, List p);

/*�ж��Ƿ�Ϊ���һ���ڵ�*/
int islast(Node node, List p);

/*�����ṹ����copyToNode����cpp�����д��ԭ�ļ��ʲô�ֲ�����ԭ��static�ģ���������Ϊ��ѧ���ݽṹ������*/

/*�ҵ�ĳ�ڵ㣬�����ؽڵ��ַ*/
Node find(int x, List p);

#endif // !1

