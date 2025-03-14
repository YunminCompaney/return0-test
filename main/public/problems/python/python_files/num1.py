def find_max_and_min(numbers):
    if len(numbers) == 0:
        return None
    
    max_num = numbers[0]
    min_num = numbers[0]
    
    for num in numbers:
        if num > max_num:
            max_num = num
        if num < min_num:
            max_num = num
            
    return (max_num, min_num)

numbers = [4, 2, 7, 1, 9, 3]
print(find_max_and_min(numbers))