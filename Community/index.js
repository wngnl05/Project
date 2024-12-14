const boardCookie = document.cookie.match(/(^| )boardCookie=([^;]+)/)?.[2];  
let boardData = boardCookie ? JSON.parse(decodeURIComponent(boardCookie)) : [
    { "id": "20241214174555", "date": "2024-12-14 17:45", "title": "영화 한 편", "content": "퇴근 후 영화를 하나 봤습니다.<br>감동적이었어요.", comment: ["안녕하세요"] },
    { "id": "20241214164523", "date": "2024-12-14 16:45", "title": "하늘을 바라보며", "content": "퇴근 후 하늘을 보며 산책했습니다.<br>날씨가 좋아서 기분이 좋았어요.", comment: ["굿", "^^"]  },
    { "id": "20241214163512", "date": "2024-12-14 16:35", "title": "책 한 권", "content": "새로운 책을 샀습니다.<br>이번 주말에는 시간을 내서 읽어야겠어요.", comment: ["화이팅"]  }
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


function createDetailBoard(id){
    createBoard() // 초기화
    window.scrollTo(0, 0);

    const detailData = boardData.find(b => b.id == id)
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
        <div id="detailComment">
            <b>댓글</b>
            ${detailData.comment.map(d => `<span class="comment">${d}</span>`).join("")}

            <textarea placeholder="댓긓을 입력해주세요"></textarea>
            <div> <button onclick="writeComment(${detailData.id})">작성</button> </div>
        </div>
    `;
}


function writeBoard(){
    document.querySelector("#boardModalContent input").value = "";
    document.querySelector("#boardModalContent textarea").value = "";
    document.querySelector('#simpleModal').style.display = 'block'
}


function writeComment(id){
    const comment = document.querySelector("#detailComment textarea").value;
    if(!comment){ alert("댓글을 작성해주세요"); return; }

    boardData.find(b => b.id == id).comment.push(comment)
    console.log(boardData)
    document.cookie = `boardCookie=${encodeURIComponent(JSON.stringify(boardData))};`;
    createDetailBoard(id)
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

    boardData.push({id, date, title, content: content.replace(/\n/g, '<br>'), comment: []})
    document.cookie = `boardCookie=${encodeURIComponent(JSON.stringify(boardData))};`;

    // board 새로고침
    window.location.reload();
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
