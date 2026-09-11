# T4 Phase 5 — 지능형 로봇 시스템

> 학부 교과 **지능형로봇시스템(3학년 2학기, 이론실습병행 3학점)** · 선이수 = 인공지능피지컬컴퓨팅
> 교과목해설: "로봇의 센서와 액추에이터, 로봇 제어, 경로 계획, 자율주행 등의 기술을 배우며, 실제 로봇 시스템을 구축하고 동작시키는 방법을 실습을 통해 익히게 된다"
>
> ※ 선이수로 지정된 **인공지능피지컬컴퓨팅**은 2026학년도 교육과정표에 없다. 교과목해설 페이지에만 남아 있는 과목이다 — 5-A에서 저장소 자료로 대신 채웠다.

- 목표: 시뮬레이터 위에서 도는 로봇 노드를 직접 만들고, 센서 값으로 움직임을 바꾼다.
- 분량: 약 22시간
- 마지막 학습일: (미학습)

> **중복 안내**: 이 Phase의 강의는 **로보틱스 로드맵**이 훨씬 넓고 깊게 다룬다. 여기는 **학부 한 과목 분량으로 압축한 자체 체크박스**다. 로보틱스 로드맵에서 이미 본 강의는 학습일을 그대로 옮겨 적는다. 로봇 쪽으로 진로를 잡을 생각이면 이 Phase 대신 로보틱스 로드맵을 통째로 도는 편이 낫다.

## 이 단계가 끝나면 할 수 있어야 하는 것

- 센서와 액추에이터가 회로 위에서 어떻게 연결되는지 그린다
- ROS 2의 노드·토픽·서비스가 각각 어떤 통신 방식인지 구분하고 골라 쓴다
- 퍼블리셔와 서브스크라이버를 파이썬으로 직접 짠다
- URDF로 로봇을 기술하고 시뮬레이터에 띄운다
- 순기구학과 역기구학이 각각 무엇을 계산하는지 말한다
- 경로 계획 알고리즘(RRT·PRM 등)이 [T1 Phase 4](../T1%20프로그래밍%20기초와%20알고리즘/04%20Phase%204%20-%20인공지능%20알고리즘%20탐색과%20최적화.md)의 탐색과 같은 문제임을 안다

## 5-A. 센서·액추에이터와 회로 — 피지컬 컴퓨팅 대체

메인: Hands-on Internet of Things, `Course 1 - IoT Devices`. 사라진 선이수 과목(인공지능피지컬컴퓨팅)의 자리를 메운다

- [ ] [01 Lecture 1 - Introduction to IoT Hardware.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/01%20Lecture%201%20-%20Introduction%20to%20IoT%20Hardware.md)
- [ ] [02 Lecture 2 - Background - Electrical Circuit Design.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/02%20Lecture%202%20-%20Background%20-%20Electrical%20Circuit%20Design.md)
- [ ] [03 Lecture 3 - Use Case - Something That Lights Up.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/03%20Lecture%203%20-%20Use%20Case%20-%20Something%20That%20Lights%20Up.md)
- [ ] [04 Lecture 4 - Use Case - Something That Uses Electricity.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/04%20Lecture%204%20-%20Use%20Case%20-%20Something%20That%20Uses%20Electricity.md)
- [ ] [05 Lecture 5 - Use Case - Something That Moves.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/05%20Lecture%205%20-%20Use%20Case%20-%20Something%20That%20Moves.md)
- [ ] [06 Lecture 6 - Use Case - Something That Observes.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/06%20Lecture%206%20-%20Use%20Case%20-%20Something%20That%20Observes.md)
- [ ] [07 Lecture 7 - Useful Circuits.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%202%20-%20IoT%20Circuits/07%20Lecture%207%20-%20Useful%20Circuits.md)

