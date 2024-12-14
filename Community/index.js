const boardCookie = document.cookie.match(/(^| )boardCookie=([^;]+)/)?.[2];  
let boardData = boardCookie ? JSON.parse(decodeURIComponent(boardCookie)) : [
    { "id": "20241214162200", "date": "2024-12-14 16:22", "title": "새로운 시작", "content": "오늘부터 새로운 프로젝트가 시작됩니다.<br>기대가 됩니다." },
    { "id": "20241214163045", "date": "2024-12-14 16:30", "title": "맛있는 점심", "content": "오늘은 동료들과 맛있는 피자를 먹었습니다.<br>정말 맛있었어요." },
    { "id": "20241214163512", "date": "2024-12-14 16:35", "title": "책 한 권", "content": "새로운 책을 샀습니다.<br>이번 주말에는 시간을 내서 읽어야겠어요." },
    { "id": "20241214164523", "date": "2024-12-14 16:45", "title": "하늘을 바라보며", "content": "퇴근 후 하늘을 보며 산책했습니다.<br>날씨가 좋아서 기분이 좋았어요." },
    { "id": "20241214170054", "date": "2024-12-14 17:00", "title": "운동 시작", "content": "오늘부터 헬스장에 등록했습니다.<br>열심히 운동해야겠어요!" },
    { "id": "20241214171038", "date": "2024-12-14 17:10", "title": "친구와의 대화", "content": "오랜만에 친구와 전화로 긴 대화를 나눴습니다.<br>너무 반가웠어요." },
    { "id": "20241214173012", "date": "2024-12-14 17:30", "title": "저녁 준비", "content": "오늘은 간단히 떡볶이를 만들어 먹었습니다.<br>너무 맛있었어요." },
    { "id": "20241214174555", "date": "2024-12-14 17:45", "title": "영화 한 편", "content": "퇴근 후 영화를 하나 봤습니다.<br>감동적이었어요." },
]


window.onload = async () => {
    const nid = (new URLSearchParams(window.location.search)).get('nid');
    if (nid) { createDetailBoard(nid) } 
    else { createBoard() }
};




function createBoard(){
    // board 초기화
    document.querySelector("#boardTable tbody").innerHTML=""

    if(boardData.length==0){ boardData = [{ id: "1", date: "2024-12-14 16:22", title: "글이 없어요...", content: "안녕하세요" }] }

    // board에 글쓰기
    let cnt = 1
    for({id, date, title, content} of boardData){
        document.querySelector("#boardTable tbody").innerHTML += `
            <td>${cnt++}</td>
            <td onclick="createDetailBoard('${id}')">${title}</td>
            <td>${date}</td>
        `;
    }
}


function createDetailBoard(nid){
    createBoard() // 초기화
    window.scrollTo(0, 0);

    const detailData = boardData.find(b => b.id == nid)
    document.querySelector("#boardDetail").style.display = "block"
    document.querySelector("#boardDetail").innerHTML=`
        <div id="detailTitle">
            <div id="detailTitleContainer">
                <b>${detailData.title}</b>
                <span>${detailData.date}</span>
            </div>
            <button onclick="deleteBoard(${detailData.id})">삭제</button>
        </div>
        <div id="detailContent">
            ${detailData.content}
        </div>
    `;
}


function writeBoard(){
    document.querySelector("#boardModalContent input").value = "";
    document.querySelector("#boardModalContent textarea").value = "";
    document.querySelector('#simpleModal').style.display = 'block'
}


function openBoard(id){
    window.location.search = `?nid=${id}`;
}


function searchBoard(event=null){
    if(event && event.key != "Enter"){ return; }

    const searchText = document.querySelector("#headerContainer input").value;
    if(!searchText){ alert("검색어를 입력해주세요.") }

    const filterBoard = boardData.filter(b => b.title.includes(searchText));
    if(filterBoard.length==0){
        alert("검색된 값이 없습니다.");
        return;
    }

    let cnt = 1
    document.querySelector("#boardTable tbody").innerHTML = "";
    for({id, date, title, content} of filterBoard){
        document.querySelector("#boardTable tbody").innerHTML += `
            <td>${cnt++}</td>
            <td onclick="createDetailBoard('${id}')">${title}</td>
            <td>${date}</td>
        `;
    }
}


function saveBoard(){
    const id = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().replace(/[-T:]/g, '').slice(0, 14);
    const date = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().slice(0, 16).replace("T", " ");
    const title = document.querySelector("#boardModalContent input").value;
    const content = document.querySelector("#boardModalContent textarea").value;

    if(!title || !content){ 
        alert("제목과 본문을 입력해주세요");
        return;
    }

    boardData.push({id, date, title, content: content.replace(/\n/g, '<br>')})
    document.cookie = `boardCookie=${encodeURIComponent(JSON.stringify(boardData))};`;

    // board 새로고침
    createBoard()
    document.querySelector('#simpleModal').style.display = 'none'
}


function deleteBoard(id){
    if(confirm("삭제하시겠습니까?")){
        const filterBoard = boardData.filter(b => b.id != id);
        
        // board 삭제
        boardData = filterBoard
        document.cookie = `boardCookie=${encodeURIComponent(JSON.stringify(filterBoard))};`;
    
        // board 새로고침
        window.location.href = "/Project/Community/index.html"
    }
}