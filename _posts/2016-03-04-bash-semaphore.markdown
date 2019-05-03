---
bg: "tools.jpg"
layout: post
title:  "Bash - Semaphore"
crawlertitle: "Bash - Semaphore"
summary: "Rustic way to implement a semaphore"
date:   2016-03-04 11:12:57 -0300
categories: daily
author: Jonatas Teixeira
tags: 'daily'

---

Some months ago, I was tryng to configure a continuous deployment pipeline for mobile apps, to execute a set of automated functional tests paralized in a group of android devices.

My goal was execute the same set of tests in 300 devices. Each set of test take more than 5 hours to execute. 
To perform this kind of test I used Open STF, I intend to write more about it here. 

This task was not so successfull as a imagine before, to execute this kind of test we have a lot of issues with USB port, conections, batteries, .... and everything else.

But I learned some tricks doing this. One of this was make the Jenkins wait until all the Calabash tasks finishs. To do it I implement a semaphore to controll and wait for all the processes ends.

## Semaphore

In computer science, a semaphore is kind of data used to control access to a common resource by multiple processes. 

![Crossroad](/assets/images/semaphore.gif){:class="img-responsive"}

This simple variable is used to solve critical section problems organizing the synchronization in the multi processing environment.
Usualy a semaphore is implemented as a plain variable that is changed (incremented, decremented, or toggled).

In the real world the semaphore is used to organize and synchronize the sharing of crossroads. When you have a lot of cars intending to cross in the same time.

Usually when you have a lot of threads and all the threads need to read/write some data in the same file, we have a tipycal problem o concurrence. It not possible two or more processes write in the file in the same time, so here we can you a semaphore to solve this concurrence problem.

A useful way to think of a semaphore as used in the real-world system is as a record of how many units of a particular resource are available, coupled with operations to adjust that record safely (i.e. to avoid race conditions) as units are required or become free, and, if necessary, wait until a unit of the resource becomes available.


Semaphores which allow an arbitrary resource count are called counting semaphores, while semaphores which are restricted to the values 0 and 1 (or locked/unlocked, unavailable/available) are called binary semaphores and are used to implement locks.

The semaphore concept was invented Edsger Dijkstra in 1962 or 1963. (the same Dijkstra thar created a algorithm to find the shortest paths between nodes in a graph).

In our case we use the semaphore to another goal. Here I had to start a lot parallel process and wait until all ends.  To do it, I just save the PID of each process and check if all of theses ends.

{% highlight bash %}

global SEMAPHORE=""

# Runs a command
function acquire {
  # The command sleep runs in background as an example.
  sleep $(( 60 + RANDOM % 60 )) &
  SEMAPHORE="${SEMAPHORE} + ${!}"
}

# Check the processes are running
function processes {
  for pid in ${SEMAPHORE}
  do
    if ! kill -0 ${pid} &>/dev/null
    then
      SEMAPHORE=`echo ${SEMAPHORE} | sed -e "s/${pid}//g"`
    fi
  done
  echo ${SEMAPHORE}
}

# Wait for all the processes end
function wait {
  while [ -n "`processes`" ]
  do
    sleep 1
  done
}

# Kill a process
function release {
  pid=$1
  if echo ${SEMAPHORE} | grep -q ${pid}
  then
    kill ${pid}
    SEMAPHORE=`echo ${SEMAPHORE} | sed -e "s/${pid}//g"`
  fi
}
{% endhighlight %}

