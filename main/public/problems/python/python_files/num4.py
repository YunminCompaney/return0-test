n = int(input("Enter a number: "))

sum = 0
for i in range(n + 1):
    if i % 3 == 0 or i % 5 == 0:
        print(i)
        sum += i
        
print(f"The sum of numbers divisible by 3 or 5 up to {n} is: {sum}")