- [ ] [01 Lecture 1 - Integrated Circuits in Practice.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%203%20-%20IoT%20Devices%20Architecture/01%20Lecture%201%20-%20Integrated%20Circuits%20in%20Practice.md)
- [ ] [02 Lecture 2 - Data Encoding - Challenges.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%203%20-%20IoT%20Devices%20Architecture/02%20Lecture%202%20-%20Data%20Encoding%20-%20Challenges.md)
- [ ] [03 Lecture 3 - Data Encoding - Approaches.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%203%20-%20IoT%20Devices%20Architecture/03%20Lecture%203%20-%20Data%20Encoding%20-%20Approaches.md)
- [ ] [04 Lecture 4 - Microcontrollers.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%203%20-%20IoT%20Devices%20Architecture/04%20Lecture%204%20-%20Microcontrollers.md)
- [ ] [05 Lecture 5 - Programmable Circuits.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%203%20-%20IoT%20Devices%20Architecture/05%20Lecture%205%20-%20Programmable%20Circuits.md)

- [ ] [01 Lecture 1 - IoT Platform Design and Programming.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%204%20-%20Arduino%20Programming%20and%20Lab%20Submission/01%20Lecture%201%20-%20IoT%20Platform%20Design%20and%20Programming.md)
- [ ] [02 Lecture 2 - Arduino Programming.md](../../../courses/mooc/Others/Hands-on%20Internet%20of%20Things/Course%201%20-%20IoT%20Devices/Module%204%20-%20Arduino%20Programming%20and%20Lab%20Submission/02%20Lecture%202%20-%20Arduino%20Programming.md)

## 5-B. ROS 2 — 로봇 소프트웨어의 표준

메인: ROS 2 for Beginners (ROS Jazzy · 2026)

Section 2~3 — 설치와 첫 프로그램

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/01 Intro.md>)
- [ ] [02 Which ROS 2 Distribution to Use.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/02 Which ROS 2 Distribution to Use.md>)
- [ ] [03 Install Ubuntu 24.04 on a Virtual Machine (VirtualBox).md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/03 Install Ubuntu 24.04 on a Virtual Machine (VirtualBox).md>)
- [ ] [04 Note - New extension for VS Code.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/04 Note - New extension for VS Code.md>)
- [ ] [05 Programming Tools I Will Use During this Course.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/05 Programming Tools I Will Use During this Course.md>)
- [ ] [06 Install ROS 2 Jazzy on Ubuntu 24.04.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/06 Install ROS 2 Jazzy on Ubuntu 24.04.md>)
- [ ] [07 Set up your Environment for ROS 2.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/07 Set up your Environment for ROS 2.md>)
- [ ] [08 Launch a ROS 2 Program!.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/08 Launch a ROS 2 Program!.md>)
- [ ] [09 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 2 - Install ROS2 and Setup Your Environment/09 Section Conclusion.md>)

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/01 Intro.md>)
- [ ] [02 Create a ROS 2 Workspace.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/02 Create a ROS 2 Workspace.md>)
- [ ] [03 Create a Python Package.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/03 Create a Python Package.md>)
- [ ] [04 Create a C++ Package.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/04 Create a C++ Package.md>)
- [ ] [05 What is a ROS2 Node.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/05 What is a ROS2 Node.md>)
- [ ] [06 Write a Python Node - Minimal Code.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/06 Write a Python Node - Minimal Code.md>)
- [ ] [07 Write a Python Node - With OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/07 Write a Python Node - With OOP.md>)
- [ ] [08 Write a C++ Node - Minimal Code.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/08 Write a C++ Node - Minimal Code.md>)
- [ ] [09 Write a C++ Node - With OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/09 Write a C++ Node - With OOP.md>)
- [ ] [10 OOP Template for Your Nodes.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/10 OOP Template for Your Nodes.md>)
- [ ] [11 More about the ROS 2 Client Libraries for Different Languages.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/11 More about the ROS 2 Client Libraries for Different Languages.md>)
- [ ] [12 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 3 - Write Your First ROS 2 Program/12 Section Conclusion.md>)

