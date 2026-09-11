# Microservices with Node JS and React

- 플랫폼: Udemy
- 강사: Stephen Grider
- 구성: 26개 Section, 강의 654개 + 퀴즈 1개, 총 54시간 22분
- 언어: 영어
- 마지막 확인: 2026-07-24
- [원본 강의](https://www.udemy.com/course/microservices-with-node-js-and-react/)

## 개요

Node.js, React, Docker, Kubernetes를 사용해 확장 가능한 전자상거래 애플리케이션을 마이크로서비스 아키텍처로 설계·구현·배포하는 과정이다. 서비스별 데이터 소유권, 이벤트 기반 통신, 데이터 복제, 동시성 제어처럼 분산 시스템에서 발생하는 핵심 문제를 실제 프로젝트를 통해 해결한다.

프런트엔드는 React와 Next.js, 백엔드는 Node.js·Express·TypeScript, 데이터 저장소는 MongoDB·Redis를 사용한다. 서비스 간 이벤트 통신에는 NATS Streaming, 컨테이너 실행과 오케스트레이션에는 Docker·Kubernetes·Skaffold를 사용하며, 테스트와 CI/CD까지 전체 운영 흐름을 다룬다.

## 주요 학습 흐름

- 마이크로서비스 경계와 서비스별 데이터 소유권 설계
- 동기 요청과 이벤트 기반 비동기 통신 비교
- Docker 이미지 및 Kubernetes 인프라 구성
- 인증, 오류 처리, 데이터 모델링과 서비스 단위 테스트
- NATS 기반 이벤트 버스와 서비스 간 데이터 복제
- 이벤트 순서 및 낙관적 동시성 제어
- 주문 만료, Stripe 결제, React 클라이언트 통합
- GitHub Actions 기반 CI/CD와 클라우드 배포

## 선수 지식

- JavaScript와 Express 기본 지식
- 명령줄(command line) 사용 경험
- React 경험은 도움이 되지만 필수는 아님

## Section별 강의 목록

### Section 1 - Fundamental Ideas Around Microservices

- 구성: 강의 9개 + 퀴즈 1개 · 46분
- 마이크로서비스의 정의, 서비스별 데이터 소유권, 동기·비동기 통신의 장단점을 이해한다.

1. [How to Get Help](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/01%20How%20to%20Get%20Help.md)
2. [Course Resources](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/02%20Course%20Resources.md)
3. [What Is a Microservice?](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/03%20What%20Is%20a%20Microservice.md)
4. [Data in Microservices](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/04%20Data%20in%20Microservices.md)
5. [Quiz - Data in Microservices](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/05%20Quiz%20-%20Data%20in%20Microservices.md)
6. [Big Problems with Data](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/06%20Big%20Problems%20with%20Data.md)
7. [Sync Communication Between Services](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/07%20Sync%20Communication%20Between%20Services.md)
8. [Event-Based Communication](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/08%20Event-Based%20Communication.md)
9. [A Crazy Way of Storing Data](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/09%20A%20Crazy%20Way%20of%20Storing%20Data.md)
10. [Pros and Cons of Async Communication](Section%201%20-%20Fundamental%20Ideas%20Around%20Microservices/10%20Pros%20and%20Cons%20of%20Async%20Communication.md)

### Section 2 - A Mini-Microservices App

- 구성: 강의 43개 · 3시간 35분
- 게시글·댓글 서비스와 React 클라이언트, 이벤트 버스를 직접 구성하며 비동기 이벤트 기반 아키텍처를 실습한다.

1. [Important - Optional Boilerplate](Section%202%20-%20A%20Mini-Microservices%20App/01%20Important%20-%20Optional%20Boilerplate.md)
2. [App Overview](Section%202%20-%20A%20Mini-Microservices%20App/02%20App%20Overview.md)
3. [Project Setup](Section%202%20-%20A%20Mini-Microservices%20App/03%20Project%20Setup.md)
4. [Posts Service Creation](Section%202%20-%20A%20Mini-Microservices%20App/04%20Posts%20Service%20Creation.md)
5. [Testing the Posts Service](Section%202%20-%20A%20Mini-Microservices%20App/05%20Testing%20the%20Posts%20Service.md)
6. [Implementing a Comments Service](Section%202%20-%20A%20Mini-Microservices%20App/06%20Implementing%20a%20Comments%20Service.md)
7. [Quick Comments Test](Section%202%20-%20A%20Mini-Microservices%20App/07%20Quick%20Comments%20Test.md)
8. [Note on the React App](Section%202%20-%20A%20Mini-Microservices%20App/08%20Note%20on%20the%20React%20App.md)
9. [Addressing Default Export and ReactDom.render Warnings](Section%202%20-%20A%20Mini-Microservices%20App/09%20Addressing%20Default%20Export%20and%20ReactDom.render%20Warnings.md)
10. [React Project Setup](Section%202%20-%20A%20Mini-Microservices%20App/10%20React%20Project%20Setup.md)
11. [Building Post Submission](Section%202%20-%20A%20Mini-Microservices%20App/11%20Building%20Post%20Submission.md)
12. [Handling CORS Errors](Section%202%20-%20A%20Mini-Microservices%20App/12%20Handling%20CORS%20Errors.md)
13. [Fetching and Rendering Posts](Section%202%20-%20A%20Mini-Microservices%20App/13%20Fetching%20and%20Rendering%20Posts.md)
14. [Creating Comments](Section%202%20-%20A%20Mini-Microservices%20App/14%20Creating%20Comments.md)
15. [Displaying Comments](Section%202%20-%20A%20Mini-Microservices%20App/15%20Displaying%20Comments.md)
16. [Completed React App](Section%202%20-%20A%20Mini-Microservices%20App/16%20Completed%20React%20App.md)
17. [Request Minimization Strategies](Section%202%20-%20A%20Mini-Microservices%20App/17%20Request%20Minimization%20Strategies.md)
18. [An Async Solution](Section%202%20-%20A%20Mini-Microservices%20App/18%20An%20Async%20Solution.md)
19. [Common Questions Around Async Events](Section%202%20-%20A%20Mini-Microservices%20App/19%20Common%20Questions%20Around%20Async%20Events.md)
20. [Event Bus Overview](Section%202%20-%20A%20Mini-Microservices%20App/20%20Event%20Bus%20Overview.md)
21. [Important Note about Node and Unhandled Promise Rejections](Section%202%20-%20A%20Mini-Microservices%20App/21%20Important%20Note%20about%20Node%20and%20Unhandled%20Promise%20Rejections.md)
22. [A Basic Event Bus Implementation](Section%202%20-%20A%20Mini-Microservices%20App/22%20A%20Basic%20Event%20Bus%20Implementation.md)
23. [Emitting Events](Section%202%20-%20A%20Mini-Microservices%20App/23%20Emitting%20Events.md)
24. [Emitting Comment Creation Events](Section%202%20-%20A%20Mini-Microservices%20App/24%20Emitting%20Comment%20Creation%20Events.md)
25. [Receiving Events](Section%202%20-%20A%20Mini-Microservices%20App/25%20Receiving%20Events.md)
26. [Creating the Data Query Service](Section%202%20-%20A%20Mini-Microservices%20App/26%20Creating%20the%20Data%20Query%20Service.md)
27. [Parsing Incoming Events](Section%202%20-%20A%20Mini-Microservices%20App/27%20Parsing%20Incoming%20Events.md)
28. [Using the Query Service](Section%202%20-%20A%20Mini-Microservices%20App/28%20Using%20the%20Query%20Service.md)
29. [Adding a Simple Feature](Section%202%20-%20A%20Mini-Microservices%20App/29%20Adding%20a%20Simple%20Feature.md)
30. [Issues with Comment Filtering](Section%202%20-%20A%20Mini-Microservices%20App/30%20Issues%20with%20Comment%20Filtering.md)
31. [A Second Approach](Section%202%20-%20A%20Mini-Microservices%20App/31%20A%20Second%20Approach.md)
32. [How to Handle Resource Updates](Section%202%20-%20A%20Mini-Microservices%20App/32%20How%20to%20Handle%20Resource%20Updates.md)
33. [Creating the Moderation Service](Section%202%20-%20A%20Mini-Microservices%20App/33%20Creating%20the%20Moderation%20Service.md)
34. [Adding Comment Moderation](Section%202%20-%20A%20Mini-Microservices%20App/34%20Adding%20Comment%20Moderation.md)
35. [Reminder about Error Catching](Section%202%20-%20A%20Mini-Microservices%20App/35%20Reminder%20about%20Error%20Catching.md)
36. [Handling Moderation](Section%202%20-%20A%20Mini-Microservices%20App/36%20Handling%20Moderation.md)
37. [Updating Comment Content](Section%202%20-%20A%20Mini-Microservices%20App/37%20Updating%20Comment%20Content.md)
38. [A Quick Test](Section%202%20-%20A%20Mini-Microservices%20App/38%20A%20Quick%20Test.md)
39. [Rendering Comments by Status](Section%202%20-%20A%20Mini-Microservices%20App/39%20Rendering%20Comments%20by%20Status.md)
40. [Dealing with Missing Events](Section%202%20-%20A%20Mini-Microservices%20App/40%20Dealing%20with%20Missing%20Events.md)
41. [Required Error Handling Update for Query Service](Section%202%20-%20A%20Mini-Microservices%20App/41%20Required%20Error%20Handling%20Update%20for%20Query%20Service.md)
42. [Implementing Event Sync](Section%202%20-%20A%20Mini-Microservices%20App/42%20Implementing%20Event%20Sync.md)
43. [Event Syncing in Action](Section%202%20-%20A%20Mini-Microservices%20App/43%20Event%20Syncing%20in%20Action.md)

### Section 3 - Running Services with Docker

- 구성: 강의 8개 · 30분
- 각 서비스를 Docker 이미지와 컨테이너로 패키징하고 기본 Docker 명령을 익힌다.

1. [Deployment Issues](Section%203%20-%20Running%20Services%20with%20Docker/01%20Deployment%20Issues.md)
2. [Why Docker?](Section%203%20-%20Running%20Services%20with%20Docker/02%20Why%20Docker.md)
3. [Why Kubernetes?](Section%203%20-%20Running%20Services%20with%20Docker/03%20Why%20Kubernetes.md)
4. [Don't Know Docker? Watch This.](Section%203%20-%20Running%20Services%20with%20Docker/04%20Don't%20Know%20Docker%20Watch%20This..md)
5. [Note About Docker Build Output and Buildkit](Section%203%20-%20Running%20Services%20with%20Docker/05%20Note%20About%20Docker%20Build%20Output%20and%20Buildkit.md)
6. [Dockerizing the Posts Service](Section%203%20-%20Running%20Services%20with%20Docker/06%20Dockerizing%20the%20Posts%20Service.md)
7. [Review Some Basic Commands](Section%203%20-%20Running%20Services%20with%20Docker/07%20Review%20Some%20Basic%20Commands.md)
8. [Dockerizing Other Services](Section%203%20-%20Running%20Services%20with%20Docker/08%20Dockerizing%20Other%20Services.md)

### Section 4 - Orchestrating Collections of Services with Kubernetes

- 구성: 강의 43개 · 3시간 25분
- Kubernetes의 Pod·Deployment·Service·Ingress를 구성하고 Skaffold로 개발 워크플로를 자동화한다.

1. [Installing Kubernetes](Section%204%20-%20Orchestrating%20Collections%20of%20Services/01%20Installing%20Kubernetes.md)
2. [IMPORTANT Note for Minikube and MicroK8s Users](Section%204%20-%20Orchestrating%20Collections%20of%20Services/02%20IMPORTANT%20Note%20for%20Minikube%20and%20MicroK8s%20Users.md)
3. [A Kubernetes Tour](Section%204%20-%20Orchestrating%20Collections%20of%20Services/03%20A%20Kubernetes%20Tour.md)
4. [Important Kubernetes Terminology](Section%204%20-%20Orchestrating%20Collections%20of%20Services/04%20Important%20Kubernetes%20Terminology.md)
5. [Notes on Config Files](Section%204%20-%20Orchestrating%20Collections%20of%20Services/05%20Notes%20on%20Config%20Files.md)
6. [Creating a Pod](Section%204%20-%20Orchestrating%20Collections%20of%20Services/06%20Creating%20a%20Pod.md)
7. [ErrImagePull, ErrImageNeverPull and ImagePullBackoff Errors](Section%204%20-%20Orchestrating%20Collections%20of%20Services/07%20ErrImagePull,%20ErrImageNeverPull%20and%20ImagePullBackoff%20Errors.md)
8. [Understanding a Pod Spec](Section%204%20-%20Orchestrating%20Collections%20of%20Services/08%20Understanding%20a%20Pod%20Spec.md)
9. [Common Kubectl Commands](Section%204%20-%20Orchestrating%20Collections%20of%20Services/09%20Common%20Kubectl%20Commands.md)
10. [A Time-Saving Alias](Section%204%20-%20Orchestrating%20Collections%20of%20Services/10%20A%20Time-Saving%20Alias.md)
11. [Introducing Deployments](Section%204%20-%20Orchestrating%20Collections%20of%20Services/11%20Introducing%20Deployments.md)
12. [Creating a Deployment](Section%204%20-%20Orchestrating%20Collections%20of%20Services/12%20Creating%20a%20Deployment.md)
13. [Common Commands Around Deployments](Section%204%20-%20Orchestrating%20Collections%20of%20Services/13%20Common%20Commands%20Around%20Deployments.md)
14. [Updating Deployments](Section%204%20-%20Orchestrating%20Collections%20of%20Services/14%20Updating%20Deployments.md)
15. [Preferred Method for Updating Deployments](Section%204%20-%20Orchestrating%20Collections%20of%20Services/15%20Preferred%20Method%20for%20Updating%20Deployments.md)
16. [Networking With Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/16%20Networking%20With%20Services.md)
17. [Creating a NodePort Service](Section%204%20-%20Orchestrating%20Collections%20of%20Services/17%20Creating%20a%20NodePort%20Service.md)
18. [Accessing NodePort Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/18%20Accessing%20NodePort%20Services.md)
19. [Setting Up Cluster IP Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/19%20Setting%20Up%20Cluster%20IP%20Services.md)
20. [Building a Deployment for the Event Bus](Section%204%20-%20Orchestrating%20Collections%20of%20Services/20%20Building%20a%20Deployment%20for%20the%20Event%20Bus.md)
21. [Adding ClusterIP Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/21%20Adding%20ClusterIP%20Services.md)
22. [How to Communicate Between Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/22%20How%20to%20Communicate%20Between%20Services.md)
23. [Updating Service Addresses](Section%204%20-%20Orchestrating%20Collections%20of%20Services/23%20Updating%20Service%20Addresses.md)
24. [Verifying Communication](Section%204%20-%20Orchestrating%20Collections%20of%20Services/24%20Verifying%20Communication.md)
25. [Adding Query, Moderation and Comments](Section%204%20-%20Orchestrating%20Collections%20of%20Services/25%20Adding%20Query,%20Moderation%20and%20Comments.md)
26. [Testing Communication](Section%204%20-%20Orchestrating%20Collections%20of%20Services/26%20Testing%20Communication.md)
27. [Load Balancer Services](Section%204%20-%20Orchestrating%20Collections%20of%20Services/27%20Load%20Balancer%20Services.md)
28. [Load Balancers and Ingress](Section%204%20-%20Orchestrating%20Collections%20of%20Services/28%20Load%20Balancers%20and%20Ingress.md)
29. [Important - DO NOT SKIP - Ingress Nginx Installation Info](Section%204%20-%20Orchestrating%20Collections%20of%20Services/29%20Important%20-%20DO%20NOT%20SKIP%20-%20Ingress%20Nginx%20Installation%20Info.md)
30. [Installing Ingress-Nginx](Section%204%20-%20Orchestrating%20Collections%20of%20Services/30%20Installing%20Ingress-Nginx.md)
31. [Ingress v1 API Required Update + pathType Warning](Section%204%20-%20Orchestrating%20Collections%20of%20Services/31%20Ingress%20v1%20API%20Required%20Update%20+%20pathType%20Warning.md)
32. [Writing Ingress Config Files](Section%204%20-%20Orchestrating%20Collections%20of%20Services/32%20Writing%20Ingress%20Config%20Files.md)
33. [Important Note About Port 80](Section%204%20-%20Orchestrating%20Collections%20of%20Services/33%20Important%20Note%20About%20Port%2080.md)
34. [Hosts File Tweak](Section%204%20-%20Orchestrating%20Collections%20of%20Services/34%20Hosts%20File%20Tweak.md)
35. [Important Note to Add Environment Variable](Section%204%20-%20Orchestrating%20Collections%20of%20Services/35%20Important%20Note%20to%20Add%20Environment%20Variable.md)
36. [Deploying the React App](Section%204%20-%20Orchestrating%20Collections%20of%20Services/36%20Deploying%20the%20React%20App.md)
37. [Unique Route Paths](Section%204%20-%20Orchestrating%20Collections%20of%20Services/37%20Unique%20Route%20Paths.md)
38. [Final Route Config](Section%204%20-%20Orchestrating%20Collections%20of%20Services/38%20Final%20Route%20Config.md)
39. [Introducing Skaffold](Section%204%20-%20Orchestrating%20Collections%20of%20Services/39%20Introducing%20Skaffold.md)
40. [Skaffold API version Update](Section%204%20-%20Orchestrating%20Collections%20of%20Services/40%20Skaffold%20API%20version%20Update.md)
41. [Skaffold Setup](Section%204%20-%20Orchestrating%20Collections%20of%20Services/41%20Skaffold%20Setup.md)
42. [First Time Skaffold Startup](Section%204%20-%20Orchestrating%20Collections%20of%20Services/42%20First%20Time%20Skaffold%20Startup.md)
43. [A Few Notes on Skaffold](Section%204%20-%20Orchestrating%20Collections%20of%20Services/43%20A%20Few%20Notes%20on%20Skaffold.md)

### Section 5 - Architecture of Multi-Service Apps

- 구성: 강의 13개 · 1시간 6분
- 티켓 판매 애플리케이션의 서비스 경계, 리소스, 이벤트와 전체 인프라 구조를 설계한다.

1. [Big Ticket Items](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/01%20Big%20Ticket%20Items.md)
2. [App Overview](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/02%20App%20Overview.md)
3. [Resource Types](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/03%20Resource%20Types.md)
4. [Service Types](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/04%20Service%20Types.md)
5. [Events and Architecture Design](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/05%20Events%20and%20Architecture%20Design.md)
6. [Note on Typescript](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/06%20Note%20on%20Typescript.md)
7. [Auth Service Setup](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/07%20Auth%20Service%20Setup.md)
8. [Auth K8s Setup](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/08%20Auth%20K8s%20Setup.md)
9. [Adding Skaffold](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/09%20Adding%20Skaffold.md)
10. [Note on Code Reloading](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/10%20Note%20on%20Code%20Reloading.md)
11. [Ingress v1 API Required Update](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/11%20Ingress%20v1%20API%20Required%20Update.md)
12. [Ingress-Nginx Setup](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/12%20Ingress-Nginx%20Setup.md)
13. [Hosts File and Security Warning](Section%205%20-%20Architecture%20of%20Multi-Service%20Apps/13%20Hosts%20File%20and%20Security%20Warning.md)

### Section 6 - Leveraging a Cloud Environment for Development

- 구성: 강의 12개 · 40분
- 클라우드 기반 원격 개발 환경을 구성하고 Kubernetes 애플리케이션을 원격 클러스터에서 실행한다.

1. [Note on Remote Development](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/01%20Note%20on%20Remote%20Development.md)
2. [Remote Dev with Skaffold](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/02%20Remote%20Dev%20with%20Skaffold.md)
3. [Free Google Cloud Trial and Credits](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/03%20Free%20Google%20Cloud%20Trial%20and%20Credits.md)
4. [Google Cloud Initial Setup](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/04%20Google%20Cloud%20Initial%20Setup.md)
5. [Kubernetes Cluster Creation with Autopilot](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/05%20Kubernetes%20Cluster%20Creation%20with%20Autopilot.md)
6. [Kubectl Contexts](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/06%20Kubectl%20Contexts.md)
7. [Initializing the GCloud SDK](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/07%20Initializing%20the%20GCloud%20SDK.md)
8. [Installing the GCloud Context](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/08%20Installing%20the%20GCloud%20Context.md)
9. [Updating the Skaffold Config](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/09%20Updating%20the%20Skaffold%20Config.md)
10. [More Skaffold Updates](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/10%20More%20Skaffold%20Updates.md)
11. [Creating a Load Balancer](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/11%20Creating%20a%20Load%20Balancer.md)
12. [Final Config and Test](Section%206%20-%20Leveraging%20a%20Cloud%20Environment%20for%20Development/12%20Final%20Config%20and%20Test.md)

### Section 7 - Response Normalization Strategies

- 구성: 강의 21개 · 1시간 58분
- Express 서비스 전반에서 오류 응답, 요청 검증과 비동기 오류 처리를 일관되게 정규화한다.

1. [Creating Route Handlers](Section%207%20-%20Response%20Normalization%20Strategies/01%20Creating%20Route%20Handlers.md)
2. [Scaffolding Routes](Section%207%20-%20Response%20Normalization%20Strategies/02%20Scaffolding%20Routes.md)
3. [Adding Validation](Section%207%20-%20Response%20Normalization%20Strategies/03%20Adding%20Validation.md)
4. [Handling Validation Errors](Section%207%20-%20Response%20Normalization%20Strategies/04%20Handling%20Validation%20Errors.md)
5. [Postman HTTPS Issues](Section%207%20-%20Response%20Normalization%20Strategies/05%20Postman%20HTTPS%20Issues.md)
6. [Surprising Complexity Around Errors](Section%207%20-%20Response%20Normalization%20Strategies/06%20Surprising%20Complexity%20Around%20Errors.md)
7. [Other Sources of Errors](Section%207%20-%20Response%20Normalization%20Strategies/07%20Other%20Sources%20of%20Errors.md)
8. [Solution for Error Handling](Section%207%20-%20Response%20Normalization%20Strategies/08%20Solution%20for%20Error%20Handling.md)
9. [Building an Error Handling Middleware](Section%207%20-%20Response%20Normalization%20Strategies/09%20Building%20an%20Error%20Handling%20Middleware.md)
10. [Communicating More Info to the Error Handler](Section%207%20-%20Response%20Normalization%20Strategies/10%20Communicating%20More%20Info%20to%20the%20Error%20Handler.md)
11. [Encoding More Information In an Error](Section%207%20-%20Response%20Normalization%20Strategies/11%20Encoding%20More%20Information%20In%20an%20Error.md)
12. [Subclassing for Custom Errors](Section%207%20-%20Response%20Normalization%20Strategies/12%20Subclassing%20for%20Custom%20Errors.md)
13. [Determining Error Type](Section%207%20-%20Response%20Normalization%20Strategies/13%20Determining%20Error%20Type.md)
14. [Property 'param' does not exist on type 'AlternativeValidationError'](Section%207%20-%20Response%20Normalization%20Strategies/14%20Property%20'param'%20does%20not%20exist%20on%20type%20'AlternativeValidationError'.md)
15. [Converting Errors to Responses](Section%207%20-%20Response%20Normalization%20Strategies/15%20Converting%20Errors%20to%20Responses.md)
16. [Moving Logic Into Errors](Section%207%20-%20Response%20Normalization%20Strategies/16%20Moving%20Logic%20Into%20Errors.md)
17. [serializeErrors' not assignable to the same property in base type 'CustomError'](Section%207%20-%20Response%20Normalization%20Strategies/17%20serializeErrors'%20not%20assignable%20to%20the%20same%20property%20in%20base%20type.md)
18. [Verifying Our Custom Errors](Section%207%20-%20Response%20Normalization%20Strategies/18%20Verifying%20Our%20Custom%20Errors.md)
19. [Final Error Related Code](Section%207%20-%20Response%20Normalization%20Strategies/19%20Final%20Error%20Related%20Code.md)
20. [How to Define New Custom Errors](Section%207%20-%20Response%20Normalization%20Strategies/20%20How%20to%20Define%20New%20Custom%20Errors.md)
21. [Uh Oh... Async Error Handling](Section%207%20-%20Response%20Normalization%20Strategies/21%20Uh%20Oh...%20Async%20Error%20Handling.md)

### Section 8 - Database Management and Modeling

- 구성: 강의 16개 · 1시간 27분
- MongoDB와 Mongoose를 Kubernetes에서 실행하고 TypeScript 친화적인 도메인 모델을 설계한다.

1. [Creating Databases in Kubernetes](Section%208%20-%20Database%20Management%20and%20Modeling/01%20Creating%20Databases%20in%20Kubernetes.md)
2. [Connecting to MongoDB](Section%208%20-%20Database%20Management%20and%20Modeling/02%20Connecting%20to%20MongoDB.md)
3. [Understanding the Signup Flow](Section%208%20-%20Database%20Management%20and%20Modeling/03%20Understanding%20the%20Signup%20Flow.md)
4. [Getting TypeScript and Mongoose to Cooperate](Section%208%20-%20Database%20Management%20and%20Modeling/04%20Getting%20TypeScript%20and%20Mongoose%20to%20Cooperate.md)
5. [Creating the User Model](Section%208%20-%20Database%20Management%20and%20Modeling/05%20Creating%20the%20User%20Model.md)
6. [Type Checking User Properties](Section%208%20-%20Database%20Management%20and%20Modeling/06%20Type%20Checking%20User%20Properties.md)
7. [Adding Static Properties to a Model](Section%208%20-%20Database%20Management%20and%20Modeling/07%20Adding%20Static%20Properties%20to%20a%20Model.md)
8. [Defining Extra Document Properties](Section%208%20-%20Database%20Management%20and%20Modeling/08%20Defining%20Extra%20Document%20Properties.md)
9. [What's That Angle Bracket For?](Section%208%20-%20Database%20Management%20and%20Modeling/09%20What's%20That%20Angle%20Bracket%20For.md)
10. [User Creation](Section%208%20-%20Database%20Management%20and%20Modeling/10%20User%20Creation.md)
11. [Proper Error Handling](Section%208%20-%20Database%20Management%20and%20Modeling/11%20Proper%20Error%20Handling.md)
12. [Note on Password Hashing](Section%208%20-%20Database%20Management%20and%20Modeling/12%20Note%20on%20Password%20Hashing.md)
13. [Reminder on Password Hashing](Section%208%20-%20Database%20Management%20and%20Modeling/13%20Reminder%20on%20Password%20Hashing.md)
14. [Adding Password Hashing](Section%208%20-%20Database%20Management%20and%20Modeling/14%20Adding%20Password%20Hashing.md)
15. [Comparing Hashed Password](Section%208%20-%20Database%20Management%20and%20Modeling/15%20Comparing%20Hashed%20Password.md)
16. [Mongoose Pre-Save Hooks](Section%208%20-%20Database%20Management%20and%20Modeling/16%20Mongoose%20Pre-Save%20Hooks.md)

### Section 9 - Authentication Strategies and Options

- 구성: 강의 26개 · 2시간 48분
- 쿠키와 JWT를 이용한 마이크로서비스 인증 전략, 회원가입·로그인·현재 사용자 확인 흐름을 구현한다.

1. [Fundamental Authentication Strategies](Section%209%20-%20Authentication%20Strategies%20and%20Options/01%20Fundamental%20Authentication%20Strategies.md)
2. [Huge Issues with Authentication Strategies](Section%209%20-%20Authentication%20Strategies%20and%20Options/02%20Huge%20Issues%20with%20Authentication%20Strategies.md)
3. [So Which Option?](Section%209%20-%20Authentication%20Strategies%20and%20Options/03%20So%20Which%20Option.md)
4. [Solving Issues with Option #2](<Section 9 - Authentication Strategies and Options/04 Solving Issues with Option %232.md>)
5. [Reminder on Cookies vs JWT's](Section%209%20-%20Authentication%20Strategies%20and%20Options/05%20Reminder%20on%20Cookies%20vs%20JWT's.md)
6. [Microservices Auth Requirements](Section%209%20-%20Authentication%20Strategies%20and%20Options/06%20Microservices%20Auth%20Requirements.md)
7. [Issues with JWT's and Server Side Rendering](Section%209%20-%20Authentication%20Strategies%20and%20Options/07%20Issues%20with%20JWT's%20and%20Server%20Side%20Rendering.md)
8. [Cookies and Encryption](Section%209%20-%20Authentication%20Strategies%20and%20Options/08%20Cookies%20and%20Encryption.md)
9. [Adding Session Support](Section%209%20-%20Authentication%20Strategies%20and%20Options/09%20Adding%20Session%20Support.md)
10. [Generating a JWT](Section%209%20-%20Authentication%20Strategies%20and%20Options/10%20Generating%20a%20JWT.md)
11. [JWT Signing Keys](Section%209%20-%20Authentication%20Strategies%20and%20Options/11%20JWT%20Signing%20Keys.md)
12. [Securely Storing Secrets with Kubernetes](Section%209%20-%20Authentication%20Strategies%20and%20Options/12%20Securely%20Storing%20Secrets%20with%20Kubernetes.md)
13. [Creating and Accessing Secrets](Section%209%20-%20Authentication%20Strategies%20and%20Options/13%20Creating%20and%20Accessing%20Secrets.md)
14. [Accessing Env Variables in a Pod](Section%209%20-%20Authentication%20Strategies%20and%20Options/14%20Accessing%20Env%20Variables%20in%20a%20Pod.md)
15. [Common Response Properties](Section%209%20-%20Authentication%20Strategies%20and%20Options/15%20Common%20Response%20Properties.md)
16. [Formatting JSON Properties](Section%209%20-%20Authentication%20Strategies%20and%20Options/16%20Formatting%20JSON%20Properties.md)
17. [The Signin Flow](Section%209%20-%20Authentication%20Strategies%20and%20Options/17%20The%20Signin%20Flow.md)
18. [Common Request Validation Middleware](Section%209%20-%20Authentication%20Strategies%20and%20Options/18%20Common%20Request%20Validation%20Middleware.md)
19. [Sign In Logic](Section%209%20-%20Authentication%20Strategies%20and%20Options/19%20Sign%20In%20Logic.md)
20. [Quick Sign In Test](Section%209%20-%20Authentication%20Strategies%20and%20Options/20%20Quick%20Sign%20In%20Test.md)
21. [Current User Handler](Section%209%20-%20Authentication%20Strategies%20and%20Options/21%20Current%20User%20Handler.md)
22. [Returning the Current User](Section%209%20-%20Authentication%20Strategies%20and%20Options/22%20Returning%20the%20Current%20User.md)
23. [Signing Out](Section%209%20-%20Authentication%20Strategies%20and%20Options/23%20Signing%20Out.md)
24. [Creating a Current User Middleware](Section%209%20-%20Authentication%20Strategies%20and%20Options/24%20Creating%20a%20Current%20User%20Middleware.md)
25. [Augmenting Type Definitions](Section%209%20-%20Authentication%20Strategies%20and%20Options/25%20Augmenting%20Type%20Definitions.md)
26. [Requiring Auth for Route Access](Section%209%20-%20Authentication%20Strategies%20and%20Options/26%20Requiring%20Auth%20for%20Route%20Access.md)

### Section 10 - Testing Isolated Microservices

- 구성: 강의 22개 · 1시간 22분
- Jest와 Supertest를 사용해 독립된 마이크로서비스의 라우트, 인증과 오류 동작을 테스트한다.

1. [Scope of Testing](Section%2010%20-%20Testing%20Isolated%20Microservices/01%20Scope%20of%20Testing.md)
2. [Testing Goals](Section%2010%20-%20Testing%20Isolated%20Microservices/02%20Testing%20Goals.md)
3. [Testing Architecture](Section%2010%20-%20Testing%20Isolated%20Microservices/03%20Testing%20Architecture.md)
4. [Index to App Refactor](Section%2010%20-%20Testing%20Isolated%20Microservices/04%20Index%20to%20App%20Refactor.md)
5. [Replacing --only=prod Install Flag](Section%2010%20-%20Testing%20Isolated%20Microservices/05%20Replacing%20--only=prod%20Install%20Flag.md)
6. [A Few Dependencies](Section%2010%20-%20Testing%20Isolated%20Microservices/06%20A%20Few%20Dependencies.md)
7. [Required MongoMemoryServer Updates](Section%2010%20-%20Testing%20Isolated%20Microservices/07%20Required%20MongoMemoryServer%20Updates.md)
8. [Test Environment Setup](Section%2010%20-%20Testing%20Isolated%20Microservices/08%20Test%20Environment%20Setup.md)
9. [Our First Test](Section%2010%20-%20Testing%20Isolated%20Microservices/09%20Our%20First%20Test.md)
10. [An Important Note](Section%2010%20-%20Testing%20Isolated%20Microservices/10%20An%20Important%20Note.md)
11. [Testing Invalid Input](Section%2010%20-%20Testing%20Isolated%20Microservices/11%20Testing%20Invalid%20Input.md)
12. [Requiring Unique Emails](Section%2010%20-%20Testing%20Isolated%20Microservices/12%20Requiring%20Unique%20Emails.md)
13. [Changing Node Env During Tests](Section%2010%20-%20Testing%20Isolated%20Microservices/13%20Changing%20Node%20Env%20During%20Tests.md)
14. [Tests Around Sign In Functionality](Section%2010%20-%20Testing%20Isolated%20Microservices/14%20Tests%20Around%20Sign%20In%20Functionality.md)
15. [Cookie Request is Possibly Undefined Error](Section%2010%20-%20Testing%20Isolated%20Microservices/15%20Cookie%20Request%20is%20Possibly%20Undefined%20Error.md)
16. [Testing Sign Out](Section%2010%20-%20Testing%20Isolated%20Microservices/16%20Testing%20Sign%20Out.md)
17. [Issues with Cookies During Testing](Section%2010%20-%20Testing%20Isolated%20Microservices/17%20Issues%20with%20Cookies%20During%20Testing.md)
18. [No Overload Matches This Call Error with Cookie](Section%2010%20-%20Testing%20Isolated%20Microservices/18%20No%20Overload%20Matches%20This%20Call%20Error%20with%20Cookie.md)
19. [Easy Auth Solution](Section%2010%20-%20Testing%20Isolated%20Microservices/19%20Easy%20Auth%20Solution.md)
20. [globalThis has no index signature TS Error](Section%2010%20-%20Testing%20Isolated%20Microservices/20%20globalThis%20has%20no%20index%20signature%20TS%20Error.md)
21. [Auth Helper Function](Section%2010%20-%20Testing%20Isolated%20Microservices/21%20Auth%20Helper%20Function.md)
22. [Testing Non-Authed Requests](Section%2010%20-%20Testing%20Isolated%20Microservices/22%20Testing%20Non-Authed%20Requests.md)

### Section 11 - Integrating a Server-Side-Rendered React App

- 구성: 강의 40개 · 3시간 1분
- Next.js 기반 서버 사이드 렌더링 React 앱을 서비스들과 연결하고 브라우저·서버 요청 차이를 처리한다.

1. [Starting the React App](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/01%20Starting%20the%20React%20App.md)
2. [Reminder on Server Side Rendering](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/02%20Reminder%20on%20Server%20Side%20Rendering.md)
3. [Suggestion Regarding a Default Export Warning](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/03%20Suggestion%20Regarding%20a%20Default%20Export%20Warning.md)
4. [Basics of Next JS](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/04%20Basics%20of%20Next%20JS.md)
5. [Building a Next Image](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/05%20Building%20a%20Next%20Image.md)
6. [Running Next in Kubernetes](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/06%20Running%20Next%20in%20Kubernetes.md)
7. [Small Update for Custom Webpack Config](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/07%20Small%20Update%20for%20Custom%20Webpack%20Config.md)
8. [Note on File Change Detection](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/08%20Note%20on%20File%20Change%20Detection.md)
9. [Adding Global CSS](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/09%20Adding%20Global%20CSS.md)
10. [Adding a Sign Up Form](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/10%20Adding%20a%20Sign%20Up%20Form.md)
11. [Handling Email and Password Inputs](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/11%20Handling%20Email%20and%20Password%20Inputs.md)
12. [Successful Account Signup](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/12%20Successful%20Account%20Signup.md)
13. [Handling Validation Errors](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/13%20Handling%20Validation%20Errors.md)
14. [The useRequest Hook](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/14%20The%20useRequest%20Hook.md)
15. [Using the useRequest Hook](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/15%20Using%20the%20useRequest%20Hook.md)
16. [An onSuccess Callback](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/16%20An%20onSuccess%20Callback.md)
17. [Overview on Server Side Rendering](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/17%20Overview%20on%20Server%20Side%20Rendering.md)
18. [A note about ECONNREFUSED errors](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/18%20A%20note%20about%20ECONNREFUSED%20errors.md)
19. [Fetching Data During SSR](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/19%20Fetching%20Data%20During%20SSR.md)
20. [Why the Error?](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/20%20Why%20the%20Error.md)
21. [Two Possible Solutions](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/21%20Two%20Possible%20Solutions.md)
22. [Cross Namespace Service Communication](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/22%20Cross%20Namespace%20Service%20Communication.md)
23. [When is GetInitialProps Called?](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/23%20When%20is%20GetInitialProps%20Called.md)
24. [On the Server or the Browser](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/24%20On%20the%20Server%20or%20the%20Browser.md)
25. [Ingress-Nginx Namespace and Service - Important Update](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/25%20Ingress-Nginx%20Namespace%20and%20Service%20-%20Important%20Update.md)
26. [Specifying the Host](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/26%20Specifying%20the%20Host.md)
27. [Passing Through the Cookies](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/27%20Passing%20Through%20the%20Cookies.md)
28. [A Reusable API Client](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/28%20A%20Reusable%20API%20Client.md)
29. [Content on the Landing Page](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/29%20Content%20on%20the%20Landing%20Page.md)
30. [The Sign In Form](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/30%20The%20Sign%20In%20Form.md)
31. [A Reusable Header](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/31%20A%20Reusable%20Header.md)
32. [Moving GetInitialProps](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/32%20Moving%20GetInitialProps.md)
33. [Issues with Custom App GetInitialProps](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/33%20Issues%20with%20Custom%20App%20GetInitialProps.md)
34. [Handling Multiple GetInitialProps](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/34%20Handling%20Multiple%20GetInitialProps.md)
35. [Passing Props Through](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/35%20Passing%20Props%20Through.md)
36. [Error - Invalid `Link` with `a` child](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/36%20Error%20-%20Invalid%20Link%20with%20a%20child.md)
37. [Building the Header](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/37%20Building%20the%20Header.md)
38. [Conditionally Showing Links](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/38%20Conditionally%20Showing%20Links.md)
39. [Signing Out](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/39%20Signing%20Out.md)
40. [React App Catchup & Checkpoint](Section%2011%20-%20Integrating%20a%20Server-Side-Rendered%20React%20App/40%20React%20App%20Catchup%20&%20Checkpoint.md)

### Section 12 - Code Sharing and Reuse Between Services

- 구성: 강의 11개 · 52분
- 여러 Node 서비스가 공유하는 오류·이벤트 코드를 커스텀 NPM 패키지로 배포하고 재사용한다.

1. [Shared Logic Between Services](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/01%20Shared%20Logic%20Between%20Services.md)
2. [Options for Code Sharing](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/02%20Options%20for%20Code%20Sharing.md)
3. [NPM Organizations](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/03%20NPM%20Organizations.md)
4. [Publishing NPM Modules](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/04%20Publishing%20NPM%20Modules.md)
5. [Project Setup](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/05%20Project%20Setup.md)
6. [Typo in package.json "files" Field - Do Not Skip](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/06%20Typo%20in%20package.json%20'files'%20Field%20-%20Do%20Not%20Skip.md)
7. [An Easy Publish Command](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/07%20An%20Easy%20Publish%20Command.md)
8. [Relocating Shared Code](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/08%20Relocating%20Shared%20Code.md)
9. [Updating Import Statements](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/09%20Updating%20Import%20Statements.md)
10. [NPM Update Command](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/10%20NPM%20Update%20Command.md)
11. [Updating the Common Module](Section%2012%20-%20Code%20Sharing%20and%20Reuse%20Between%20Services/11%20Updating%20the%20Common%20Module.md)

### Section 13 - Create-Read-Update-Destroy Server Setup

- 구성: 강의 26개 · 2시간 28분
- 티켓 서비스의 생성·조회·수정 API와 권한·검증·테스트를 구현한다.

1. [Ticketing Service Overview](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/01%20Ticketing%20Service%20Overview.md)
2. [Project Setup](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/02%20Project%20Setup.md)
3. [Running the Ticket Service](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/03%20Running%20the%20Ticket%20Service.md)
4. [Mongo Connection URI](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/04%20Mongo%20Connection%20URI.md)
5. [Quick Auth Update](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/05%20Quick%20Auth%20Update.md)
6. [Test-First Approach](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/06%20Test-First%20Approach.md)
7. [Creating the Router](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/07%20Creating%20the%20Router.md)
8. [Adding Auth Protection](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/08%20Adding%20Auth%20Protection.md)
9. [Faking Authentication During Tests](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/09%20Faking%20Authentication%20During%20Tests.md)
10. [A Required Session Fix and a Global Signin Reminder](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/10%20A%20Required%20Session%20Fix%20and%20a%20Global%20Signin%20Reminder.md)
11. [Building a Session](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/11%20Building%20a%20Session.md)
12. [Testing Request Validation](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/12%20Testing%20Request%20Validation.md)
13. [Validating Title and Price](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/13%20Validating%20Title%20and%20Price.md)
14. [Reminder on Mongoose with TypeScript](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/14%20Reminder%20on%20Mongoose%20with%20TypeScript.md)
15. [Defining the Ticket Model](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/15%20Defining%20the%20Ticket%20Model.md)
16. [Creation via Route Handler](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/16%20Creation%20via%20Route%20Handler.md)
17. [Testing Show Routes](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/17%20Testing%20Show%20Routes.md)
18. [Unexpected Failure!](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/18%20Unexpected%20Failure!.md)
19. [What's that Error?!](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/19%20What's%20that%20Error!.md)
20. [Better Error Logging](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/20%20Better%20Error%20Logging.md)
21. [Complete Index Route Implementation](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/21%20Complete%20Index%20Route%20Implementation.md)
22. [Ticket Updating](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/22%20Ticket%20Updating.md)
23. [Handling Updates](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/23%20Handling%20Updates.md)
24. [Permission Checking](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/24%20Permission%20Checking.md)
25. [Final Update Changes](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/25%20Final%20Update%20Changes.md)
26. [Manual Testing](Section%2013%20-%20Create-Read-Update-Destroy%20Server%20Setup/26%20Manual%20Testing.md)

### Section 14 - NATS Streaming Server - An Event Bus Implementation

- 구성: 강의 23개 · 2시간 57분
- NATS Streaming Server를 이벤트 버스로 구성하고 채널, 구독, 큐 그룹과 내구성 구독을 이해한다.

1. [What Now?](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/01%20What%20Now.md)
2. [NATS Server Status - IMPORTANT NOTE](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/02%20NATS%20Server%20Status%20-%20IMPORTANT%20NOTE.md)
3. [Three Important Items](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/03%20Three%20Important%20Items.md)
4. [Creating a NATS Streaming Deployment](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/04%20Creating%20a%20NATS%20Streaming%20Deployment.md)
5. [Big Notes on NATS Streaming](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/05%20Big%20Notes%20on%20NATS%20Streaming.md)
6. [Building a NATS Test Project](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/06%20Building%20a%20NATS%20Test%20Project.md)
7. [Port-Forwarding with Kubectl](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/07%20Port-Forwarding%20with%20Kubectl.md)
8. [Publishing Events](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/08%20Publishing%20Events.md)
9. [Small Required Command Change](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/09%20Small%20Required%20Command%20Change.md)
10. [Listening For Data](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/10%20Listening%20For%20Data.md)
11. [Accessing Event Data](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/11%20Accessing%20Event%20Data.md)
12. [Client ID Generation](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/12%20Client%20ID%20Generation.md)
13. [Queue Groups](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/13%20Queue%20Groups.md)
14. [Manual Ack Mode](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/14%20Manual%20Ack%20Mode.md)
15. [Client Health Checks](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/15%20Client%20Health%20Checks.md)
16. [Graceful Client Shutdown](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/16%20Graceful%20Client%20Shutdown.md)
17. [Core Concurrency Issues](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/17%20Core%20Concurrency%20Issues.md)
18. [Common Questions](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/18%20Common%20Questions.md)
19. [\[Optional\] More Possible Concurrency Solutions](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/19%20[Optional]%20More%20Possible%20Concurrency%20Solutions.md)
20. [Solving Concurrency Issues](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/20%20Solving%20Concurrency%20Issues.md)
21. [Concurrency Control with the Tickets App](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/21%20Concurrency%20Control%20with%20the%20Tickets%20App.md)
22. [Event Redelivery](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/22%20Event%20Redelivery.md)
23. [Durable Subscriptions](Section%2014%20-%20NATS%20Streaming%20Server%20-%20An%20Event%20Bus%20Implementation/23%20Durable%20Subscriptions.md)

### Section 15 - Connecting to NATS in a Node JS World

- 구성: 강의 17개 · 1시간 22분
- Node.js에서 재사용 가능한 NATS 리스너와 퍼블리셔를 구현하고 이벤트 타입을 안전하게 관리한다.

1. [Reusable NATS Listeners](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/01%20Reusable%20NATS%20Listeners.md)
2. [The Listener Abstract Class](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/02%20The%20Listener%20Abstract%20Class.md)
3. [Extending the Listener](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/03%20Extending%20the%20Listener.md)
4. [Quick Refactor](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/04%20Quick%20Refactor.md)
5. [Leveraging TypeScript for Listener Validation](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/05%20Leveraging%20TypeScript%20for%20Listener%20Validation.md)
6. [Subjects Enum](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/06%20Subjects%20Enum.md)
7. [Custom Event Interface](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/07%20Custom%20Event%20Interface.md)
8. [Enforcing Listener Subjects](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/08%20Enforcing%20Listener%20Subjects.md)
9. [Quick Note - 'readonly' in Typescript](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/09%20Quick%20Note%20-%20'readonly'%20in%20Typescript.md)
10. [Enforcing Data Types](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/10%20Enforcing%20Data%20Types.md)
11. [Where Does this Get Used?](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/11%20Where%20Does%20this%20Get%20Used.md)
12. [Custom Publisher](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/12%20Custom%20Publisher.md)
13. [Using the Custom Publisher](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/13%20Using%20the%20Custom%20Publisher.md)
14. [Awaiting Event Publication](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/14%20Awaiting%20Event%20Publication.md)
15. [Common Event Definitions Summary](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/15%20Common%20Event%20Definitions%20Summary.md)
16. [Updating the Common Module](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/16%20Updating%20the%20Common%20Module.md)
17. [Restarting NATS](Section%2015%20-%20Connecting%20to%20NATS%20in%20a%20Node%20JS%20World/17%20Restarting%20NATS.md)

### Section 16 - Managing a NATS Client

- 구성: 강의 19개 · 1시간 37분
- 서비스 전체에서 공유할 NATS 클라이언트를 관리하고 연결·종료·환경 변수 처리를 안정화한다.

1. [Publishing Ticket Creation](Section%2016%20-%20Managing%20a%20NATS%20Client/01%20Publishing%20Ticket%20Creation.md)
2. [More on Publishing](Section%2016%20-%20Managing%20a%20NATS%20Client/02%20More%20on%20Publishing.md)
3. [NATS Client Singleton](Section%2016%20-%20Managing%20a%20NATS%20Client/03%20NATS%20Client%20Singleton.md)
4. [Node Nats Streaming Installation](Section%2016%20-%20Managing%20a%20NATS%20Client/04%20Node%20Nats%20Streaming%20Installation.md)
5. [Remember Mongoose?](Section%2016%20-%20Managing%20a%20NATS%20Client/05%20Remember%20Mongoose.md)
6. [TS Error - Did you forget to include 'void' in your type argument](Section%2016%20-%20Managing%20a%20NATS%20Client/06%20TS%20Error%20-%20Did%20you%20forget%20to%20include%20'void'%20in%20your%20type%20argument.md)
7. [Singleton Implementation](Section%2016%20-%20Managing%20a%20NATS%20Client/07%20Singleton%20Implementation.md)
8. [Accessing the NATS Client](Section%2016%20-%20Managing%20a%20NATS%20Client/08%20Accessing%20the%20NATS%20Client.md)
9. [Graceful Shutdown](Section%2016%20-%20Managing%20a%20NATS%20Client/09%20Graceful%20Shutdown.md)
10. [Successful Listen!](Section%2016%20-%20Managing%20a%20NATS%20Client/10%20Successful%20Listen!.md)
11. [Ticket Update Publishing](Section%2016%20-%20Managing%20a%20NATS%20Client/11%20Ticket%20Update%20Publishing.md)
12. [Failed Event Publishing](Section%2016%20-%20Managing%20a%20NATS%20Client/12%20Failed%20Event%20Publishing.md)
13. [Handling Publish Failures](Section%2016%20-%20Managing%20a%20NATS%20Client/13%20Handling%20Publish%20Failures.md)
14. [Fixing a Few Tests](Section%2016%20-%20Managing%20a%20NATS%20Client/14%20Fixing%20a%20Few%20Tests.md)
15. [Redirecting Imports](Section%2016%20-%20Managing%20a%20NATS%20Client/15%20Redirecting%20Imports.md)
16. [Providing a Mock Implementation](Section%2016%20-%20Managing%20a%20NATS%20Client/16%20Providing%20a%20Mock%20Implementation.md)
17. [Test-Suite Wide Mocks](Section%2016%20-%20Managing%20a%20NATS%20Client/17%20Test-Suite%20Wide%20Mocks.md)
18. [Ensuring Mock Invocations](Section%2016%20-%20Managing%20a%20NATS%20Client/18%20Ensuring%20Mock%20Invocations.md)
19. [NATS Env Variables](Section%2016%20-%20Managing%20a%20NATS%20Client/19%20NATS%20Env%20Variables.md)

### Section 17 - Cross-Service Data Replication In Action

- 구성: 강의 28개 · 2시간 44분
- 주문 서비스를 구축하며 서비스 간 데이터 복제, 이벤트 수신과 주문 생성·취소 흐름을 구현한다.

1. [The Orders Service](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/01%20The%20Orders%20Service.md)
2. [Scaffolding the Orders Service](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/02%20Scaffolding%20the%20Orders%20Service.md)
3. [A Touch More Setup](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/03%20A%20Touch%20More%20Setup.md)
4. [Ingress Routing Rules](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/04%20Ingress%20Routing%20Rules.md)
5. [Scaffolding a Few Route Handlers](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/05%20Scaffolding%20a%20Few%20Route%20Handlers.md)
6. [Subtle Service Coupling](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/06%20Subtle%20Service%20Coupling.md)
7. [Associating Orders and Tickets](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/07%20Associating%20Orders%20and%20Tickets.md)
8. [Order Model Setup](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/08%20Order%20Model%20Setup.md)
9. [The Need for an Enum](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/09%20The%20Need%20for%20an%20Enum.md)
10. [Creating an Order Status Enum](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/10%20Creating%20an%20Order%20Status%20Enum.md)
11. [More on Mongoose Refs](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/11%20More%20on%20Mongoose%20Refs.md)
12. [Defining the Ticket Model](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/12%20Defining%20the%20Ticket%20Model.md)
13. [Order Creation Logic](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/13%20Order%20Creation%20Logic.md)
14. [Finding Reserved Tickets](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/14%20Finding%20Reserved%20Tickets.md)
15. [Convenience Document Methods](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/15%20Convenience%20Document%20Methods.md)
16. [Order Expiration Times](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/16%20Order%20Expiration%20Times.md)
17. [globalThis has no index signature TS Error](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/17%20globalThis%20has%20no%20index%20signature%20TS%20Error.md)
18. [Test Suite Setup](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/18%20Test%20Suite%20Setup.md)
19. [Small Update for "Value of type 'typeof ObjectId' is not callable"](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/19%20Small%20Update%20for%20'Value%20of%20type%20'typeof%20ObjectId'%20is%20not%20callable'.md)
20. [Asserting Tickets Exist](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/20%20Asserting%20Tickets%20Exist.md)
21. [Asserting Reserved Tickets](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/21%20Asserting%20Reserved%20Tickets.md)
22. [Testing the Success Case](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/22%20Testing%20the%20Success%20Case.md)
23. [Fetching a User's Orders](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/23%20Fetching%20a%20User's%20Orders.md)
24. [A Slightly Complicated Test](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/24%20A%20Slightly%20Complicated%20Test.md)
25. [Fetching Individual Orders](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/25%20Fetching%20Individual%20Orders.md)
26. [Does Fetching Work?](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/26%20Does%20Fetching%20Work.md)
27. [Cancelling an Order](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/27%20Cancelling%20an%20Order.md)
28. [Can We Cancel?](Section%2017%20-%20Cross-Service%20Data%20Replication%20In%20Action/28%20Can%20We%20Cancel.md)

### Section 18 - Understanding Event Flow

- 구성: 강의 6개 · 30분
- 주문과 티켓 서비스 사이의 이벤트 흐름을 설계하고 이벤트 발행 동작을 테스트한다.

1. [Orders Service Events](Section%2018%20-%20Understanding%20Event%20Flow/01%20Orders%20Service%20Events.md)
2. [Creating the Events](Section%2018%20-%20Understanding%20Event%20Flow/02%20Creating%20the%20Events.md)
3. [Implementing the Publishers](Section%2018%20-%20Understanding%20Event%20Flow/03%20Implementing%20the%20Publishers.md)
4. [Publishing the Order Creation](Section%2018%20-%20Understanding%20Event%20Flow/04%20Publishing%20the%20Order%20Creation.md)
5. [Publishing Order Cancellation](Section%2018%20-%20Understanding%20Event%20Flow/05%20Publishing%20Order%20Cancellation.md)
6. [Testing Event Publishing](Section%2018%20-%20Understanding%20Event%20Flow/06%20Testing%20Event%20Publishing.md)

### Section 19 - Listening for Events and Handling Concurrency Issues

- 구성: 강의 48개 · 4시간 13분
- 이벤트 버전 관리와 낙관적 동시성 제어로 순서가 어긋난 이벤트 및 예약된 티켓 수정 문제를 해결한다.

1. [Heads Up Regarding Some Mongoose TS Errors](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/01%20Heads%20Up%20Regarding%20Some%20Mongoose%20TS%20Errors.md)
2. [Time for Listeners!](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/02%20Time%20for%20Listeners!.md)
3. [Reminder on Listeners](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/03%20Reminder%20on%20Listeners.md)
4. [Blueprint for Listeners](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/04%20Blueprint%20for%20Listeners.md)
5. [A Few More Reminders](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/05%20A%20Few%20More%20Reminders.md)
6. [Simple onMessage Implementation](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/06%20Simple%20onMessage%20Implementation.md)
7. [ID Adjustment](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/07%20ID%20Adjustment.md)
8. [Ticket Updated Listener Implementation](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/08%20Ticket%20Updated%20Listener%20Implementation.md)
9. [Initializing the Listeners](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/09%20Initializing%20the%20Listeners.md)
10. [A Quick Manual Test](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/10%20A%20Quick%20Manual%20Test.md)
11. [Clear Concurrency Issues](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/11%20Clear%20Concurrency%20Issues.md)
12. [Reminder on Versioning Records](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/12%20Reminder%20on%20Versioning%20Records.md)
13. [Optimistic Concurrency Control](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/13%20Optimistic%20Concurrency%20Control.md)
14. [Mongoose Update-If-Current](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/14%20Mongoose%20Update-If-Current.md)
15. [Implementing OCC with Mongoose](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/15%20Implementing%20OCC%20with%20Mongoose.md)
16. [Test functions cannot both take a 'done' callback and return something Error](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/16%20Test%20functions%20cannot%20both%20take%20a%20'done'%20callback%20and%20return%20something.md)
17. [Testing OCC](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/17%20Testing%20OCC.md)
18. [One More Test](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/18%20One%20More%20Test.md)
19. [Who Updates Versions?](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/19%20Who%20Updates%20Versions.md)
20. [Including Versions in Events](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/20%20Including%20Versions%20in%20Events.md)
21. [Updating Tickets Event Definitions](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/21%20Updating%20Tickets%20Event%20Definitions.md)
22. [Property 'version' is missing TS Errors After Running Skaffold](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/22%20Property%20'version'%20is%20missing%20TS%20Errors%20After%20Running%20Skaffold.md)
23. [Applying a Version Query](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/23%20Applying%20a%20Version%20Query.md)
24. [Did it Work?](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/24%20Did%20it%20Work.md)
25. [Abstracted Query Method](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/25%20Abstracted%20Query%20Method.md)
26. [\[Optional\] Versioning Without Update-If-Current](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/26%20[Optional]%20Versioning%20Without%20Update-If-Current.md)
27. [Testing Listeners](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/27%20Testing%20Listeners.md)
28. [A Complete Listener Test](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/28%20A%20Complete%20Listener%20Test.md)
29. [Testing the Ack Call](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/29%20Testing%20the%20Ack%20Call.md)
30. [Testing the Ticket Updated Listener](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/30%20Testing%20the%20Ticket%20Updated%20Listener.md)
31. [Success Case Testing](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/31%20Success%20Case%20Testing.md)
32. [Out-Of-Order Events](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/32%20Out-Of-Order%20Events.md)
33. [The Next Few Videos](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/33%20The%20Next%20Few%20Videos.md)
34. [Fixing a Few Tests](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/34%20Fixing%20a%20Few%20Tests.md)
35. [Listeners in the Tickets Service](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/35%20Listeners%20in%20the%20Tickets%20Service.md)
36. [Building the Listener](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/36%20Building%20the%20Listener.md)
37. [Strategies for Locking a Ticket](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/37%20Strategies%20for%20Locking%20a%20Ticket.md)
38. [Reserving a Ticket](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/38%20Reserving%20a%20Ticket.md)
39. [Setup for Testing Reservation](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/39%20Setup%20for%20Testing%20Reservation.md)
40. [Test Implementation](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/40%20Test%20Implementation.md)
41. [Missing Update Event](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/41%20Missing%20Update%20Event.md)
42. [Private vs Protected Properties](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/42%20Private%20vs%20Protected%20Properties.md)
43. [Publishing While Listening](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/43%20Publishing%20While%20Listening.md)
44. [Mock Function Arguments](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/44%20Mock%20Function%20Arguments.md)
45. [Order Cancelled Listener](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/45%20Order%20Cancelled%20Listener.md)
46. [A Lightning-Quick Test](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/46%20A%20Lightning-Quick%20Test.md)
47. [Don't Forget to Listen!](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/47%20Don't%20Forget%20to%20Listen!.md)
48. [Rejecting Edits of Reserved Tickets](Section%2019%20-%20Listening%20for%20Events%20and%20Handling/48%20Rejecting%20Edits%20of%20Reserved%20Tickets.md)

### Section 20 - Worker Services

- 구성: 강의 19개 · 1시간 36분
- Bull과 Redis를 사용하는 만료 작업 서비스를 구축해 시간 제한이 지난 주문을 자동 취소한다.

1. [The Expiration Service](Section%2020%20-%20Worker%20Services/01%20The%20Expiration%20Service.md)
2. [Expiration Options](Section%2020%20-%20Worker%20Services/02%20Expiration%20Options.md)
3. [Initial Setup](Section%2020%20-%20Worker%20Services/03%20Initial%20Setup.md)
4. [Skaffold errors - Expiration Image Can't be Pulled](Section%2020%20-%20Worker%20Services/04%20Skaffold%20errors%20-%20Expiration%20Image%20Can't%20be%20Pulled.md)
5. [A Touch of Kubernetes Setup](Section%2020%20-%20Worker%20Services/05%20A%20Touch%20of%20Kubernetes%20Setup.md)
6. [File Sync Setup](Section%2020%20-%20Worker%20Services/06%20File%20Sync%20Setup.md)
7. [Listener Creation](Section%2020%20-%20Worker%20Services/07%20Listener%20Creation.md)
8. [What's Bull All About?](Section%2020%20-%20Worker%20Services/08%20What's%20Bull%20All%20About.md)
9. [Creating a Queue](Section%2020%20-%20Worker%20Services/09%20Creating%20a%20Queue.md)
10. [Queueing a Job on Event Arrival](Section%2020%20-%20Worker%20Services/10%20Queueing%20a%20Job%20on%20Event%20Arrival.md)
11. [Testing Job Processing](Section%2020%20-%20Worker%20Services/11%20Testing%20Job%20Processing.md)
12. [Delaying Job Processing](Section%2020%20-%20Worker%20Services/12%20Delaying%20Job%20Processing.md)
13. [Defining the Expiration Complete Event](Section%2020%20-%20Worker%20Services/13%20Defining%20the%20Expiration%20Complete%20Event.md)
14. [Publishing an Event on Job Processing](Section%2020%20-%20Worker%20Services/14%20Publishing%20an%20Event%20on%20Job%20Processing.md)
15. [Handling an Expiration Event](Section%2020%20-%20Worker%20Services/15%20Handling%20an%20Expiration%20Event.md)
16. [Emitting the Order Cancelled Event](Section%2020%20-%20Worker%20Services/16%20Emitting%20the%20Order%20Cancelled%20Event.md)
17. [Testing the Expiration Complete Listener](Section%2020%20-%20Worker%20Services/17%20Testing%20the%20Expiration%20Complete%20Listener.md)
18. [A Touch More Testing](Section%2020%20-%20Worker%20Services/18%20A%20Touch%20More%20Testing.md)
19. [Listening for Expiration](Section%2020%20-%20Worker%20Services/19%20Listening%20for%20Expiration.md)

### Section 21 - Handling Payments

- 구성: 강의 31개 · 2시간 40분
- 결제 서비스를 만들고 Stripe 결제, 주문 상태 검증, 결제 이벤트와 중복 처리 방지를 구현한다.

1. [The Payments Service](Section%2021%20-%20Handling%20Payments/01%20The%20Payments%20Service.md)
2. [globalThis has no index signature TS Error](Section%2021%20-%20Handling%20Payments/02%20globalThis%20has%20no%20index%20signature%20TS%20Error.md)
3. [Initial Setup](Section%2021%20-%20Handling%20Payments/03%20Initial%20Setup.md)
4. [Replicated Fields](Section%2021%20-%20Handling%20Payments/04%20Replicated%20Fields.md)
5. [Another Order Model!](Section%2021%20-%20Handling%20Payments/05%20Another%20Order%20Model!.md)
6. [Update-If-Current](Section%2021%20-%20Handling%20Payments/06%20Update-If-Current.md)
7. [Replicating Orders](Section%2021%20-%20Handling%20Payments/07%20Replicating%20Orders.md)
8. [Testing Order Creation](Section%2021%20-%20Handling%20Payments/08%20Testing%20Order%20Creation.md)
9. [Marking an Order as Cancelled](Section%2021%20-%20Handling%20Payments/09%20Marking%20an%20Order%20as%20Cancelled.md)
10. [Cancelled Testing](Section%2021%20-%20Handling%20Payments/10%20Cancelled%20Testing.md)
11. [Starting the Listeners](Section%2021%20-%20Handling%20Payments/11%20Starting%20the%20Listeners.md)
12. [Payments Flow with Stripe](Section%2021%20-%20Handling%20Payments/12%20Payments%20Flow%20with%20Stripe.md)
13. [Implementing the Create Charge Handler](Section%2021%20-%20Handling%20Payments/13%20Implementing%20the%20Create%20Charge%20Handler.md)
14. [Validating Order Payment](Section%2021%20-%20Handling%20Payments/14%20Validating%20Order%20Payment.md)
15. [Testing Order Validation Before Payment](Section%2021%20-%20Handling%20Payments/15%20Testing%20Order%20Validation%20Before%20Payment.md)
16. [Testing Same-User Validation](Section%2021%20-%20Handling%20Payments/16%20Testing%20Same-User%20Validation.md)
17. [Stripe Setup](Section%2021%20-%20Handling%20Payments/17%20Stripe%20Setup.md)
18. [Creating a Stripe Secret](Section%2021%20-%20Handling%20Payments/18%20Creating%20a%20Stripe%20Secret.md)
19. [Creating a Charge with Stripe](Section%2021%20-%20Handling%20Payments/19%20Creating%20a%20Charge%20with%20Stripe.md)
20. [Manual Testing of Payments](Section%2021%20-%20Handling%20Payments/20%20Manual%20Testing%20of%20Payments.md)
21. [Automated Payment Testing](Section%2021%20-%20Handling%20Payments/21%20Automated%20Payment%20Testing.md)
22. [Mocked Stripe Client](Section%2021%20-%20Handling%20Payments/22%20Mocked%20Stripe%20Client.md)
23. [A More Realistic Test Setup](Section%2021%20-%20Handling%20Payments/23%20A%20More%20Realistic%20Test%20Setup.md)
24. [Realistic Test Implementation](Section%2021%20-%20Handling%20Payments/24%20Realistic%20Test%20Implementation.md)
25. [Tying an Order and Charge Together](Section%2021%20-%20Handling%20Payments/25%20Tying%20an%20Order%20and%20Charge%20Together.md)
26. [Testing Payment Creation](Section%2021%20-%20Handling%20Payments/26%20Testing%20Payment%20Creation.md)
27. [Publishing a Payment Created Event](Section%2021%20-%20Handling%20Payments/27%20Publishing%20a%20Payment%20Created%20Event.md)
28. [More on Publishing](Section%2021%20-%20Handling%20Payments/28%20More%20on%20Publishing.md)
29. [Marking an Order as Complete](Section%2021%20-%20Handling%20Payments/29%20Marking%20an%20Order%20as%20Complete.md)
30. [Important Info About the Next Lecture - Don't Skip](Section%2021%20-%20Handling%20Payments/30%20Important%20Info%20About%20the%20Next%20Lecture%20-%20Don't%20Skip.md)
31. [Don't Cancel Completed Orders!](Section%2021%20-%20Handling%20Payments/31%20Don't%20Cancel%20Completed%20Orders!.md)

### Section 22 - Back to the Client

- 구성: 강의 21개 · 1시간 43분
- React 클라이언트에 티켓 생성·구매·주문·결제 화면을 연결해 전체 사용자 흐름을 완성한다.

1. [A Few More Pages](Section%2022%20-%20Back%20to%20the%20Client/01%20A%20Few%20More%20Pages.md)
2. [Reminder on Data Fetching with Next](Section%2022%20-%20Back%20to%20the%20Client/02%20Reminder%20on%20Data%20Fetching%20with%20Next.md)
3. [Two Quick Fixes](Section%2022%20-%20Back%20to%20the%20Client/03%20Two%20Quick%20Fixes.md)
4. [Scaffolding a Form](Section%2022%20-%20Back%20to%20the%20Client/04%20Scaffolding%20a%20Form.md)
5. [Sanitizing Price Input](Section%2022%20-%20Back%20to%20the%20Client/05%20Sanitizing%20Price%20Input.md)
6. [Ticket Creation](Section%2022%20-%20Back%20to%20the%20Client/06%20Ticket%20Creation.md)
7. [Listing All Tickets](Section%2022%20-%20Back%20to%20the%20Client/07%20Listing%20All%20Tickets.md)
8. [Reminder on Invalid `Link` with `a` child Errors](Section%2022%20-%20Back%20to%20the%20Client/08%20Reminder%20on%20Invalid%20Link%20with%20a%20child%20Errors.md)
9. [Linking to Wildcard Routes](Section%2022%20-%20Back%20to%20the%20Client/09%20Linking%20to%20Wildcard%20Routes.md)
10. [Creating an Order](Section%2022%20-%20Back%20to%20the%20Client/10%20Creating%20an%20Order.md)
11. [Programmatic Navigation to Wildcard Routes](Section%2022%20-%20Back%20to%20the%20Client/11%20Programmatic%20Navigation%20to%20Wildcard%20Routes.md)
12. [The Expiration Timer](Section%2022%20-%20Back%20to%20the%20Client/12%20The%20Expiration%20Timer.md)
13. [Displaying the Expiration](Section%2022%20-%20Back%20to%20the%20Client/13%20Displaying%20the%20Expiration.md)
14. [Showing a Stripe Payment Form](Section%2022%20-%20Back%20to%20the%20Client/14%20Showing%20a%20Stripe%20Payment%20Form.md)
15. [Module not found - Can't resolve 'prop-types'](Section%2022%20-%20Back%20to%20the%20Client/15%20Module%20not%20found%20-%20Can't%20resolve%20'prop-types'.md)
16. [Configuring Stripe](Section%2022%20-%20Back%20to%20the%20Client/16%20Configuring%20Stripe.md)
17. [Test Credit Card Numbers](Section%2022%20-%20Back%20to%20the%20Client/17%20Test%20Credit%20Card%20Numbers.md)
18. [Paying for an Order](Section%2022%20-%20Back%20to%20the%20Client/18%20Paying%20for%20an%20Order.md)
19. [Filtering Reserved Tickets](Section%2022%20-%20Back%20to%20the%20Client/19%20Filtering%20Reserved%20Tickets.md)
20. [Header Links](Section%2022%20-%20Back%20to%20the%20Client/20%20Header%20Links.md)
21. [Rendering a List of Orders](Section%2022%20-%20Back%20to%20the%20Client/21%20Rendering%20a%20List%20of%20Orders.md)

### Section 23 - CI/CD

- 구성: 강의 30개 · 2시간 17분
- GitHub Actions와 클라우드 Kubernetes 환경을 이용해 테스트·빌드·배포 CI/CD 파이프라인을 구성한다.

1. [Development Workflow](Section%2023%20-%20CI-CD/01%20Development%20Workflow.md)
2. [Git Repository Approaches](Section%2023%20-%20CI-CD/02%20Git%20Repository%20Approaches.md)
3. [Creating a GitHub Action](Section%2023%20-%20CI-CD/03%20Creating%20a%20GitHub%20Action.md)
4. [Adding a CI Test Script](Section%2023%20-%20CI-CD/04%20Adding%20a%20CI%20Test%20Script.md)
5. [Tests in GitHub Actions Hang - Jest did not exit](Section%2023%20-%20CI-CD/05%20Tests%20in%20GitHub%20Actions%20Hang%20-%20Jest%20did%20not%20exit.md)
6. [Running Tests on PR Creation](Section%2023%20-%20CI-CD/06%20Running%20Tests%20on%20PR%20Creation.md)
7. [Output of Failing Tests](Section%2023%20-%20CI-CD/07%20Output%20of%20Failing%20Tests.md)
8. [Running Tests in Parallel](Section%2023%20-%20CI-CD/08%20Running%20Tests%20in%20Parallel.md)
9. [Verifying a Test Run](Section%2023%20-%20CI-CD/09%20Verifying%20a%20Test%20Run.md)
10. [Selective Test Execution](Section%2023%20-%20CI-CD/10%20Selective%20Test%20Execution.md)
11. [Deployment Options](Section%2023%20-%20CI-CD/11%20Deployment%20Options.md)
12. [Creating a Hosted Cluster](Section%2023%20-%20CI-CD/12%20Creating%20a%20Hosted%20Cluster.md)
13. [Reminder on Kubernetes Context](Section%2023%20-%20CI-CD/13%20Reminder%20on%20Kubernetes%20Context.md)
14. [Reminder on Swapping Contexts](Section%2023%20-%20CI-CD/14%20Reminder%20on%20Swapping%20Contexts.md)
15. [The Deployment Plan](Section%2023%20-%20CI-CD/15%20The%20Deployment%20Plan.md)
16. [Building an Image in an Action](Section%2023%20-%20CI-CD/16%20Building%20an%20Image%20in%20an%20Action.md)
17. [Testing the Image Build](Section%2023%20-%20CI-CD/17%20Testing%20the%20Image%20Build.md)
18. [Restarting the Deployment](Section%2023%20-%20CI-CD/18%20Restarting%20the%20Deployment.md)
19. [Applying Kubernetes Manifests](Section%2023%20-%20CI-CD/19%20Applying%20Kubernetes%20Manifests.md)
20. [Prod vs Dev Manifest Files](Section%2023%20-%20CI-CD/20%20Prod%20vs%20Dev%20Manifest%20Files.md)
21. [Manual Secret Creation](Section%2023%20-%20CI-CD/21%20Manual%20Secret%20Creation.md)
22. [Don't Forget Ingress-Nginx!](Section%2023%20-%20CI-CD/22%20Don't%20Forget%20Ingress-Nginx!.md)
23. [Testing Automated Deployment](Section%2023%20-%20CI-CD/23%20Testing%20Automated%20Deployment.md)
24. [Additional Deploy Files](Section%2023%20-%20CI-CD/24%20Additional%20Deploy%20Files.md)
25. [A Successful Deploy!](Section%2023%20-%20CI-CD/25%20A%20Successful%20Deploy!.md)
26. [Buying a Domain Name](Section%2023%20-%20CI-CD/26%20Buying%20a%20Domain%20Name.md)
27. [Three Important Changes Needed to Deploy - Do Not Skip!](Section%2023%20-%20CI-CD/27%20Three%20Important%20Changes%20Needed%20to%20Deploy%20-%20Do%20Not%20Skip!.md)
28. [Configuring the Domain Name](Section%2023%20-%20CI-CD/28%20Configuring%20the%20Domain%20Name.md)
29. [I Really Hope This Works](Section%2023%20-%20CI-CD/29%20I%20Really%20Hope%20This%20Works.md)
30. [Next Steps](Section%2023%20-%20CI-CD/30%20Next%20Steps.md)

### Section 24 - [Appendix A] - Basics of Docker

- 구성: 강의 46개 · 3시간 3분
- Docker 이미지, 컨테이너, Dockerfile, 포트와 볼륨 등 강의에 필요한 Docker 기초를 학습한다.

1. [Finished Code and Diagrams](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/01%20Finished%20Code%20and%20Diagrams.md)
2. [Why Use Docker?](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/02%20Why%20Use%20Docker.md)
3. [What is Docker?](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/03%20What%20is%20Docker.md)
4. [Docker for Mac - Windows](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/04%20Docker%20for%20Mac%20-%20Windows.md)
5. [Installing Docker on macOS](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/05%20Installing%20Docker%20on%20macOS.md)
6. [Installing Docker with WSL2 on Windows 10-11](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/06%20Installing%20Docker%20with%20WSL2%20on%20Windows%2010-11.md)
7. [Installing Docker on Linux](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/07%20Installing%20Docker%20on%20Linux.md)
8. [Using the Docker Client](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/08%20Using%20the%20Docker%20Client.md)
9. [But Really... What's a Container?](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/09%20But%20Really...%20What's%20a%20Container.md)
10. [How's Docker Running on Your Computer?](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/10%20How's%20Docker%20Running%20on%20Your%20Computer.md)
11. [Docker Run in Detail](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/11%20Docker%20Run%20in%20Detail.md)
12. [Overriding Default Commands](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/12%20Overriding%20Default%20Commands.md)
13. [Listing Running Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/13%20Listing%20Running%20Containers.md)
14. [Container Lifecycle](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/14%20Container%20Lifecycle.md)
15. [Restarting Stopped Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/15%20Restarting%20Stopped%20Containers.md)
16. [Removing Stopped Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/16%20Removing%20Stopped%20Containers.md)
17. [Retrieving Output Logs](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/17%20Retrieving%20Output%20Logs.md)
18. [Stopping Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/18%20Stopping%20Containers.md)
19. [Multi-Command Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/19%20Multi-Command%20Containers.md)
20. [Executing Commands in Running Containers](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/20%20Executing%20Commands%20in%20Running%20Containers.md)
21. [The Purpose of the 'it' Flag](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/21%20The%20Purpose%20of%20the%20'it'%20Flag.md)
22. [Getting a Command Prompt in a Container](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/22%20Getting%20a%20Command%20Prompt%20in%20a%20Container.md)
23. [Starting with a Shell](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/23%20Starting%20with%20a%20Shell.md)
24. [Container Isolation](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/24%20Container%20Isolation.md)
25. [Creating Docker Images](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/25%20Creating%20Docker%20Images.md)
26. [Buildkit for Docker Desktop](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/26%20Buildkit%20for%20Docker%20Desktop.md)
27. [Building a Dockerfile](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/27%20Building%20a%20Dockerfile.md)
28. [Dockerfile Teardown](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/28%20Dockerfile%20Teardown.md)
29. [What's a Base Image?](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/29%20What's%20a%20Base%20Image.md)
30. [The Build Process in Detail](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/30%20The%20Build%20Process%20in%20Detail.md)
31. [A Brief Recap](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/31%20A%20Brief%20Recap.md)
32. [Rebuilds with Cache](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/32%20Rebuilds%20with%20Cache.md)
33. [Tagging an Image](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/33%20Tagging%20an%20Image.md)
34. [Quick Note for Windows Users](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/34%20Quick%20Note%20for%20Windows%20Users.md)
35. [Manual Image Generation with Docker Commit](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/35%20Manual%20Image%20Generation%20with%20Docker%20Commit.md)
36. [Project Outline](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/36%20Project%20Outline.md)
37. [Node Server Setup](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/37%20Node%20Server%20Setup.md)
38. [Reminder on Build Kit](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/38%20Reminder%20on%20Build%20Kit.md)
39. [A Few Planned Errors](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/39%20A%20Few%20Planned%20Errors.md)
40. [Base Image Issues](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/40%20Base%20Image%20Issues.md)
41. [A Few Missing Files](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/41%20A%20Few%20Missing%20Files.md)
42. [Copying Build Files](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/42%20Copying%20Build%20Files.md)
43. [Container Port Forwarding](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/43%20Container%20Port%20Forwarding.md)
44. [Specifying a Working Directory](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/44%20Specifying%20a%20Working%20Directory.md)
45. [Unnecessary Rebuilds](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/45%20Unnecessary%20Rebuilds.md)
46. [Minimizing Cache Busting and Rebuilds](Section%2024%20-%20[Appendix%20A]%20-%20Basics%20of%20Docker/46%20Minimizing%20Cache%20Busting%20and%20Rebuilds.md)

### Section 25 - [Appendix B] - Basics of Typescript

- 구성: 강의 75개 · 5시간 41분
- TypeScript의 타입, 인터페이스, 클래스, 제네릭과 Node·Express·React 적용 방법을 기초부터 학습한다.

1. [How to Get Help](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/01%20How%20to%20Get%20Help.md)
2. [TypeScript Overview](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/02%20TypeScript%20Overview.md)
3. [Environment Setup](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/03%20Environment%20Setup.md)
4. [Important Update About ts-node and Axios](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/04%20Important%20Update%20About%20ts-node%20and%20Axios.md)
5. [A First App](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/05%20A%20First%20App.md)
6. [Executing Typescript Code](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/06%20Executing%20Typescript%20Code.md)
7. [One Quick Change](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/07%20One%20Quick%20Change.md)
8. [Catching Errors with TypeScript](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/08%20Catching%20Errors%20with%20TypeScript.md)
9. [Catching More Errors!](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/09%20Catching%20More%20Errors!.md)
10. [Do Not Skip - Course Overview](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/10%20Do%20Not%20Skip%20-%20Course%20Overview.md)
11. [Types](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/11%20Types.md)
12. [More on Types](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/12%20More%20on%20Types.md)
13. [Examples of Types](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/13%20Examples%20of%20Types.md)
14. [Where Do We Use Types?](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/14%20Where%20Do%20We%20Use%20Types.md)
15. [Type Annotations and Inference](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/15%20Type%20Annotations%20and%20Inference.md)
16. [Annotations With Variables](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/16%20Annotations%20With%20Variables.md)
17. [Object Literal Annotations](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/17%20Object%20Literal%20Annotations.md)
18. [Annotations Around Functions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/18%20Annotations%20Around%20Functions.md)
19. [Understanding Inference](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/19%20Understanding%20Inference.md)
20. [The Any Type](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/20%20The%20Any%20Type.md)
21. [Fixing the "Any" Type](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/21%20Fixing%20the%20'Any'%20Type.md)
22. [Delayed Initialization](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/22%20Delayed%20Initialization.md)
23. [When Inference Doesn't Work](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/23%20When%20Inference%20Doesn't%20Work.md)
24. [More on Annotations Around Functions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/24%20More%20on%20Annotations%20Around%20Functions.md)
25. [Inference Around Functions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/25%20Inference%20Around%20Functions.md)
26. [Annotations for Anonymous Functions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/26%20Annotations%20for%20Anonymous%20Functions.md)
27. [Void and Never](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/27%20Void%20and%20Never.md)
28. [Destructuring with Annotations](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/28%20Destructuring%20with%20Annotations.md)
29. [Annotations Around Objects](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/29%20Annotations%20Around%20Objects.md)
30. [Arrays in TypeScript](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/30%20Arrays%20in%20TypeScript.md)
31. [Why Typed Arrays?](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/31%20Why%20Typed%20Arrays.md)
32. [Multiple Typees in Arrays](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/32%20Multiple%20Typees%20in%20Arrays.md)
33. [When to Use Typed Arrays](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/33%20When%20to%20Use%20Typed%20Arrays.md)
34. [Tuples in TypeScript](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/34%20Tuples%20in%20TypeScript.md)
35. [Tuples in Action](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/35%20Tuples%20in%20Action.md)
36. [Why Tuples?](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/36%20Why%20Tuples.md)
37. [Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/37%20Interfaces.md)
38. [Long Type Annotations](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/38%20Long%20Type%20Annotations.md)
39. [Fixing Annotations With Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/39%20Fixing%20Annotations%20With%20Interfaces.md)
40. [Syntax Around Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/40%20Syntax%20Around%20Interfaces.md)
41. [Functions in Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/41%20Functions%20in%20Interfaces.md)
42. [Code Reuse with Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/42%20Code%20Reuse%20with%20Interfaces.md)
43. [General Plan with Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/43%20General%20Plan%20with%20Interfaces.md)
44. [Classes](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/44%20Classes.md)
45. [Basic Inheritance](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/45%20Basic%20Inheritance.md)
46. [Class Method Modifiers](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/46%20Class%20Method%20Modifiers.md)
47. [Fields in Classes](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/47%20Fields%20in%20Classes.md)
48. [Fields with Inheritance](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/48%20Fields%20with%20Inheritance.md)
49. [Where to Use Classes](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/49%20Where%20to%20Use%20Classes.md)
50. [App Overview](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/50%20App%20Overview.md)
51. [Updated Parcel Instructions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/51%20Updated%20Parcel%20Instructions.md)
52. [Bundling with Parcel](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/52%20Bundling%20with%20Parcel.md)
53. [Project Structure](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/53%20Project%20Structure.md)
54. [IMPORTANT Info About Faker Installation](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/54%20IMPORTANT%20Info%20About%20Faker%20Installation.md)
55. [Generating Random Data](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/55%20Generating%20Random%20Data.md)
56. [Type Definition Files](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/56%20Type%20Definition%20Files.md)
57. [Using Type Definition Files](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/57%20Using%20Type%20Definition%20Files.md)
58. [Export Statements in TypeScript](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/58%20Export%20Statements%20in%20TypeScript.md)
59. [Defining a Company](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/59%20Defining%20a%20Company.md)
60. [Important Note About Google Maps Key](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/60%20Important%20Note%20About%20Google%20Maps%20Key.md)
61. [Adding Google Maps Support](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/61%20Adding%20Google%20Maps%20Support.md)
62. [Required Update for New @types Library](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/62%20Required%20Update%20for%20New%20@types%20Library.md)
63. [Google Maps Integration with TypeScript](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/63%20Google%20Maps%20Integration%20with%20TypeScript.md)
64. [Exploring Type Definition Files](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/64%20Exploring%20Type%20Definition%20Files.md)
65. [Hiding Functionality](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/65%20Hiding%20Functionality.md)
66. [Why Use Private Modifiers? Here's Why](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/66%20Why%20Use%20Private%20Modifiers%20Here's%20Why.md)
67. [Adding Markers](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/67%20Adding%20Markers.md)
68. [Duplicate Code](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/68%20Duplicate%20Code.md)
69. [One Possible Solution](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/69%20One%20Possible%20Solution.md)
70. [Restricting Access with Interfaces](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/70%20Restricting%20Access%20with%20Interfaces.md)
71. [Implicit Type Checks](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/71%20Implicit%20Type%20Checks.md)
72. [Showing Popup Windows](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/72%20Showing%20Popup%20Windows.md)
73. [Updating Interface Definitions](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/73%20Updating%20Interface%20Definitions.md)
74. [Optional Implements Clauses](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/74%20Optional%20Implements%20Clauses.md)
75. [App Wrapup](Section%2025%20-%20[Appendix%20B]%20-%20Basics%20of%20Typescript/75%20App%20Wrapup.md)

### Section 26 - Bonus!

- 구성: 강의 1개 · 1분
- 과정과 관련된 추가 자료 및 보너스 안내를 확인한다.

1. [Bonus!](Section%2026%20-%20Bonus!/01%20Bonus!.md)
