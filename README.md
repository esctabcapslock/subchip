# SUB Chip
- 구독하기

# 구조
- 서버가 있다.
- 크롤링
    - 주기적으로 (대력 4h) 긁어와서 읽기 -> 주소 맞게 파싱하기 -> db저장
        - TODO db에서 목록읽기
            - TODO 이를 바탕으로 올바른 class를 호출하도록 함.
                - 새 class 만들때마다 어디 자동으로 저장되는 배열 없나
            - 각 class에서 json 파싱해서 반환
        - TODO db에 저장한다.
    - 또 서버 요청 있을때 하기
- 서버
    - 유저별로 체널? 이 있을듯
    - TODO insert
        - 새 체널을 등록하는 코드
    - TODO select
        - 가장 최근의 글부터 페이징해서 보여주는 기능
        - 특정 host나 article을 보여주는 기능
    - 특정 파일은 숨겨야 접근할 수 있는 기능


- chatGPT 프론트엔드 짜달라고 하기
```prompt
여러가지 뉴스 기사를 보여주는 웹사이트를 만들것임.
깔끔한 프론트엔드 페이지 코드를 짜줘.
`/api/getarticle`로 get요청을 보내면 답변이 옴. 
{언론사Id:number, 언론사제목:string, 기사ID:number, 기사제목:string, 시간:DateString, tag:String }[]
이런 형식임. 

`/api/getarticle/press/{언론사Id}`면 특정 언론사 기사 목록만 오는거고
`/api/getarticle/tag/{tagname}`면 tagname에 해당되는 기사들만 오는거임.

`/api/list/tag`면 tag목록이 오고, `/api/list/press`면 언론사 목록이 올꺼야.

짜줘.
```
    