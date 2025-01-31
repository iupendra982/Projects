import random
from tkinter import *

class MathQuiz:
  def __init__(self, master):
    self.master = master
    master.title("Math Quiz")

    # Create intro label
    self.intro_label = Label(master, text="** A Simple Math Quiz **", font=("Arial", 16))
    self.intro_label.pack(pady=20)

    # Create buttons frame
    self.buttons_frame = Frame(master)
    self.buttons_frame.pack()

    # Create buttons for operations
    self.operation_buttons = []
    operations = ["Addition", "Subtraction", "Multiplication", "Integer Division"]
    for i, operation in enumerate(operations):
      button = Button(self.buttons_frame, text=operation, command=lambda op=i+1: self.generate_question(op))
      button.grid(row=0, column=i, padx=10, pady=5)
      self.operation_buttons.append(button)

    # Create answer entry and label
    self.answer_entry = Entry(master)
    self.answer_entry.pack(pady=10)
    self.answer_label = Label(master, text="")
    self.answer_label.pack()

    # Create button to check answer
    self.check_button = Button(master, text="Check Answer", command=self.check_answer)
    self.check_button.pack()

    # Create button to check answer
    self.result_button = Button(master, text="display_result", command=self.display_result)
    self.result_button.pack()

    # Create result label
    self.result_label = Label(master, text="")
    self.result_label.pack(pady=10)

    # Exit button
    self.exit_button = Button(master, text="Exit", command=master.quit)
    self.exit_button.pack()

    # Initialize variables
    self.total_questions = 0
    self.correct_answers = 0
    self.current_question = None

  def generate_question(self, operation):
    self.total_questions += 1
    self.answer_entry.delete(0, END)  # Clear previous answer
    self.answer_label.config(text="")  # Clear previous feedback

    number_one = random.randrange(1, 21)
    number_two = random.randrange(1, 21)

    if operation == 1:
      problem = f"{number_one} + {number_two} = "
      solution = number_one + number_two
    elif operation == 2:
      problem = f"{number_one} - {number_two} = "
      solution = number_one - number_two
    elif operation == 3:
      problem = f"{number_one} * {number_two} = "
      solution = number_one * number_two
    else:
      problem = f"{number_one} / {number_two} = "
      solution = int(number_one / number_two)

    self.current_question = solution
    self.answer_label.config(text=problem)

  def check_answer(self):
    if not self.current_question:
      self.answer_label.config(text="Please generate a question first!", fg="red")
      return

    try:
      user_solution = int(self.answer_entry.get())
      if user_solution == self.current_question:
        self.correct_answers += 1
        self.answer_label.config(text=f"Correct! {self.current_question}", fg="green")
      else:
        self.answer_label.config(text=f"Incorrect! Answer: {self.current_question}", fg="red")
    except ValueError:
      self.answer_label.config(text="Invalid input. Please enter a number!", fg="red")

  def display_result(self):
    if self.total_questions > 0:
      percentage = round((self.correct_answers / self.total_questions) * 100, 2)
    else:
      percentage = 0

    self.result_label.config(text=f"You answered {self.total_questions} questions with {self.correct_answers} correct.\nYour score is {percentage}%. Thank you for playing!")

if __name__ == "__main__":
    root = Tk()
    quiz = MathQuiz(root)
    root.mainloop()  
