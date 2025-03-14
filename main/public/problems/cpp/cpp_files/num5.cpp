#include <iostream>
using namespace std;

int main() {
    int x = 10, y = 5;
    x += y;     // x = x + y
    y = x - y;  // y = (x + y) - y
    x -= y;     // x = (x + y) - (x)
    cout << x << y;
    return 0;
}
