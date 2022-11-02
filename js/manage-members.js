
const pageSize=5;
let page=1;
getMembers();

function getMembers(query=`${$('#txt-search').val()}`){
/* (1) Initiate a XMLHttpRequest object */
const http=new XMLHttpRequest();


/* (2) set an event listener to detect state change  */
http.addEventListener('readystatechange',()=>{
    // console.log(http.readyState);
    if(http.readyState===http.DONE){//1 ready state
        if(http.status===200){// 2 state code
            console.log("Response eka awa.. awa...awa....");
            // console.log(http.responseXML);
            const totalMembers= +http.getResponseHeader('X-Total-Count');
            initPagination(totalMembers);
            console.log(http.responseText);
            const members=JSON.parse(http.responseText);
            
            $('#loader').hide();
            if(members.length===0){
                $('#tbl-members').addClass('empty');
            }else{
                $('#tbl-members').removeClass('empty');

            }
            console.log(members);
            $('#tbl-members tbody tr').remove();
            members.forEach(member => {
                const rowHtml=`
                <tr tabindex="0">
                    <td>${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.address}</td>
                    <td>${member.contact}</td>

                </tr>
                `;
                $('#tbl-members tbody').append(rowHtml);
                
            });
          

        }else{
            // console.error("Something went wrong");
            $('#toast').show();
        }
    }

});

/* (3) Open the request */
// http.open('GET','https://c600f19b-cb76-4c53-a214-22ef9e66172f.mock.pstmn.io/members',true);
// http.open('GET','http://localhost:8080/lms/api/members',true);
http.open('GET',`http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}&q=${query}`,true);


/* (4) Set additional information for the request */
// details not provide here, meta data set


/* (5) Send the request */
http.send();
// body send, file upload
}

function initPagination(totalMembers){
    console.log(totalMembers);
    const totalPages=Math.ceil(totalMembers/pageSize);
    if(totalPages<=1){
        $('#pagination').addClass('d-none');

    }else{
        $('#pagination').removeClass('d-none');

    }
    let html='';
    for (let i = 1; i <= totalPages; i++) {
        html+=` <li  class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`
       
    }

    html=`
    <li  class="page-item ${page===1? 'disable':''}"><a class="page-link" href="#">Previous</a></li>
    ${html}
   
    <li  class="page-item ${page===totalPages? 'disable':''}"><a class="page-link" href="#">Next</a></li>
    `;


    $('#pagination > .pagination').html(html);

}

$('#pagination > .pagination').click((eventData)=>{
    const elm=eventData.target;
    if(elm && elm.tagName ==='A' ){
        const activePage=($(elm).text());
        if(activePage=== 'Next'){
            page++;
            getMembers();
        } else if(activePage==='Previous') {
            page--;
            getMembers();
            
        }else{
            if(page !== activePage){
                page=+activePage;
                getMembers();
            }
          
        }
    }
});

$('#txt-search').on('input',()=>{
    console.log("working");
    page=1;
    getMembers();

});

$('#tbl-members tbody').keyup((eventData)=>{
    // console.log(eventData.whitch);
    if(eventData.which===38){
        console.log('Up arrow key pressed');
        const elm=document.activeElement.previousElementSibling;
        if(elm instanceof HTMLTableRowElement){
            elm.focus();
        }

    }else if(eventData.which===40){
        const elm=document.activeElement.nextElementSibling;
        if(elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }
});

$(document).keydown((eventData)=>{
    console.log(eventData);
    if(eventData.ctrlKey && eventData.key==="/"){
        $('#txt-search').focus();
    }

});