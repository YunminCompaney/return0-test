#include <iostream>
int addition();
int main()
{
    std::cout << addition(2,3);
}
int addition(int a, int b)
{
    return a + b;
}