Section 4~5 — 도구와 토픽. **노드끼리 값을 주고받는 기본 방식**

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/01 Intro.md>)
- [ ] [02 Introspect Your Nodes With ros2 cli.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/02 Introspect Your Nodes With ros2 cli.md>)
- [ ] [03 Rename a Node at Runtime.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/03 Rename a Node at Runtime.md>)
- [ ] [04 Colcon.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/04 Colcon.md>)
- [ ] [05 Rqt and rqt_graph.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/05 Rqt and rqt_graph.md>)
- [ ] [06 Discover Turtlesim.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/06 Discover Turtlesim.md>)
- [ ] [07 Activity 01.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/07 Activity 01.md>)
- [ ] [08 Activity 01 - Solution.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/08 Activity 01 - Solution.md>)
- [ ] [09 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 4 - Introduction to ROS 2 Tools/09 Section Conclusion.md>)

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/01 Intro.md>)
- [ ] [02 What is a ROS 2 Topic.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/02 What is a ROS 2 Topic.md>)
- [ ] [03 Write a Python Publisher.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/03 Write a Python Publisher.md>)
- [ ] [04 Write a Python Subscriber.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/04 Write a Python Subscriber.md>)
- [ ] [05 Write a C++ Publisher.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/05 Write a C++ Publisher.md>)
- [ ] [06 Write a C++ Subscriber.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/06 Write a C++ Subscriber.md>)
- [ ] [07 Introspect ROS 2 Topics with Command Line Tools.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/07 Introspect ROS 2 Topics with Command Line Tools.md>)
- [ ] [08 Remap a Topic at Runtime.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/08 Remap a Topic at Runtime.md>)
- [ ] [09 Monitor Topics With rqt and rqt_graph.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/09 Monitor Topics With rqt and rqt_graph.md>)
- [ ] [10 Experiment on Topics with Turtlesim.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/10 Experiment on Topics with Turtlesim.md>)
- [ ] [11 Activity 02 - ROS2 Topics.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/11 Activity 02 - ROS2 Topics.md>)
- [ ] [12 Activity 02 - Solution [1-2].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/12 Activity 02 - Solution [1-2].md>)
- [ ] [13 Activity 02 - Solution [2-2].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/13 Activity 02 - Solution [2-2].md>)
- [ ] [14 Extra - Replay Topic Data with Bags.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/14 Extra - Replay Topic Data with Bags.md>)
- [ ] [15 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other/15 Section Conclusion.md>)

Section 6~7 — 서비스와 커스텀 인터페이스

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/01 Intro.md>)
- [ ] [02 What is a ROS 2 Service.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/02 What is a ROS 2 Service.md>)
- [ ] [03 Write a Python Service Server.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/03 Write a Python Service Server.md>)
- [ ] [04 Write a Python Service Client - no OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/04 Write a Python Service Client - no OOP.md>)
- [ ] [05 Write a Python Service Client - OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/05 Write a Python Service Client - OOP.md>)
- [ ] [06 Write a C++ Service Server.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/06 Write a C++ Service Server.md>)
- [ ] [07 Write a C++ Service Client - no OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/07 Write a C++ Service Client - no OOP.md>)
- [ ] [08 Write a C++ Service Client - OOP.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/08 Write a C++ Service Client - OOP.md>)
- [ ] [09 Introspect Services with the ros2 Command Line.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/09 Introspect Services with the ros2 Command Line.md>)
- [ ] [10 Remap a Service at Runtime.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/10 Remap a Service at Runtime.md>)
- [ ] [11 Experiment on Services with Turtlesim.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/11 Experiment on Services with Turtlesim.md>)
- [ ] [12 Activitiy 03 - ROS 2 Services.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/12 Activitiy 03 - ROS 2 Services.md>)
- [ ] [13 Activity 03 - Solution.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/13 Activity 03 - Solution.md>)
- [ ] [14 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 6 - ROS 2 Services - Client-Server Communication Between Nodes/14 Section Conclusion.md>)

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/01 Intro.md>)
- [ ] [02 What are ROS 2 Interfaces.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/02 What are ROS 2 Interfaces.md>)
- [ ] [03 Create and Build Your First Custom Msg.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/03 Create and Build Your First Custom Msg.md>)
- [ ] [04 Use Your Custom Msg in a Python Node.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/04 Use Your Custom Msg in a Python Node.md>)
- [ ] [05 Use Your Custom Msg in a C++ Node.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/05 Use Your Custom Msg in a C++ Node.md>)
- [ ] [06 Create and Build Your First Custom Srv.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/06 Create and Build Your First Custom Srv.md>)
- [ ] [07 Introspect Interfaces with the ros2 Command Line.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/07 Introspect Interfaces with the ros2 Command Line.md>)
- [ ] [08 Activity 04 - ROS 2 Custom Interfaces.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/08 Activity 04 - ROS 2 Custom Interfaces.md>)
- [ ] [09 Activity 04 - Solution [1-3].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/09 Activity 04 - Solution [1-3].md>)
- [ ] [10 Activity 04 - Solution [2-3].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/10 Activity 04 - Solution [2-3].md>)
- [ ] [11 Activity 04 - Solution [3-3].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/11 Activity 04 - Solution [3-3].md>)
- [ ] [12 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/12 Section Conclusion.md>)

