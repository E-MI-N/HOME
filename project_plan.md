# 자캐 개인 홈페이지

## 1. Project Description
자작 캐릭터(자캐) 개인 홈페이지로, 캐릭터의 프로필·갤러리·아카이브·TRPG 기록을 공개적으로 소개하는 팬/크리에이터 개인 웹사이트입니다. 다크 판타지 분위기의 디자인을 기반으로 제작합니다.

## 2. Page Structure
- `/` - Home (캐릭터 히어로 소개)
- `/profile` - Profile (캐릭터 상세 프로필 & 스탯)
- `/gallery` - Gallery (일러스트/이미지 갤러리)
- `/archive` - Archive (스토리/기록 아카이브)
- `/trpg` - TRPG (TRPG 세션 및 캠페인 기록)

## 3. Core Features
- [x] 다크 판타지 스타일 전체 레이아웃
- [x] 공유 네비게이션 (고정 상단 바, 스크롤 시 배경 변환)
- [x] Home: 캐릭터 히어로 섹션 + 미니 소개
- [x] Profile: 캐릭터 상세 정보, 성격, 능력치
- [x] Gallery: 이미지 그리드 + 라이트박스
- [x] Archive: 글 목록 + 태그 필터
- [x] TRPG: 세션/캠페인 기록 카드

## 4. Data Model Design
백엔드 없이 정적 mock 데이터로 운영 (추후 Supabase 연동 확장 가능)

## 5. Backend / Third-party Integration Plan
- Supabase: 미연동 (향후 콘텐츠 관리 필요 시 연동 검토)
- Shopify / Stripe: 불필요

## 6. Development Phase Plan

### Phase 1: 전체 페이지 기본 UI 구축
- Goal: 5개 페이지 전체 UI 및 공통 레이아웃 구현
- Deliverable: Navbar, Footer, Home, Profile, Gallery, Archive, TRPG 페이지
