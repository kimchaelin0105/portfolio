/* ★ 이 파일에서 이미지 경로, 제목, 설명, 링크를 바꾸세요.
   경로는 index.html 기준입니다. 예: assets/images/my-poster.jpg
   이미지 여러 장은 images 배열에 추가하면 팝업 안에 순서대로 표시됩니다. */
const portfolioContent = {
  contact: {
    email: "", // 실제 이메일을 입력하면 CONTACT 팝업에 메일 보내기 버튼이 생깁니다.
    message: "새로운 작업에 대한 이야기, 함께 나눠요.",
  },
  skills: [
    { name: "PHOTOSHOP", image: "assets/images/main/photoshop.png" },
    { name: "ILLUSTRATOR", image: "assets/images/main/illust.png" },
    { name: "GEMINI", image: "assets/images/main/gemini.png" },
    { name: "FIGMA", image: "assets/images/main/figma.png" },
    { name: "GPT", image: "assets/images/main/gpt.png" },
    { name: "VS CODE", image: "assets/images/main/vs.png" },
  ],
  brandOne: [
    { title: "브랜드 WEB SITE", image: "", coverVideo: "assets/videos/pageon_cover.mp4", description: "Page On · 페이지 온 브랜드 웹사이트", url: "projects/page-on-site/index.html", directLink: true },
    { title: "브랜드 BI/BX GUIDE", image: "", description: "브랜드 콘셉트와 아이덴티티 가이드를 소개해 주세요.", images: [] },
    { title: "브랜드 MOCKUP", image: "", description: "브랜드 목업 작업을 소개해 주세요." },
    { title: "브랜드 WEB GUIDE", image: "", description: "웹 디자인 시스템과 가이드를 소개해 주세요." },
  ],
  brandTwo: [
    { title: "브랜드 WEB SITE", image: "", description: "두 번째 브랜드의 웹사이트 작업을 소개해 주세요.", url: "" },
    { title: "브랜드 BI/BX GUIDE", image: "", description: "두 번째 브랜드의 아이덴티티 가이드입니다." },
    { title: "브랜드 MOCKUP", image: "", description: "두 번째 브랜드의 목업 작업입니다." },
    { title: "브랜드 WEB GUIDE", image: "", description: "두 번째 브랜드의 웹 가이드입니다." },
  ],
  visual: [
    { title: "포스터 디자인 01", image: "", description: "포스터의 기획 의도와 작업 과정을 소개해 주세요." },
    { title: "카드 뉴스 01", image: "", description: "여러 장의 카드 뉴스는 images 배열에 경로를 추가해 주세요.", images: [] },
    { title: "상세 페이지 01", image: "", description: "긴 상세 페이지도 팝업 안에서 스크롤하여 볼 수 있습니다." },
    { title: "포스터 디자인 02", image: "", description: "작업 설명을 입력해 주세요." },
    { title: "카드 뉴스 02", image: "", description: "작업 설명을 입력해 주세요." },
  ],
  reels: [
    { title: "릴스 01", image: "", video: "", description: "첫 번째 릴스 영상입니다." },
    { title: "릴스 02", image: "", video: "", description: "두 번째 릴스 영상입니다." },
    { title: "릴스 03", image: "", video: "", description: "세 번째 릴스 영상입니다." },
    { title: "릴스 04", image: "", video: "", description: "네 번째 릴스 영상입니다." },
    { title: "릴스 05", image: "", video: "", description: "다섯 번째 릴스 영상입니다." },
  ],
};
