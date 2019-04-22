---
layout: post
title:  "Python - Undo Redo Pattern"
date:   2011-05-22 21:59:45 -0300
categories: daily
---

Recently, I was looking for a simple way to implement UNDO and REDO features on [Grape-Editor](hhttps://github.com/grape-editor/).
Looking around the web I discoverd exist a famous pattern that allow a simple way to implement these features.

## Command Pattern

Basicaly is necessary main 3 kinds of classes. Invoker, Receiver and Command. A playfull way to explain how it works is when you figure that invoker will execute a command inside a receiver. The default command pattern dont include undo/redo features, but is very easy to extend.

O the web exists many diagrams that try to explain how `Command Pattern` works. 
After read a lot of I created this one:

![Command Pattern Diagram](/images/command_pattern.png){:class="img-responsive"}

Okay, okay. I don't like UML diagram too. But now lets talk about each class of this pattern.
To take easier to understand, lets use an example of "how to drive a car".
In this axample we have the receiver (car), invoker (driver) and a list of actions (turn, brake, speed up).
The Car receive and execute all the Commands the Invoker calls.

### Class Receiver

Let`s talk abou receiver.
This class should implement the actions will happen in object, and execute all the commands.

You can see above a simple example of Car class, thar execute 5 commands (turn on/off, turn left/right, speed up and brake).
Each command should execute something in object, in our case, we just print what happened.

{% highlight python %}
class Car(object):
  """The RECEIVER class"""
  def turn_right(self):
    print("You turned right")

  def turn_left(self):
    print("You turned left")
  
  def dobreak(self):
    print("You braked")

  def turn_on(self):
    print("You turned on")

  def turn_off(self):
    print("You turned off")

  def speed_up(self, args):
    print(f"You speed up {args}")
{% endhighlight %}

### Class Command

Command is a interface class that specify what each especific command should implement.
In this case,  the class is very simples, because is necessry to implement only the `execute` and `__init__` methods.

{% highlight python %}
class Command(object):
  """The COMMAND interface"""
  def __init__(self, obj):
    self._obj = obj

  def execute(self, *args):
    raise NotImplementedError
{% endhighlight %}

But it's not enough. For each command that is possible execute inside your Receiver (Car), you should to implement an especific class to implement the caller. How we described 5 commands in our `Car` class, we should do implement 5 classes using the `Command` interface.

{% highlight python %}
class TurnRightCommand(Command):
  """The COMMAND for turning right"""
  def execute(self, *args):
    self._obj.turn_right()

class TurnLeftCommand(Command):
  """The COMMAND for turning left"""
  def execute(self, *args):
      self._obj.turn_left()

class DoBrakeCommand(Command):
  """The COMMAND for brake"""
  def execute(self, *args):
      self._obj.dobreak()

class TurnOnCommand(Command):
  """The COMMAND for turning on"""
  def execute(self, *args):
      self._obj.turn_on()
      
class TurnOffCommand(Command):
  """The COMMAND for turning off"""
  def execute(self, *args):
      self._obj.turn_off()

class SpeedUpCommand(Command):
  """The COMMAND for turning off"""
  def execute(self, *args):
      self._obj.speed_up(args)
{% endhighlight %}

### Class Invoker

The class Invoker is our Driver object, but before talk about the Invoker, we need to create a interface that will specify some methods to Undo/Redo pattern.

{% highlight python %}
class UndoRedo(object):
  """The UNDOREDO interface"""
  def __init__(self, obj):
    self._obj = obj

  def history(self):
    raise NotImplementedError
  
  def undo(self):
    raise NotImplementedError
  
  def redo(self):
    raise NotImplementedError
{% endhighlight %}

Now we should implement a Inokver (Driver) that should have a history attribute to store all the actions to allow undo and redo `Commands`. It's works as a stack.

In the invoker we have a register with all the commands that is possible to execute. Its make the invoker more generic and reusable.
Basicly this register is a dictionary of key and value, where value is a pointer to specific Command.

For example: `{ "TURN_RIGHT": TurnRightCommand(car_object) }`

It's will be more clear, when we see the use example of pattern.

{% highlight python %}
import time

class Driver(UndoRedo):
  """The INVOKER class"""
  def __init__(self):
    self._history = [(0.0, "OFF", ())]
    self._history_position = 0
    self._commands = {}

  def register(self, command_name, command):
    """All commands are registered in the Invoker Class"""
    self._commands[command_name] = command

  def execute(self, command_name, *args):
    """Execute a pre defined command and log in history"""
    if command_name in self._commands.keys():
      self._history_position += 1
      self._commands[command_name].execute(args)
      if len(self._history) == self._history_position:
        # This is a new event in history
        self._history.append((time.time(), command_name, args))
      else:
        # This occurs if there was one of more UNDOs and then a new
        # execute command happened. In case of UNDO, the history_position
        # changes, and executing new commands purges any history after
        # the current position
        self._history = self._history[:self._history_position+1]
        self._history[self._history_position] = (time.time(), command_name, args)
    else:
        print(f"Command [{command_name}] not recognised")

  def undo(self):
    """Undo a command if there is a command that can be undone.
    Update the history psoition so that further UNDOs or REDOs
    point to the correct index"""
    if self._history_position > 0:
        self._history_position -= 1
        self._commands[
            self._history[self._history_position][1]
        ].execute(self._history[self._history_position][2])
    else:
        print("nothing to undo")

  def redo(self):
    """Perform a REDO if the history_position is less than 
    the end of the history list"""
    if self._history_position + 1 < len(self._history):
        self._history_position += 1
        self._commands[
            self._history[self._history_position][1]
        ].execute(self._history[self._history_position][2])
    else:
        print("nothing to redo")

  def history(self):
      """Return all records in the History list"""
      return self._history

  def register(self, command_name, command):
    """All commands are registered in the Invoker Class"""
    self._commands[command_name] = command
{% endhighlight %}

### Use Example

First of all, we need to two attributes (`Receiver` and `Invoker`).

And we should to register all the commands available to execute. And then we can execute the commands, and if necessary, call undo and redo methods.

To make easier to test and run this code, I created a start method, just to give a CLI to exec all the comands available.

{% highlight python %}
class DriverCarClient(object):
  """The CLIENT class"""
  def __init__(self):
    """Reclare Receiver and Invoker and register all the Commands"""
    self._car = Car()   #RECEIVER
    self._driver = Driver() #INVOKER

    # Here is how we register the commands in invoker.
    self._driver.register("RIGHT", TurnRightCommand(self._car))
    self._driver.register("LEFT", TurnLeftCommand(self._car))
    self._driver.register("BRAKE", DoBrakeCommand(self._car))
    self._driver.register("ON", TurnOnCommand(self._car))
    self._driver.register("OFF", TurnOffCommand(self._car))
    self._driver.register("SPEED", SpeedUpCommand(self._car))

  def start(self):
    """Implement a loop to read commands from CLI and call a invoker
    to execute a especific command and then print the history stack"""
    while True:
      cmd = input().strip().upper()
      if cmd == "RIGHT":
        self._driver.execute("RIGHT")
      elif cmd == "LEFT":
        self._driver.execute("LEFT")
      elif cmd == "ON":
        self._driver.execute("ON")
      elif cmd == "OFF":
        self._driver.execute("OFF")
      elif cmd == "BRAKE":
        self._driver.execute("BRAKE")
      elif cmd == "SPEED":
        self._driver.execute("SPEED", 10)
      elif cmd == "UD":
        self._driver.undo()
      elif cmd == "RD":
        self._driver.redo()
      else:
        print("Unrecognized command.")
      print(self._driver.history())

# Execute if this file is run as a script and not imported as a module
if __name__ == "__main__":
  DriverCarClient().start()
{% endhighlight %}

## COPY + PASTE and RUN

Here follow a abstract example to Copy + Paste and Run

{% highlight python %}
import time

class UndoRedo(object):
  def __init__(self, obj):
    self._obj = obj

  def history(self):
      raise NotImplementedError
  
  def undo(self):
    raise NotImplementedError
  
  def redo(self):
    raise NotImplementedError
  
class Command(object):
  def __init__(self, obj):
    self._obj = obj

  def execute(self, *args):
    raise NotImplementedError

class Invoker(UndoRedo):
  def __init__(self):
    self._history = [(0.0, "1", ())]
    self._history_pivot = 0
    self._commands = {}

  def register(self, command_name, command):
    self._commands[command_name] = command

  def execute(self, command_name, *args):
    if command_name in self._commands.keys():
      self._history_pivot += 1
      self._commands[command_name].execute(args)
      if len(self._history) == self._history_pivot:
        self._history.append((time.time(), command_name, args))
      else:
        self._history = self._history[:self._history_pivot+1]
        self._history[self._history_pivot] = (time.time(), command_name, args)
    else:
        print(f"Command [{command_name}] not recognised")

  def undo(self):
    if self._history_pivot > 0:
        self._history_pivot -= 1
        self._commands[
            self._history[self._history_pivot][1]
        ].execute(self._history[self._history_pivot][2])
    else:
        print("nothing to undo")

  def redo(self):
    if self._history_pivot + 1 < len(self._history):
        self._history_pivot += 1
        self._commands[
            self._history[self._history_pivot][1]
        ].execute(self._history[self._history_pivot][2])
    else:
        print("nothing to redo")
  def history(self):
      return self._history

  def register(self, command_name, command):
    self._commands[command_name] = command

class Action1Command(Command):
  def execute(self, *args):
    self._obj.action1()

class Action2Command(Command):
  def execute(self, *args):
      self._obj.action2()

class Action3Command(Command):
  def execute(self, *args):
      self._obj.action3()

class Receiver(object):
  def action1(self):
    print("You runned action1")

  def action2(self):
    print("You runned action2")

  def action3(self):
    print("You runned action3")

class Client(object):
  def __init__(self):
    self._receiver = Receiver()
    self._invoker = Invoker()
    self._invoker.register("C1", Action1Command(self._receiver))
    self._invoker.register("C2", Action2Command(self._receiver))
    self._invoker.register("C3", Action3Command(self._receiver))

  def start(self):
    while True:
      cmd = input().strip().upper()
      if cmd == "C1" or cmd == "C2" or cmd == "C3"
        self._invoker.execute(cmd)
      elif cmd == "UD":
        self._ride.undo()
      elif cmd == "RD":
        self._ride.redo()
      else:
        print("Unrecognized command.")
      print(self._ride.history())

if __name__ == "__main__":
  Client().start()

{% endhighlight %}

