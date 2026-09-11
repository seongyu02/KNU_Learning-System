# Modern Robotics, Course 6: Capstone Project, Mobile Manipulation

스페셜라이제이션의 마지막 강좌. **궤적 계획 + 주행 거리 측정 + 피드백 제어**를 하나의 프로젝트로 통합해, **모바일 매니퓰레이터(youBot)가 블록을 집어 목표 위치로 옮기도록** 제어하는 소프트웨어를 작성한다.

- 강좌: https://www.mooc.org/learn/modernrobotics-course6
- 구성: 4개 모듈 · 동영상 강의 12개 (**고유 강의 3개 + 앞 강좌 복습 9개**)
- 시뮬레이터: CoppeliaSim
- 진행 상태: ✅ 12/12 정리 완료 (복습 항목은 원본 노트로 연결)

## 프로젝트 구조

```text
마일스톤 1 : youBot 운동학 시뮬레이터 + csv 출력
             바퀴 속도 → 주행 거리 측정 → 섀시 구성 갱신
  ->
마일스톤 2 : 엔드 이펙터 기준 궤적 생성 (8개 구간)
             스탠드오프 → 하강 → 파지 → 들기 → 목표 위 → 내리기 → 놓기 → 치우기
  ->
마일스톤 3 : 피드포워드 + 피드백 제어
             V = [Ad]V_d + K_p X_e + K_i ∫X_e,   [u; θ̇] = J_e⁺ V
  ->
최종 제출  : 세 부분을 통합한 소프트웨어 + 시뮬레이션 결과
```

## 강의 목록

### Module 1 - Introduction to the Capstone Project, and Milestone 1

| # | 강의 | 종류 |
| --- | --- | --- |
| 01 | [Introduction to the Capstone Project: Mobile Manipulation](Module%201%20-%20Introduction/01%20Introduction%20to%20the%20Capstone%20Project%20-%20Mobile.md) | 신규 |
| 02 | [Video Summary of the Capstone Project](Module%201%20-%20Introduction/02%20Video%20Summary%20of%20the%20Capstone%20Project.md) | 신규 |
| 03 | [(Optional Review) Omnidirectional Wheeled Mobile Robots (Part 1 of 2)](<Module 1 - Introduction/03 (Optional Review) Omnidirectional Wheeled Mobile.md>) | 복습 (Course 5) |
| 04 | [(Optional Review) Omnidirectional Wheeled Mobile Robots (Part 2 of 2)](<Module 1 - Introduction/04 (Optional Review) Omnidirectional Wheeled Mobile.md>) | 복습 (Course 5) |
| 05 | [(Optional Review) Odometry (Chapter 13.4)](<Module 1 - Introduction/05 (Optional Review) Odometry (Chapter 13.4).md>) | 복습 (Course 5) |

### Module 2 - Milestone 2: Reference Trajectory Generation

| # | 강의 | 종류 |
| --- | --- | --- |
| 01 | [Milestone 2: Reference Trajectory Generation](Module%202%20-%20Milestone%202/01%20Milestone%202%20-%20Reference%20Trajectory%20Generation.md) | 신규 |
| 02 | [(Optional Review) Point-to-Point Trajectories (Part 1 of 2)](<Module 2 - Milestone 2/02 (Optional Review) Point-to-Point Trajectories.md>) | 복습 (Course 3) |
| 03 | [(Optional Review) Point-to-Point Trajectories (Part 2 of 2)](<Module 2 - Milestone 2/03 (Optional Review) Point-to-Point Trajectories.md>) | 복습 (Course 3) |

### Module 3 - Milestone 3: Feedforward Control

| # | 강의 | 종류 |
| --- | --- | --- |
| 01 | [(Optional Review) Product of Exponentials Formula in the End-Effector Frame](<Module 3 - Milestone 3/01 (Optional Review) Product of Exponentials Formula.md>) | 복습 (Course 2) |
| 02 | [(Optional Review) Body Jacobian](<Module 3 - Milestone 3/02 (Optional Review) Body Jacobian (Chapter 5.1.2).md>) | 복습 (Course 2) |
| 03 | [(Optional Review) Motion Control with Velocity Inputs (Part 3 of 3)](<Module 3 - Milestone 3/03 (Optional Review) Motion Control with Velocity.md>) | 복습 (Course 4) |
| 04 | [(Optional Review) Mobile Manipulation](<Module 3 - Milestone 3/04 (Optional Review) Mobile Manipulation (Chapter.md>) | 복습 (Course 5) |

### Module 4 - Completing the Project and Your Submission

| # | 항목 | 종류 |
| --- | --- | --- |
| 01 | [Completing the Project and Your Submission](Module%204%20-%20Completing%20the%20Project/01%20Completing%20the%20Project%20and%20Your%20Submission.md) | 동영상 없음 (서면 안내 + 동료 평가) |

## 캡스톤에 동원되는 앞 강좌 도구

| 도구 | 출처 | 캡스톤에서의 용도 |
| --- | --- | --- |
| `T(θ) = M e^{[B₁]θ₁} ⋯` | Course 2 (4.1.3) | 팔의 순운동학 `T_0e(θ)` |
| 바디 야코비안 `J_b` | Course 2 (5.1.2~5.1.4) | `J_arm` |
| SE(3) 스크류 경로 | Course 3 (9.1~9.2) | 8개 궤적 구간 생성 |
| 3차/5차 시간 스케일링 | Course 3 (9.2) | 각 구간의 속도 프로파일 |
| 작업 공간 피드포워드 + PI | Course 4 (11.3) | 피드백 컨트롤러 |
| `[X_e] = log(X⁻¹X_d)` | Course 4 (11.3) | 엔드 이펙터 구성 오차 |
| `u = H(0)V_b`, `F = H(0)⁺` | Course 5 (13.2, 13.4) | 메카넘 4륜 운동학, 주행 거리 측정 |
| `J_e = [J_base J_arm]` | Course 5 (13.5) | 바퀴·조인트 속도 계산 |

## 정리 방침

- **복습(Optional Review) 항목은 앞 강좌의 강의와 동일한 영상**이므로 정리본을 중복 작성하지 않고, **원본 노트로 연결하면서 캡스톤에서의 역할과 복습 포인트만** 기록했다.
- **Module 4는 동영상이 없다.** 서면 프로젝트 설명의 구체적 제출 요구사항은 확인하지 못했으므로 **임의로 채우지 않고 상태만 명시**했다.
- MOOC 커리큘럼의 **제목 오기 두 건**(Module 2의 중복된 "Part 1 of 2", Module 3의 "Chapter 4.1.2")은 해당 노트에 주석으로 남겼다.
