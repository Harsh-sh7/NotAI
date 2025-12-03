# Contest Feature - User Guide

## Quick Start

### Step 1: Access Contest
1. Open your NotAI application at `http://localhost:3000`
2. Click the **"Contest"** button in the navigation bar (desktop) or the badge icon (mobile)

### Step 2: Select Your Level
Choose from three difficulty levels:
- 🌱 **Beginner** - For those starting with DSA
- 🚀 **Intermediate** - For developers with some experience
- ⚡ **Expert** - For advanced problem solvers

**Note:** You must be logged in to proceed. If not logged in, you'll be prompted to sign in.

### Step 3: Choose a Topic
Select from 15 popular DSA topics:
- Arrays
- Strings
- Linked Lists
- Stacks
- Queues
- Trees
- Graphs
- Sorting
- Searching
- Dynamic Programming
- Greedy Algorithms
- Backtracking
- Hash Tables
- Heaps
- Recursion

**Or** enter a custom topic in the text field (e.g., "Binary Search Trees", "Sliding Window")

### Step 4: Select Programming Language
Choose your preferred language:
- Python
- JavaScript
- C++
- Java

### Step 5: Generate Problem
Click the **"Generate Problem"** button. The AI will create a custom problem based on your selections.

### Step 6: Solve the Problem

#### Understanding the Interface

**Left Panel - Problem Description:**
- Problem title and difficulty badge
- Topic tag
- Detailed problem description
- Example test cases with inputs and outputs
- Constraints and requirements

**Right Panel - Code Editor:**
- **Language Selector**: Switch languages (code will reset to starter code)
- **Run Button**: Test your code with custom input
- **Submit Button**: Validate against all test cases
- **New Contest Button**: Start a fresh contest

**Console (Bottom):**
- **Input Tab**: Enter custom test input
- **Output Tab**: View execution results

#### Writing Your Solution

1. The editor comes with starter code for your selected language
2. Write your solution in the designated area (similar to LeetCode)
3. You only need to implement the solution function
4. The test execution code is hidden and handled automatically

#### Testing Your Code

**Option 1: Run with Custom Input**
1. Click the **Input** tab in the console
2. Enter your test input
3. Click **Run**
4. View results in the **Output** tab

**Option 2: Submit Solution**
1. Click **Submit** to run against all test cases
2. Results will show:
   - ✓ **Passed** test cases in green
   - ✗ **Failed** test cases in red with details
   - Hidden test case results (pass/fail only)
3. If all tests pass: "🎉 Congratulations! All test cases passed!"

### Step 7: Try Another Problem
Click **"New Contest"** to:
- Change your level
- Pick a different topic
- Get a fresh problem

## Tips for Success

### 1. **Start Simple**
- Begin with Beginner level to understand the format
- Try familiar topics first (Arrays, Strings)

### 2. **Read Carefully**
- Study the problem description thoroughly
- Check the example test cases
- Note the constraints

### 3. **Test Incrementally**
- Use the Run feature to test with custom inputs
- Verify edge cases before submitting
- Check for off-by-one errors

### 4. **Understand Test Cases**
- Example test cases are visible
- Hidden test cases validate edge cases
- Match the exact output format

### 5. **Debug Effectively**
- Use print/console.log statements
- Test with the provided examples first
- Check for syntax errors before running

## Example Workflow

### Beginner Array Problem

**Step 1:** Select Beginner → Arrays → Python → Generate

**Step 2:** Problem appears: "Find the maximum element in an array"

**Step 3:** Starter code provided:
```python
def solution():
    # Write your code here
    pass
```

**Step 4:** Implement solution:
```python
def solution():
    arr = list(map(int, input().split()))
    return max(arr)
```

**Step 5:** Test with custom input:
- Input: `1 5 3 9 2`
- Run → Output: `9`

**Step 6:** Submit
- All test cases pass ✓
- Success message displayed!

## Common Issues & Solutions

### Issue 1: "Failed to generate problem"
**Solution:** 
- Check your internet connection
- Ensure Gemini API key is configured
- Try again (API might be temporarily busy)

### Issue 2: Code execution timeout
**Solution:**
- Optimize your algorithm
- Avoid infinite loops
- Check time complexity

### Issue 3: Wrong answer on hidden test cases
**Solution:**
- Review edge cases (empty input, single element, etc.)
- Check output format (extra spaces, newlines)
- Verify data type conversions

### Issue 4: Compilation/Syntax errors
**Solution:**
- Check language-specific syntax
- Ensure proper indentation (Python)
- Match bracket pairs
- Verify variable declarations

## Language-Specific Notes

### Python
- Use `input()` to read from stdin
- Use `print()` for output
- Only standard library available (no numpy, pandas, etc.)

### JavaScript
- Use Node.js syntax
- Read from stdin using readline or similar
- Use `console.log()` for output

### C++
- Include necessary headers
- Use `cin` for input, `cout` for output
- Remember `using namespace std;`

### Java
- Main class must be named `Main` or `Solution`
- Use `Scanner` for input
- Use `System.out.println()` for output

## Best Practices

1. **Read the entire problem** before coding
2. **Plan your approach** mentally or on paper
3. **Start with brute force**, optimize later
4. **Test with examples** before submitting
5. **Handle edge cases** (empty, single element, large numbers)
6. **Match output format exactly** (no extra text)
7. **Use meaningful variable names**
8. **Comment complex logic**
9. **Check time/space complexity**
10. **Learn from failures** - review failed test cases

## Keyboard Shortcuts (Code Editor)

- **Ctrl/Cmd + S**: Save (auto-saved)
- **Ctrl/Cmd + /**: Toggle comment
- **Ctrl/Cmd + F**: Find
- **Ctrl/Cmd + H**: Find and replace
- **Tab**: Indent
- **Shift + Tab**: Outdent
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo

## FAQ

**Q: Can I change the language after generating a problem?**
A: Yes! Use the language selector. Your code will reset to the starter code for that language.

**Q: How many test cases are there?**
A: Typically 2-3 visible example test cases and 1-3 hidden test cases.

**Q: Can I see the hidden test cases?**
A: No, hidden test cases are meant to validate edge cases without revealing the exact input.

**Q: What happens if I close the browser?**
A: Your current contest state is saved. You can continue where you left off.

**Q: Can I get hints?**
A: Currently, no hints are provided. Focus on understanding the problem and examples.

**Q: Is there a time limit?**
A: No time limit for solving. Take your time to think and code carefully.

**Q: Can I use external libraries?**
A: No, only standard libraries are available for each language.

**Q: What if the AI generates an unclear problem?**
A: Click "New Contest" and generate a new problem. You can also try a different topic.

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify backend is running (`npm start` in backend folder)
3. Verify frontend is running (`npm run dev` in frontend folder)
4. Check Judge0 API key is configured
5. Check Gemini API key is configured

---

**Happy Coding! 🚀**

Practice regularly, challenge yourself with harder levels, and improve your DSA skills with NotAI Contest!
