# 타입 정의 (General)

## 원칙
- 타입은 경계(API/DB/외부 연동)에서 엄격하게
- 공유 타입이 있으면 단일 진실 위치를 정한다

## 네이밍
- type/interface/class/enum: PascalCase
- enum 값: PascalCase

## 위치
- models/ 또는 types/ 디렉터리에 중앙화
- API 응답/요청 DTO는 별도 폴더로 분리 권장
