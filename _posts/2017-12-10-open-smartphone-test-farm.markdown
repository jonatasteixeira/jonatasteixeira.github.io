---
bg: "tools.jpg"
layout: post
title:  "Open STF"
crawlertitle: "Huge implementation"
summary: "Massive usage of Open STF"
date:   2017-10-12 22:47:12 -0300
categories: daily
author: Jonatas Teixeira
tags: 'daily'

---

Some months ago, I was tryng to configure a continuous deployment pipeline for mobile apps, to execute a set of automated functional tests paralized in a group of android devices as I descriebd in my master degree. 

My goal was execute the same set of tests in 300 devices. Each set of test take more than 5 hours to execute. 
To perform this kind of test I used Open STF, I intend to write more about it here. 

This task was not so successfull as a imagine before, to execute that kind of test we have a lot of issues with USB port, conections, batteries, .... and everything else.

But I learned some tricks doing this. One of this was make the Jenkins wait until all the Calabash/Appium tasks end. To do it I implement a semaphore to controll and wait for all the processes ends. You can find this semaphore clicking [here]({% post_url 2016-03-04-bash-semaphore %}).


## Lets talk about hardware

In addition, was necessary buy 350 usb cables, 350 differnte kinds of Android devices (it represents about 95% covorage of brasilian android market share). To keep 350 devices online I did a lot of tests until rich the fallow requirements:

Each node support 16 devices, for each node is necessary you use 1 USB controller (4ports), 4 USB hubs (7ports) to cover 28 USB ports. To cover 350 devices is necesary 13 nodes.

This is a list of components we are currently using and are proven to work.

| How Many | Hardware |
|-----------|----------|
| x13 | [Linux servers](#server-components) |
| x13 | [USB extension card](http://www.startech.com/Cards-Adapters/USB-3.0/Cards/PCI-Express-USB-3-Card-4-Dedicated-Channels-4-Port~PEXUSB3S44V) |
| x52 | [USB hubs (1-4)](http://plugable.com/products/usb2-hub7bc) |
| x350 | [USB cables](http://www.monoprice.com/Product?c_id=103&cp_id=10303&cs_id=1030307&p_id=5456&seq=1&format=2) |
| x350 | Android Devices |

### Server Components

These components are for the PC where the USB devices are connected. Our operating system of choice is [Debian](https://www.debian.org/), but any other Linux or BSD distribution should do fine. Be sure to use reasonably recent kernels, though, as they often include improvements for the USB subsystem.

Each node will be able to provide 28 devices using powered USB hubs, and about 10 more if you're willing to use the motherboard's USB ports, which is usually not recommended for stability reasons. Note that our component selection is somewhat limited by their availability in Japan. I adopted this especication as suggested by STF team.

This especification is for only one server. For our setup we need 13.

| Component | Recommendation | How many / node |
|-----------|---------|----------|
| PC case | [XIGMATEK Nebula](http://www.xigmatek.com/product.php?productid=219) | x1 |
| Motherboard | [ASUS H97I-PLUS](https://www.asus.com/Motherboards/H97IPLUS/) | x1 |
| Processor | [Intel® Core™ i5-4460](http://ark.intel.com/products/80817/Intel-Core-i5-4460-Processor-6M-Cache-up-to-3_40-GHz) | x1 |
| PSU | [Corsair CX Series™ Modular CX430M ATX Power Supply](http://www.corsair.com/en/cx-series-cx430m-modular-atx-power-supply-430-watt-80-plus-bronze-certified-modular-psu) | x1 |
| Memory | Your favorite DDR3 1600 MHz 8GB stick | x1 |
| SSD | [A-DATA Premier Pro SP900 64GB SSD](http://www.adata.com/en/ssd/specification/171) | x1 |
| USB extension card | [StarTech.com 4 Port PCI Express (PCIe) SuperSpeed USB 3.0 Card Adapter w/ 4 Dedicated 5Gbps Channels - UASP - SATA / LP4 Power](http://www.startech.com/Cards-Adapters/USB-3.0/Cards/PCI-Express-USB-3-Card-4-Dedicated-Channels-4-Port~PEXUSB3S44V) | x1 |
| USB hub | [Plugable USB 2.0 7 Port Hub with 60W Power Adapter](http://plugable.com/products/usb2-hub7bc) | x4 |
| MicroUSB cable | [Monoprice.com 1.5ft USB 2.0 A Male to Micro 5pin Male 28/24AWG Cable w/ Ferrite Core (Gold Plated)](http://www.monoprice.com/Product?c_id=103&cp_id=10303&cs_id=1030307&p_id=5456&seq=1&format=2) | x28 |

You may also need extension cords for power.