Section 8~10 — 파라미터·런치·종합 프로젝트

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/01 Intro.md>)
- [ ] [02 What is a ROS 2 Parameter.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/02 What is a ROS 2 Parameter.md>)
- [ ] [03 Using Parameters in your Python Nodes.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/03 Using Parameters in your Python Nodes.md>)
- [ ] [04 Using Parameters in your C++ Nodes.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/04 Using Parameters in your C++ Nodes.md>)
- [ ] [05 Experiment on Parameters with Turtlesim.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/05 Experiment on Parameters with Turtlesim.md>)
- [ ] [06 YAML Parameter Files.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/06 YAML Parameter Files.md>)
- [ ] [07 Activity 05 - ROS 2 Parameters.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/07 Activity 05 - ROS 2 Parameters.md>)
- [ ] [08 Activity 05 - Solution [1-2].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/08 Activity 05 - Solution [1-2].md>)
- [ ] [09 Activity 05 - Solution [2-2].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/09 Activity 05 - Solution [2-2].md>)
- [ ] [10 Extra - Parameter Callbacks.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/10 Extra - Parameter Callbacks.md>)
- [ ] [11 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 8 - Change Node Settings at Runtime with ROS 2 Parameters/11 Section Conclusion.md>)

- [ ] [01 Intro.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/01 Intro.md>)
- [ ] [02 What is a ROS 2 Launch File.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/02 What is a ROS 2 Launch File.md>)
- [ ] [03 Create and Install a Launch File (XML).md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/03 Create and Install a Launch File (XML).md>)
- [ ] [04 Python Launch Files (Python vs XML).md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/04 Python Launch Files (Python vs XML).md>)
- [ ] [05 Remappings in a Launch File.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/05 Remappings in a Launch File.md>)
- [ ] [06 Load Parameters in a Launch File.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/06 Load Parameters in a Launch File.md>)
- [ ] [07 Add Namespaces to Your Nodes.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/07 Add Namespaces to Your Nodes.md>)
- [ ] [08 Activity 06 - ROS 2 Launch Files.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/08 Activity 06 - ROS 2 Launch Files.md>)
- [ ] [09 Activity 06 - Solution.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/09 Activity 06 - Solution.md>)
- [ ] [10 Section Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 9 - Scale Your Application With ROS 2 Launch Files/10 Section Conclusion.md>)

