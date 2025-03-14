def calculation(x, y):
    x += y
    y = x - y
    x -= y

    return x, y

x = int(input("Enter the value for x: "))
y = int(input("Enter the value for y: "))

result = calculation(x, y)

print(f"x : {result[0]}, y: {result[1]}")