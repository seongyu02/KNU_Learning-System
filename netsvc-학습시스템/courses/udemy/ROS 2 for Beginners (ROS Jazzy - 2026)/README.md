# ROS 2 for Beginners (ROS Jazzy - 2026)

## 개요

- 플랫폼: Udemy
- 강사: Edouard Renard
- 언어: 영어
- 자막: 한국어 자동, 영어 자동 외
- 마지막 업데이트: 2026년 1월
- 분량: 11개 섹션 · 108개 항목 · 약 13시간
- 강좌 페이지: [Udemy](https://www.udemy.com/course/ros2-for-beginners/)
- 정리 기준: 2026-07-31 Udemy 학습 페이지의 실제 커리큘럼
- 정리 상태: 108개 강의의 실제 대본 또는 문서 본문을 확인해 한국어 노트 작성 완료

Python 또는 C++ 기본 문법과 터미널 사용 경험을 전제로, ROS 1 선행 지식 없이 ROS 2 Jazzy의 핵심 개념과 개발 흐름을 단계별로 학습하는 강좌다.

## 주요 학습 내용

- ROS 2 Jazzy 설치와 Ubuntu 24.04 개발 환경 구성
- 워크스페이스(workspace), 패키지(package), 노드(node)
- Python과 C++ 기반 ROS 2 프로그램 작성
- 토픽(topic), 서비스(service), 커스텀 인터페이스(msg/srv)
- 파라미터(parameter), YAML 설정, 런치 파일(launch file)
- `ros2` CLI, colcon, rqt, rqt_graph, Turtlesim 활용
- 활동 문제와 Turtlesim 최종 프로젝트

## 강의 목록

### Section 1 - Introduction

- [Welcome!](../../mooc/Computer%20Science/Data%20Structures/Course%201%20-%20Algorithmic/Module%201%20-%20Programming/01%20Welcome!.md) — 동영상, 3분
- [What is ROS2, When to use it, and Why?](<Section 1 - Introduction/02 What is ROS2, When to use it, and Why?.md>) — 동영상, 5분
- [How to get the most out of this course](<Section 1 - Introduction/03 How to get the most out of this course.md>) — 문서/활동, 2분

### Section 2 - Install ROS2 and Setup Your Environment

- [Intro](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/01%20Intro.md) — 문서/활동, 1분
- [Which ROS 2 Distribution to Use](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/02%20Which%20ROS%202%20Distribution%20to%20Use.md) — 동영상, 4분
- [Install Ubuntu 24.04 on a Virtual Machine (VirtualBox)](<Section 2 - Install ROS2 and Setup Your Environment/03 Install Ubuntu 24.04 on a Virtual Machine (VirtualBox).md>) — 동영상, 19분
- [Note - New extension for VS Code](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/04%20Note%20-%20New%20extension%20for%20VS%20Code.md) — 문서/활동, 1분
- [Programming Tools I Will Use During this Course](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/05%20Programming%20Tools%20I%20Will%20Use%20During%20this%20Course.md) — 동영상, 5분
- [Install ROS 2 Jazzy on Ubuntu 24.04](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/06%20Install%20ROS%202%20Jazzy%20on%20Ubuntu%2024.04.md) — 동영상, 7분
- [Set up your Environment for ROS 2](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/07%20Set%20up%20your%20Environment%20for%20ROS%202.md) — 동영상, 3분
- [Launch a ROS 2 Program!](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/08%20Launch%20a%20ROS%202%20Program!.md) — 동영상, 2분
- [Section Conclusion](Section%202%20-%20Install%20ROS2%20and%20Setup%20Your%20Environment/09%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 3 - Write Your First ROS 2 Program

- [Intro](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/01%20Intro.md) — 문서/활동, 1분
- [Create a ROS 2 Workspace](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/02%20Create%20a%20ROS%202%20Workspace.md) — 동영상, 5분
- [Create a Python Package](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/03%20Create%20a%20Python%20Package.md) — 동영상, 8분
- [Create a C++ Package](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/04%20Create%20a%20C++%20Package.md) — 동영상, 6분
- [What is a ROS2 Node?](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/05%20What%20is%20a%20ROS2%20Node.md) — 동영상, 6분
- [Write a Python Node - Minimal Code](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/06%20Write%20a%20Python%20Node%20-%20Minimal%20Code.md) — 동영상, 16분
- [Write a Python Node - With OOP](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/07%20Write%20a%20Python%20Node%20-%20With%20OOP.md) — 동영상, 12분
- [Write a C++ Node - Minimal Code](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/08%20Write%20a%20C++%20Node%20-%20Minimal%20Code.md) — 동영상, 16분
- [Write a C++ Node - With OOP](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/09%20Write%20a%20C++%20Node%20-%20With%20OOP.md) — 동영상, 11분
- [OOP Template for Your Nodes](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/10%20OOP%20Template%20for%20Your%20Nodes.md) — 문서/활동, 1분
- [More about the ROS 2 Client Libraries for Different Languages](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/11%20More%20about%20the%20ROS%202%20Client%20Libraries%20for%20Different%20Languages.md) — 동영상, 2분
- [Section Conclusion](Section%203%20-%20Write%20Your%20First%20ROS%202%20Program/12%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 4 - Introduction to ROS 2 Tools

- [Intro](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/01%20Intro.md) — 문서/활동, 1분
- [Introspect Your Nodes With ros2 cli](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/02%20Introspect%20Your%20Nodes%20With%20ros2%20cli.md) — 동영상, 8분
- [Rename a Node at Runtime](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/03%20Rename%20a%20Node%20at%20Runtime.md) — 동영상, 4분
- [Colcon](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/04%20Colcon.md) — 동영상, 5분
- [Rqt and rqt_graph](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/05%20Rqt%20and%20rqt_graph.md) — 동영상, 4분
- [Discover Turtlesim](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/06%20Discover%20Turtlesim.md) — 동영상, 5분
- [Activity 01](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/07%20Activity%2001.md) — 문서/활동, 1분
- [Activity 01 - Solution](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/08%20Activity%2001%20-%20Solution.md) — 동영상, 5분
- [Section Conclusion](Section%204%20-%20Introduction%20to%20ROS%202%20Tools/09%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 5 - ROS 2 Topics - Make Your Nodes Communicate Between Each Other

- [Intro](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/01%20Intro.md) — 문서/활동, 1분
- [What is a ROS 2 Topic?](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/02%20What%20is%20a%20ROS%202%20Topic.md) — 동영상, 8분
- [Write a Python Publisher](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/03%20Write%20a%20Python%20Publisher.md) — 동영상, 20분
- [Write a Python Subscriber](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/04%20Write%20a%20Python%20Subscriber.md) — 동영상, 11분
- [Write a C++ Publisher](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/05%20Write%20a%20C++%20Publisher.md) — 동영상, 18분
- [Write a C++ Subscriber](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/06%20Write%20a%20C++%20Subscriber.md) — 동영상, 13분
- [Introspect ROS 2 Topics with Command Line Tools](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/07%20Introspect%20ROS%202%20Topics%20with%20Command%20Line%20Tools.md) — 동영상, 9분
- [Remap a Topic at Runtime](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/08%20Remap%20a%20Topic%20at%20Runtime.md) — 동영상, 4분
- [Monitor Topics With rqt and rqt_graph](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/09%20Monitor%20Topics%20With%20rqt%20and%20rqt_graph.md) — 동영상, 7분
- [Experiment on Topics with Turtlesim](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/10%20Experiment%20on%20Topics%20with%20Turtlesim.md) — 동영상, 8분
- [Activity 02 - ROS2 Topics](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/11%20Activity%2002%20-%20ROS2%20Topics.md) — 문서/활동, 1분
- [Activity 02 - Solution \[1/2\]](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/12%20Activity%2002%20-%20Solution%20[1-2].md) — 동영상, 11분
- [Activity 02 - Solution \[2/2\]](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/13%20Activity%2002%20-%20Solution%20[2-2].md) — 동영상, 14분
- [Extra: Replay Topic Data with Bags](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/14%20Extra%20-%20Replay%20Topic%20Data%20with%20Bags.md) — 동영상, 10분
- [Section Conclusion](Section%205%20-%20ROS%202%20Topics%20-%20Make%20Your%20Nodes%20Communicate%20Between%20Each%20Other/15%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 6 - ROS 2 Services - Client/Server Communication Between Nodes

- [Intro](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/01%20Intro.md) — 문서/활동, 1분
- [What is a ROS 2 Service?](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/02%20What%20is%20a%20ROS%202%20Service.md) — 동영상, 6분
- [Write a Python Service Server](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/03%20Write%20a%20Python%20Service%20Server.md) — 동영상, 15분
- [Write a Python Service Client - no OOP](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/04%20Write%20a%20Python%20Service%20Client%20-%20no%20OOP.md) — 동영상, 13분
- [Write a Python Service Client - OOP](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/05%20Write%20a%20Python%20Service%20Client%20-%20OOP.md) — 동영상, 13분
- [Write a C++ Service Server](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/06%20Write%20a%20C++%20Service%20Server.md) — 동영상, 14분
- [Write a C++ Service Client - no OOP](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/07%20Write%20a%20C++%20Service%20Client%20-%20no%20OOP.md) — 동영상, 12분
- [Write a C++ Service Client - OOP](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/08%20Write%20a%20C++%20Service%20Client%20-%20OOP.md) — 동영상, 13분
- [Introspect Services with the ros2 Command Line](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/09%20Introspect%20Services%20with%20the%20ros2%20Command%20Line.md) — 동영상, 7분
- [Remap a Service at Runtime](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/10%20Remap%20a%20Service%20at%20Runtime.md) — 동영상, 3분
- [Experiment on Services with Turtlesim](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/11%20Experiment%20on%20Services%20with%20Turtlesim.md) — 동영상, 8분
- [Activitiy 03 - ROS 2 Services](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/12%20Activitiy%2003%20-%20ROS%202%20Services.md) — 문서/활동, 1분
- [Activity 03 - Solution](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/13%20Activity%2003%20-%20Solution.md) — 동영상, 11분
- [Section Conclusion](Section%206%20-%20ROS%202%20Services%20-%20Client-Server%20Communication%20Between%20Nodes/14%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)

- [Intro](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/01 Intro.md>) — 문서/활동, 1분
- [What are ROS 2 Interfaces?](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/02 What are ROS 2 Interfaces.md>) — 동영상, 10분
- [Create and Build Your First Custom Msg](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/03 Create and Build Your First Custom Msg.md>) — 동영상, 12분
- [Use Your Custom Msg in a Python Node](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/04 Use Your Custom Msg in a Python Node.md>) — 동영상, 10분
- [Use Your Custom Msg in a C++ Node](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/05 Use Your Custom Msg in a C++ Node.md>) — 동영상, 9분
- [Create and Build Your First Custom Srv](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/06 Create and Build Your First Custom Srv.md>) — 동영상, 6분
- [Introspect Interfaces with the ros2 Command Line](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/07 Introspect Interfaces with the ros2 Command Line.md>) — 동영상, 5분
- [Activity 04 - ROS 2 Custom Interfaces](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/08 Activity 04 - ROS 2 Custom Interfaces.md>) — 문서/활동, 1분
- [Activity 04 - Solution \[1/3\]](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/09 Activity 04 - Solution [1-3].md>) — 동영상, 11분
- [Activity 04 - Solution \[2/3\]](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/10 Activity 04 - Solution [2-3].md>) — 동영상, 15분
- [Activity 04 - Solution \[3/3\]](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/11 Activity 04 - Solution [3-3].md>) — 동영상, 22분
- [Section Conclusion](<Section 7 - Create Custom ROS 2 Interfaces (Msg and Srv)/12 Section Conclusion.md>) — 문서/활동, 1분

### Section 8 - Change Node Settings at Runtime with ROS 2 Parameters

- [Intro](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/01%20Intro.md) — 문서/활동, 1분
- [What is a ROS 2 Parameter?](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/02%20What%20is%20a%20ROS%202%20Parameter.md) — 동영상, 3분
- [Using Parameters in your Python Nodes](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/03%20Using%20Parameters%20in%20your%20Python%20Nodes.md) — 동영상, 12분
- [Using Parameters in your C++ Nodes](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/04%20Using%20Parameters%20in%20your%20C++%20Nodes.md) — 동영상, 8분
- [Experiment on Parameters with Turtlesim](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/05%20Experiment%20on%20Parameters%20with%20Turtlesim.md) — 동영상, 8분
- [YAML Parameter Files](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/06%20YAML%20Parameter%20Files.md) — 동영상, 10분
- [Activity 05 - ROS 2 Parameters](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/07%20Activity%2005%20-%20ROS%202%20Parameters.md) — 문서/활동, 1분
- [Activity 05 - Solution \[1/2\]](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/08%20Activity%2005%20-%20Solution%20[1-2].md) — 동영상, 6분
- [Activity 05 - Solution \[2/2\]](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/09%20Activity%2005%20-%20Solution%20[2-2].md) — 동영상, 8분
- [Extra: Parameter Callbacks](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/10%20Extra%20-%20Parameter%20Callbacks.md) — 동영상, 11분
- [Section Conclusion](Section%208%20-%20Change%20Node%20Settings%20at%20Runtime%20with%20ROS%202%20Parameters/11%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 9 - Scale Your Application With ROS 2 Launch Files

- [Intro](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/01%20Intro.md) — 문서/활동, 1분
- [What is a ROS 2 Launch File?](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/02%20What%20is%20a%20ROS%202%20Launch%20File.md) — 동영상, 2분
- [Create and Install a Launch File (XML)](<Section 9 - Scale Your Application With ROS 2 Launch Files/03 Create and Install a Launch File (XML).md>) — 동영상, 14분
- [Python Launch Files (Python vs XML)](<Section 9 - Scale Your Application With ROS 2 Launch Files/04 Python Launch Files (Python vs XML).md>) — 동영상, 12분
- [Remappings in a Launch File](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/05%20Remappings%20in%20a%20Launch%20File.md) — 동영상, 7분
- [Load Parameters in a Launch File](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/06%20Load%20Parameters%20in%20a%20Launch%20File.md) — 동영상, 10분
- [Add Namespaces to Your Nodes](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/07%20Add%20Namespaces%20to%20Your%20Nodes.md) — 동영상, 13분
- [Activity 06 - ROS 2 Launch Files](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/08%20Activity%2006%20-%20ROS%202%20Launch%20Files.md) — 문서/활동, 1분
- [Activity 06 - Solution](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/09%20Activity%2006%20-%20Solution.md) — 동영상, 13분
- [Section Conclusion](Section%209%20-%20Scale%20Your%20Application%20With%20ROS%202%20Launch%20Files/10%20Section%20Conclusion.md) — 문서/활동, 1분

### Section 10 - Complete Project With Turtlesim

- [Turtlesim Project - Final Result Overview](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/01%20Turtlesim%20Project%20-%20Final%20Result%20Overview.md) — 동영상, 1분
- [Your Challenge](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/02%20Your%20Challenge.md) — 문서/활동, 2분
- [Some Tips to Get Started](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/03%20Some%20Tips%20to%20Get%20Started.md) — 문서/활동, 3분
- [Project Solution \[1/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/04%20Project%20Solution%20[1-6].md) — 동영상, 32분
- [Project Solution \[2/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/05%20Project%20Solution%20[2-6].md) — 동영상, 20분
- [Project Solution \[3/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/06%20Project%20Solution%20[3-6].md) — 동영상, 19분
- [Project Solution \[4/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/07%20Project%20Solution%20[4-6].md) — 동영상, 24분
- [Project Solution \[5/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/08%20Project%20Solution%20[5-6].md) — 동영상, 8분
- [Project Solution \[6/6\]](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/09%20Project%20Solution%20[6-6].md) — 동영상, 14분
- [Project Conclusion](Section%2010%20-%20Complete%20Project%20With%20Turtlesim/10%20Project%20Conclusion.md) — 문서/활동, 1분

### Section 11 - Conclusion

- [What You've Learned](<Section 11 - Conclusion/01 What You've Learned.md>) — 동영상, 2분
- [What to do next? How to learn more about ROS 2?](<Section 11 - Conclusion/02 What to do next? How to learn more about ROS 2?.md>) — 문서/활동, 1분
- [Bonus Lecture](<Section 11 - Conclusion/03 Bonus Lecture.md>) — 문서/활동, 3분

## 정리 상태

- Udemy의 11개 섹션과 108개 커리큘럼 항목을 실제 순서대로 반영했습니다.
- 파일 번호는 각 섹션에서 `01`부터 다시 시작합니다.
- 각 노트에는 강의 유형, 재생시간과 원본 Udemy 강의 링크를 기록했습니다.
- 영상은 Udemy 자동 대본, 문서·활동은 해당 강의 본문을 기준으로 정리했습니다.
- 자동 음성 인식에서 잘못 표기된 ROS 2 고유명사와 주요 명령은 강의 문맥과 표준 표기에 맞게 교정했습니다.
