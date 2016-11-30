def main():
    lines = [line.rstrip('\n\r') for line in open('input.txt')]
    array_input = []
    for line in lines:
        array_input.append(line.split(","))
    false_input = 0
    true_input = 0
    for array in array_input:
        for item in array:
            try:
                int(item)
            except ValueError:
                print array 
                false_input+=1
                break
    print false_input
    return array_input 

main()
