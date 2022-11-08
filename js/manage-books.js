
const pageSize=5;
let page=1;
getBooks();

function getBooks(query=`${$('#txt-search').val()}`){
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
            // console.log(http.responseText);
            const books=JSON.parse(http.responseText);
            
            $('#loader').hide();

            if(books.length===0){
                $('#tbl-books').addClass('empty');
            }
         

            $('#tbl-books tbody tr').remove();

            books.forEach(book => {
                const rowHtml=`
                <tr tabindex="0">
                    <td>${book.isbn}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.copies}</td>

                </tr>
                `;
                $('#tbl-books tbody').append(rowHtml);
                
            });
          

        }else{
            // console.error("Something went wrong");
            $('#toast').toast('show');
            // showToast('Failed to load books, try again','info');
        }
    }

});

/* (3) Open the request */
// http.open('GET','https://c600f19b-cb76-4c53-a214-22ef9e66172f.mock.pstmn.io/members',true);
// http.open('GET','http://localhost:8080/lms/api/books',true);
http.open('GET',`http://localhost:8080/lms/api/books?size=${pageSize}&page=${page}&q=${query}`,true);


/* (4) Set additional information for the request */
// details not provide here, meta data set


/* (5) Send the request */
http.send();
// body send, file upload
}



function initPagination(totalBooks){
  

    const totalPages=Math.ceil(totalBooks/pageSize);
    
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
    if(elm && elm.tagName=='A'){
        console.log(eventData.target);
        const activePage=elm.text;
        if(activePage=="Next"){
           
                page++;
                getBooks();
            
           

        }else if(activePage =="Previous"){
            if(page !=0){
                page--;
                getBooks();
            }

            }
           
               
           
            
        }else{
            if(page !== activePage){
                page=activePage;
                getBooks();

            }
            
        } 
       
    
});


$('#txt-search').on('input',()=>{
    console.log("working");
    page=1;
    getBooks();
});



$('#tbl-books tbody').keyup((eventData)=>{
    console.log(eventData.which);
    if(eventData.which==38){
        const elm=document.activeElement.previousElementSibling;
        if(elm instanceof HTMLTableRowElement){
            elm.focus();

        }


    }else if(eventData.which==40){
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


$('#btn-new-book').click(()=>{
    const frmMemberDetail = new bootstrap.Modal(document.getElementById('frm-book-detail'));
    $('#frm-book-detail').addClass('new')
    .on('shown.bs.modal',()=>{
        $("#txt-title").focus();
    });
    frmMemberDetail.show();
    

});




$('#frm-book-detail form').submit((eventData)=> {
    eventData.preventDefault();
    $('#btn-save').click();

});



$('#btn-save').click(async()=>{

    const title=$('#txt-title').val();
    const author=$('#txt-author').val();
    // const contact=$('#txt-contact').val();
    const copies='';
  

    let validated=true;

    $('#txt-title ,#txt-author ,#txt-copies').removeClass('is-invalid');

    // if(!/^[0-9]+$/.test(copies)){
    //     $('#txt-copies').addClass('is-invalid').select().focus();
    //     validated=false;
    // }

    if(!/^[A-Za-z ]+$/.test(author)){ 
        $('#txt-author').addClass('is-invalid').select().focus();
        validated=false;

    }
  
    if(!/^[A-Za-z ]+$/.test(title)){
        $('#txt-title').addClass('is-invalid').select().focus();
        validated=false;

    }

    if(!validated) return;

    try{
        $('#overlay').removeClass('d-none');
       const {isbn}= await saveBook();
        $('#overlay').addClass('d-none');
        showToast(`Book has been saved successfully with the ISBN: ${isbn}`,'success')
        $('#txt-title, #txt-author, #txt-copies').val('');
        $('#txt-title').focus();


    }catch(e){
        $('#overlay').addClass('d-none');
        showToast("Failed to save the books, try again",'warning');
        $('#txt-title').focus();

    }

   




});

function saveBook(){

    return new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest();

        xhr.addEventListener('readystatechange',()=>{
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status===201){
                    resolve(JSON.parse(xhr.responseText));
                }else{
                    reject();
                }

            }
        });

        xhr.open('POST','http://localhost:8080/lms/api/books',true);

        xhr.setRequestHeader('Content-Type','application/json');
        const book={
            title:$("#txt-title").val(),
            author:$("#txt-author").val(),
            copies:$("#txt-copies").val()
        }


        xhr.send(JSON.stringify(book));
  

    });

}





function showToast(msg, msgType='warning'){

    $('#toast').removeClass('text-bg-warning')
    .removeClass('text-bg-primary')
    .removeClass('text-bg-error')
    .removeClass('text-bg-success');

    if(msgType==='success'){
        $('#toast').addClass('text-bg-success')
    }else if(msgType==='error'){
        $('#toast').addClass('text-bg-error')
    }else if(msgType==='info'){
        $('#toast').addClass('text-bg-primary')
    }else {
        $('#toast').addClass('text-bg-warning')
    }
  
  
  
    $('#toast .toast-body').text(msg);
    $('#toast').toast('show');
}
