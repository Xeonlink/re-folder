# Commit Message Convention

모든 커밋 메시지는 **`[TYPE] Message`** 형식을 따른다.

## 형식

```
[TYPE] 제목 (50자 이내 권장)
```

- **TYPE**: 대문자, 대괄호 `[]` 안에 작성
- **제목**: 간결하게, 명령형 또는 서술형. 한글/영문 모두 가능
- 제목 끝 마침표(.) 생략

## TYPE 종류

| TYPE         | 용도                                        |
| ------------ | ------------------------------------------- |
| **FEAT**     | 새 기능 추가                                |
| **FIX**      | 버그 수정                                   |
| **REFACTOR** | 코드 구조·패턴 변경 (동작 결과 동일)        |
| **CHORE**    | 빌드, 설정, 의존성, 문서, 폴더/파일 정리 등 |
| **SAVE**     | 작업 중간 저장 (WIP)                        |

## 예시

```text
# ✅ GOOD
[FEAT] Add kiosk teams flow
[FIX] /kiosk/teams not accessable
[REFACTOR] Page 컴포넌트 이름 통일
[REFACTOR] Add react import convention
[CHORE] Add Agents.md for each high valued folders
[CHORE] Rename src/db to src/models
[SAVE] Ready to copy

# ❌ BAD - 타입 없음
Add new feature
Fix bug

# ❌ BAD - 소문자 타입
[feat] Add something
[Fix] Fix typo
```

## 참고

- 최초 생성/템플릿 커밋 등은 예외적으로 타입 없이 쓸 수 있음 (예: `Initial commit from Create Next App`).