- [ ] [01 Turtlesim Project - Final Result Overview.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/01 Turtlesim Project - Final Result Overview.md>)
- [ ] [02 Your Challenge.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/02 Your Challenge.md>)
- [ ] [03 Some Tips to Get Started.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/03 Some Tips to Get Started.md>)
- [ ] [04 Project Solution [1-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/04 Project Solution [1-6].md>)
- [ ] [05 Project Solution [2-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/05 Project Solution [2-6].md>)
- [ ] [06 Project Solution [3-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/06 Project Solution [3-6].md>)
- [ ] [07 Project Solution [4-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/07 Project Solution [4-6].md>)
- [ ] [08 Project Solution [5-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/08 Project Solution [5-6].md>)
- [ ] [09 Project Solution [6-6].md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/09 Project Solution [6-6].md>)
- [ ] [10 Project Conclusion.md](<../../../courses/udemy/ROS 2 for Beginners (ROS Jazzy - 2026)/Section 10 - Complete Project With Turtlesim/10 Project Conclusion.md>)

## 5-C. 로봇 모델링과 제어

메인: Robotics and ROS 2 - Learn by Doing! Manipulators

Section 4 — 디지털 트윈(URDF·시뮬레이터)

- [ ] [01 Robot Description.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/01%20Robot%20Description.md)
- [ ] [02 URDF.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/02%20URDF.md)
- [ ] [03 [LAB] Create the URDF Model.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/03%20[LAB]%20Create%20the%20URDF%20Model.md)
- [ ] [04 [LAB] Complete the URDF Model.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/04%20[LAB]%20Complete%20the%20URDF%20Model.md)
- [ ] [05 RViz 2.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/05%20RViz%202.md)
- [ ] [06 Parameters.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/06%20Parameters.md)
- [ ] [07 [PY] Parameters.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/07%20[PY]%20Parameters.md)
- [ ] [08 [C++] Parameters.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/08%20[C++]%20Parameters.md)
- [ ] [09 [LAB] ROS 2 Parameter CLI.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/09%20[LAB]%20ROS%202%20Parameter%20CLI.md)
- [ ] [10 퀴즈 3 - URDF and Parameters.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/10%20퀴즈%203%20-%20URDF%20and%20Parameters.md)
- [ ] [11 [LAB] Visualize the Robot.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/11%20[LAB]%20Visualize%20the%20Robot.md)
- [ ] [12 Launch Files.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/12%20Launch%20Files.md)
- [ ] [13 [LAB] Visualize the Robot with Launch Files.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/13%20[LAB]%20Visualize%20the%20Robot%20with%20Launch%20Files.md)
- [ ] [14 과제 1 - Add an RGB Camera to your Robot.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/14%20과제%201%20-%20Add%20an%20RGB%20Camera%20to%20your%20Robot.md)
- [ ] [15 Gazebo.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/15%20Gazebo.md)
- [ ] [16 [LAB] Simulate the Robot.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/16%20[LAB]%20Simulate%20the%20Robot.md)
- [ ] [17 [LAB] Launch the Simulation.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/17%20[LAB]%20Launch%20the%20Simulation.md)
- [ ] [18 과제 2 - Simulate an RGB Camera in Gazebo.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%204%20-%20Digital%20Twin/18%20과제%202%20-%20Simulate%20an%20RGB%20Camera%20in%20Gazebo.md)

Section 5 — 제어

- [ ] [01 ROS 2 Control.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/01%20ROS%202%20Control.md)
- [ ] [02 Control Types.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/02%20Control%20Types.md)
- [ ] [03 [LAB] ros2_control with Gazebo.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/03%20[LAB]%20ros2_control%20with%20Gazebo.md)
- [ ] [04 YAML Configuration File.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/04%20YAML%20Configuration%20File.md)
- [ ] [05 [LAB] Configure ros2_control.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/05%20[LAB]%20Configure%20ros2_control.md)
- [ ] [06 [LAB] Launch the Controller.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/06%20[LAB]%20Launch%20the%20Controller.md)
- [ ] [07 [LAB] ros2_control CLI.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%205%20-%20Control/07%20[LAB]%20ros2_control%20CLI.md)

Section 6 — 기구학 (선택 — 수학이 무거우면 개념만)

- [ ] [01 Robot Kinematics.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/01%20Robot%20Kinematics.md)
- [ ] [02 Pose of a Robot Arm.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/02%20Pose%20of%20a%20Robot%20Arm.md)
- [ ] [03 Translation Vector.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/03%20Translation%20Vector.md)
- [ ] [04 Elementary Rotations.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/04%20Elementary%20Rotations.md)
- [ ] [05 Rotation Matrix.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/05%20Rotation%20Matrix.md)
- [ ] [06 Transformation Matrix.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/06%20Transformation%20Matrix.md)
- [ ] [07 Forward Kinematics.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/07%20Forward%20Kinematics.md)
- [ ] [08 TF2 Library.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/08%20TF2%20Library.md)
- [ ] [09 [LAB] TF2 Tools.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/09%20[LAB]%20TF2%20Tools.md)
- [ ] [10 ROS 2 Services.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/10%20ROS%202%20Services.md)
- [ ] [11 [PY] Service Server.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/11%20[PY]%20Service%20Server.md)
- [ ] [12 [C++] Service Server.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/12%20[C++]%20Service%20Server.md)
- [ ] [13 Static and Dynamic Transformations.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/13%20Static%20and%20Dynamic%20Transformations.md)
- [ ] [14 [PY] Service Client.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/14%20[PY]%20Service%20Client.md)
- [ ] [15 [C++] Service Client.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/15%20[C++]%20Service%20Client.md)
- [ ] [16 Angle Representations.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/16%20Angle%20Representations.md)
- [ ] [17 Euler Angles.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/17%20Euler%20Angles.md)
- [ ] [18 Quaternion.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/18%20Quaternion.md)
- [ ] [19 [PY] Euler to Quaternion Service.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/19%20[PY]%20Euler%20to%20Quaternion%20Service.md)
- [ ] [20 [C++] Euler to Quaternion Service.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/20%20[C++]%20Euler%20to%20Quaternion%20Service.md)
- [ ] [21 Inverse Kinematics.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/21%20Inverse%20Kinematics.md)
- [ ] [22 MoveIt! 2.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/22%20MoveIt!%202.md)
- [ ] [23 [LAB] Configure MoveIt! 2.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/23%20[LAB]%20Configure%20MoveIt!%202.md)
- [ ] [24 [LAB] Launch MoveIt! 2.md](../../../courses/udemy/Robotics%20and%20ROS%202%20-%20Learn%20by%20Doing!%20Manipulators/Section%206%20-%20Kinematics/24%20[LAB]%20Launch%20MoveIt!%202.md)

## 5-D. 경로 계획 — 이론

함께 보기: Modern Robotics, `Course 4 - Robot Motion Planning and Control` Module 1~2. **[T1 Phase 4](../T1%20프로그래밍%20기초와%20알고리즘/04%20Phase%204%20-%20인공지능%20알고리즘%20탐색과%20최적화.md)의 탐색이 여기서 물리 공간으로 확장된다**

- [ ] [01 Overview of Motion Planning (Chapter 10.1).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 1 - Chapter 10 - Motion/01 Overview of Motion Planning (Chapter 10.1).md>)
- [ ] [02 C-Space Obstacles (Chapter 10.2.1).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 1 - Chapter 10 - Motion/02 C-Space Obstacles (Chapter 10.2.1).md>)
- [ ] [03 Graphs and Trees (Chapter 10.2.3).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 1 - Chapter 10 - Motion/03 Graphs and Trees (Chapter 10.2.3).md>)
- [ ] [04 Graph Search (Chapter 10.2.4).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 1 - Chapter 10 - Motion/04 Graph Search (Chapter 10.2.4).md>)
- [ ] [05 Complete Path Planners (Chapter 10.3).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 1 - Chapter 10 - Motion/05 Complete Path Planners (Chapter 10.3).md>)

- [ ] [01 Grid Methods for Motion Planning (Chapter 10.4).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 2 - Chapter 10 - Motion/01 Grid Methods for Motion Planning (Chapter 10.4).md>)
- [ ] [02 Sampling Methods for Motion Planning (Chapter 10.5, Part 1 of 2).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 2 - Chapter 10 - Motion/02 Sampling Methods for Motion Planning (Chapter.md>)
- [ ] [03 Sampling Methods for Motion Planning (Chapter 10.5, Part 2 of 2).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 2 - Chapter 10 - Motion/03 Sampling Methods for Motion Planning (Chapter.md>)
- [ ] [04 Virtual Potential Fields (Chapter 10.6).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 2 - Chapter 10 - Motion/04 Virtual Potential Fields (Chapter 10.6).md>)
- [ ] [05 Nonlinear Optimization (Chapter 10.7).md](<../../../courses/mooc/Robotics/Modern Robotics - Mechanics/Course 4 - Robot Motion Planning/Module 2 - Chapter 10 - Motion/05 Nonlinear Optimization (Chapter 10.7).md>)

## 산출물

시뮬레이터에서 도는 ROS 2 패키지 하나.

1. 노드 2개 이상이 토픽으로 통신 — 하나는 센서 값(또는 시뮬레이션 값)을 발행, 하나는 그걸 받아 움직임을 결정
2. 런치 파일 하나로 전체를 띄운다
3. 파라미터로 동작을 바꿀 수 있게 한다 (속도·임계값 등)
4. **비전을 붙인다면 가산점**: [Phase 4](04%20Phase%204%20-%20컴퓨터비전%20응용.md)의 객체 탐지 결과를 토픽으로 발행해 로봇이 반응하게 한다. 학부 교과목해설의 "자율주행"에 가장 가까운 형태다

## 다음 단계

→ 트랙 완료. [T5 AI 서비스 개발과 인프라](../T5%20AI%20서비스%20개발과%20인프라/README.md) 로 넘어간다.
