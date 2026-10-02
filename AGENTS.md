# AI 작업 지침

## Git 커밋 이메일

- 이 저장소에서 AI가 생성하거나 수정하는 커밋은 작성자(author)와 커미터(committer) 이메일을 모두 `gk457@naver.com`으로 설정합니다.
- 커밋 전에 이메일 설정을 확인하고, 다른 이메일이 설정되어 있으면 이 저장소의 로컬 설정만 변경합니다: `git config --local user.email gk457@naver.com`.
- `GIT_AUTHOR_EMAIL` 또는 `GIT_COMMITTER_EMAIL` 환경 변수가 설정을 덮어쓰는 경우에도 두 이메일이 `gk457@naver.com`이 되도록 합니다.
- 기존 커밋을 amend할 때는 기존 작성자 이메일이 유지될 수 있으므로 작성자 이메일도 확인합니다. 작성자 이름은 별도 요청이 없으면 유지합니다.
- 커밋 후 `git log -1 --format='%h Author: %ae Committer: %ce'`로 두 이메일을 확인합니다.
- 전역 Git 설정은 변경하지 않습니다.
